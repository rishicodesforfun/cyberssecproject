import CryptoJS from 'crypto-js';

// User interface (for frontend use - without password hash)
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  ipAddress?: string;
  location?: string;
  registrationDate: string;
  lastLogin?: string;
  failedLoginAttempts: number;
  accountLocked: boolean;
  isActive: boolean;
}

// Password strength checker (browser-compatible)
export const checkPasswordStrength = (password: string): {
  score: number;
  strength: 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password should be at least 8 characters long');
  }

  // Complexity checks
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

  // Determine strength
  let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';
  if (score >= 5) strength = 'strong';
  else if (score >= 3) strength = 'good';
  else if (score >= 2) strength = 'fair';

  return { score, strength, feedback };
};

// Generate secure random token (browser-compatible)
export const generateSecureToken = (length: number = 32): string => {
  return CryptoJS.lib.WordArray.random(length).toString();
};

// Encrypt sensitive data (browser-compatible)
export const encryptData = (data: string, secret: string): string => {
  return CryptoJS.AES.encrypt(data, secret).toString();
};

// Decrypt sensitive data (browser-compatible)
export const decryptData = (encryptedData: string, secret: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secret);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Rate limiting helper (browser-compatible)
export const rateLimit = (maxAttempts: number, windowMs: number): {
  attempts: number;
  resetTime: number;
  isAllowed: boolean;
} => {
  const now = Date.now();
  const resetTime = now + windowMs;

  // In a real implementation, you'd store this in Redis or similar
  // For demo purposes, we'll use localStorage
  const stored = localStorage.getItem('rateLimit');
  let attempts = 0;
  let storedResetTime = 0;

  if (stored) {
    const parsed = JSON.parse(stored);
    attempts = parsed.attempts || 0;
    storedResetTime = parsed.resetTime || 0;
  }

  // Reset if window has passed
  if (now > storedResetTime) {
    attempts = 0;
  }

  const isAllowed = attempts < maxAttempts;

  if (isAllowed) {
    attempts++;
    localStorage.setItem('rateLimit', JSON.stringify({
      attempts,
      resetTime
    }));
  }

  return {
    attempts,
    resetTime,
    isAllowed
  };
};

// Validate email format (browser-compatible)
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate username format (browser-compatible)
export const isValidUsername = (username: string): boolean => {
  // Username should be 3-20 characters, alphanumeric with underscores
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};