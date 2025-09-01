const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';
const JWT_EXPIRES_IN = '15m';
const JWT_REFRESH_EXPIRES_IN = '7d';
const SALT_ROUNDS = 12;

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// File paths
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const LOGINS_FILE = path.join(__dirname, 'data', 'logins.json');

// Ensure data directory exists
const ensureDataDirectory = async () => {
  try {
    await fs.access(path.join(__dirname, 'data'));
  } catch {
    await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
  }
};

// Initialize data files
const initializeDataFiles = async () => {
  await ensureDataDirectory();
  
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify([]));
  }
  
  try {
    await fs.access(LOGINS_FILE);
  } catch {
    await fs.writeFile(LOGINS_FILE, JSON.stringify([]));
  }
};

// Read users from file
const readUsers = async () => {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

// Write users to file
const writeUsers = async (users) => {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users file:', error);
    throw error;
  }
};

// Read login logs from file
const readLoginLogs = async () => {
  try {
    const data = await fs.readFile(LOGINS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading login logs file:', error);
    return [];
  }
};

// Write login logs to file
const writeLoginLogs = async (logs) => {
  try {
    await fs.writeFile(LOGINS_FILE, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('Error writing login logs file:', error);
    throw error;
  }
};

// Generate JWT tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

// Verify JWT token
const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// Verify password
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Check password strength
const checkPasswordStrength = (password) => {
  const feedback = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password should be at least 8 characters long');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include lowercase letters');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include uppercase letters');
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include numbers');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include special characters');
  }

  let strength = 'weak';
  if (score >= 5) strength = 'strong';
  else if (score >= 3) strength = 'good';
  else if (score >= 2) strength = 'fair';

  return { score, strength, feedback };
};

// Sanitize user data
const sanitizeUser = (user) => {
  const { passwordHash, ...sanitizedUser } = user;
  return sanitizedUser;
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, ipAddress, location } = req.body;

    // Validate input
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const users = await readUsers();
    const existingUser = users.find(u => u.username === username || u.email === email);
    
    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ error: 'Username must be 3-20 characters, alphanumeric with underscores' });
    }

    // Check password strength
    const passwordStrength = checkPasswordStrength(password);
    if (passwordStrength.score < 2) {
      return res.status(400).json({ 
        error: 'Password is too weak',
        feedback: passwordStrength.feedback 
      });
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      passwordHash: await hashPassword(password),
      firstName,
      lastName,
      role: 'user',
      ipAddress,
      location,
      registrationDate: new Date().toISOString(),
      lastLogin: null,
      failedLoginAttempts: 0,
      accountLocked: false,
      isActive: true
    };

    users.push(newUser);
    await writeUsers(users);

    // Log registration
    const loginLogs = await readLoginLogs();
    loginLogs.push({
      id: Date.now().toString(),
      userId: newUser.id,
      action: 'register',
      timestamp: new Date().toISOString(),
      ipAddress,
      location,
      success: true
    });
    await writeLoginLogs(loginLogs);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser);

    res.status(201).json({
      user: sanitizeUser(newUser),
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const { ipAddress, location } = req;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const users = await readUsers();
    const user = users.find(u => u.username === username);
    
    if (!user) {
      // Log failed login attempt
      const loginLogs = await readLoginLogs();
      loginLogs.push({
        id: Date.now().toString(),
        userId: 'unknown',
        action: 'login',
        timestamp: new Date().toISOString(),
        ipAddress,
        location,
        success: false,
        reason: 'User not found'
      });
      await writeLoginLogs(loginLogs);

      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Check if account is locked
    if (user.accountLocked) {
      return res.status(403).json({ error: 'Account is locked due to too many failed attempts' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      // Increment failed login attempts
      user.failedLoginAttempts += 1;
      
      // Lock account after 5 failed attempts
      if (user.failedLoginAttempts >= 5) {
        user.accountLocked = true;
      }
      
      await writeUsers(users);

      // Log failed login attempt
      const loginLogs = await readLoginLogs();
      loginLogs.push({
        id: Date.now().toString(),
        userId: user.id,
        action: 'login',
        timestamp: new Date().toISOString(),
        ipAddress,
        location,
        success: false,
        reason: 'Invalid password',
        failedAttempts: user.failedLoginAttempts
      });
      await writeLoginLogs(loginLogs);

      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Reset failed login attempts on successful login
    user.failedLoginAttempts = 0;
    user.lastLogin = new Date().toISOString();
    await writeUsers(users);

    // Log successful login
    const loginLogs = await readLoginLogs();
    loginLogs.push({
      id: Date.now().toString(),
      userId: user.id,
      action: 'login',
      timestamp: new Date().toISOString(),
      ipAddress,
      location,
      success: true
    });
    await writeLoginLogs(loginLogs);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    res.json({
      user: sanitizeUser(user),
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh token
app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token is required' });
    }

    // Verify refresh token
    const payload = verifyToken(refreshToken, JWT_REFRESH_SECRET);

    // Find user
    const users = await readUsers();
    const user = users.find(u => u.id === payload.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new access token
    const { accessToken } = generateTokens(user);

    res.json({ accessToken });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Logout user
app.post('/api/auth/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Add refresh token to blacklist (in production, use Redis or similar)
      // For demo purposes, we'll just acknowledge the logout
    }

    res.json({ message: 'Logout successful' });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const payload = verifyToken(token, JWT_SECRET);

    // Find user
    const users = await readUsers();
    const user = users.find(u => u.id === payload.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({ user: sanitizeUser(user) });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Get login logs
app.get('/api/auth/logs', async (req, res) => {
  try {
    const logs = await readLoginLogs();
    res.json(logs);
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Initialize server
const startServer = async () => {
  try {
    await initializeDataFiles();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check available at: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start server
startServer();