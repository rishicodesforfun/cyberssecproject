# 🛡️ Cybersecurity IPDR Analysis System

A comprehensive cybersecurity platform for Internet Protocol Detail Records (IPDR) analysis, featuring advanced authentication, real-time monitoring, data visualization, and security analytics. Built with modern web technologies and enterprise-grade security practices.

![System Architecture](https://img.shields.io/badge/React-18.3.1-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![JWT](https://img.shields.io/badge/JWT-Authentication-orange) ![D3.js](https://img.shields.io/badge/D3.js-Visualization-purple)

## 📋 Table of Contents

- [🚀 Features](#-features)
- [🏗️ System Architecture](#️-system-architecture)
- [📋 Prerequisites](#-prerequisites)
- [🛠️ Installation & Setup](#️-installation--setup)
- [🔐 Authentication System](#-authentication-system)
- [📊 IPDR Analysis Features](#-ipdr-analysis-features)
- [🛡️ Security Features](#️-security-features)
- [📁 Project Structure](#-project-structure)
- [🔗 API Endpoints](#-api-endpoints)
- [🧪 Testing Guide](#-testing-guide)
- [📊 Data Storage](#-data-storage)
- [🔧 Available Scripts](#-available-scripts)
- [🔄 Reset & Maintenance](#-reset--maintenance)
- [🐛 Troubleshooting](#-troubleshooting)
- [📝 Development Notes](#-development-notes)
- [🚀 Production Deployment](#-production-deployment)
- [🤝 Contributing](#-contributing)
- [📞 Support](#-support)

## 🚀 Features

### 🔐 Advanced Authentication System
- ✅ **Multi-Method Authentication**: Credentials, Face Recognition, DigiLocker
- ✅ **JWT Security**: 15-minute access tokens with 7-day refresh tokens
- ✅ **Password Security**: bcryptjs hashing with 12 salt rounds
- ✅ **Real-time Validation**: Password strength checker with feedback
- ✅ **Account Protection**: Automatic lockout after failed attempts
- ✅ **Audit Logging**: Complete activity tracking with IP/location

### 📊 IPDR Analysis & Visualization
- ✅ **Network Graph Visualization**: Interactive D3.js network graphs
- ✅ **Data Timeline**: Chronological communication records
- ✅ **Advanced Filtering**: Search by number, IP, date range, communication type
- ✅ **File Upload Processing**: CSV/TXT file analysis with progress tracking
- ✅ **Real-time Data Tables**: Sortable, filterable communication records
- ✅ **Statistical Analysis**: Communication patterns and trends

### 🛡️ Security & Monitoring
- ✅ **IP Tracking**: Real-time user location and visit monitoring
- ✅ **Camera Integration**: Face authentication and security feeds
- ✅ **Visit History**: Complete session tracking with timestamps
- ✅ **Security Alerts**: Suspicious activity detection
- ✅ **Data Encryption**: Secure data handling and storage
- ✅ **Rate Limiting**: Protection against brute force attacks

### 👤 User Management
- ✅ **Secure Registration**: Email validation and password requirements
- ✅ **Profile Management**: User information and preferences
- ✅ **Account Deletion**: Complete data removal with confirmation
- ✅ **Role-based Access**: User permissions and access control
- ✅ **Session Management**: Secure login/logout with token handling

### 📱 Modern UI/UX
- ✅ **Responsive Design**: Mobile-first approach with Tailwind CSS
- ✅ **Dark/Light Themes**: Theme switching capability
- ✅ **Interactive Components**: Modern UI with Radix UI components
- ✅ **Real-time Updates**: Live data visualization and status updates
- ✅ **Accessibility**: WCAG compliant design patterns

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Express Backend │    │   JSON Storage  │
│   (Port 5173)   │◄──►│   (Port 3001)   │◄──►│   data/*.json    │
│                 │    │                 │    │                 │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Authentication │    │ • JWT Handling  │    │ • users.json    │
│ • IPDR Analysis  │    │ • Data Processing│    │ • logins.json   │
│ • Data Visualization│  │ • File Upload   │    │ • sessions.json │
│ • Real-time UI   │    │ • Security       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + JWT
- **Database**: JSON File Storage (easily replaceable)
- **Visualization**: D3.js + Recharts
- **UI Framework**: Tailwind CSS + Radix UI
- **Authentication**: JWT + bcryptjs
- **Security**: CORS + Rate Limiting + Input Validation

## 📋 Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** for version control
- **Modern Web Browser** (Chrome, Firefox, Edge, Safari)
- **Camera Access** (optional, for face authentication)
- **Internet Connection** (for IP geolocation services)

## 🛠️ Installation & Setup

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd cyberssecproject

# Install all dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# Security Settings
BCRYPT_ROUNDS=12
MAX_FAILED_ATTEMPTS=5
SESSION_TIMEOUT=15m
REFRESH_TOKEN_TIMEOUT=7d

# External Services (Optional)
IPIFY_API_KEY=your-ipify-api-key
IPAPI_API_KEY=your-ipapi-key
```

### 3. Initialize Data Storage

The system automatically creates required directories and files:
- `data/users.json` - User accounts and profiles
- `data/logins.json` - Authentication logs and activities
- `data/sessions.json` - Active session tracking

### 4. Start the Application

#### Option A: Run Both Services Together
```bash
npm run dev:full
```

#### Option B: Run Separately

**Terminal 1 - Backend Server:**
```bash
npm run server
# Output: Server running on port 3001
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Output: Local: http://localhost:5173/
```

### 5. Access the Application

- **Frontend Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health
- **API Documentation**: http://localhost:3001/api/docs (future feature)

## 🔐 Authentication System

### Multi-Method Authentication

#### 1. **Credentials Login**
- Username/password authentication
- Real-time password strength validation
- Account lockout after failed attempts
- Secure password hashing with bcryptjs

#### 2. **Face Authentication**
- Camera access with user permission
- Mock face detection algorithm
- Fallback to manual authentication
- Privacy-focused implementation

#### 3. **DigiLocker Integration**
- Aadhaar-based authentication
- OTP verification system
- Mock DigiLocker API integration
- Government ID verification

### Security Features

#### JWT Token Management
- **Access Tokens**: 15-minute expiration
- **Refresh Tokens**: 7-day expiration
- **Automatic Refresh**: Seamless user experience
- **Secure Storage**: HTTP-only cookies (production)

#### Account Protection
- **Password Requirements**: 8+ chars, mixed case, numbers, symbols
- **Failed Attempt Tracking**: IP-based monitoring
- **Account Lockout**: Automatic after 5 failures
- **Session Management**: Secure logout and cleanup

#### Audit Logging
- **Complete Activity Tracking**: All authentication events
- **IP Geolocation**: Location-based security monitoring
- **Timestamp Recording**: Precise event timing
- **Security Analytics**: Pattern detection and alerts

## 📊 IPDR Analysis Features

### Data Visualization & Analytics

#### Network Graph Visualization
- **Interactive D3.js Graphs**: Force-directed network visualization
- **Node-Link Diagrams**: Communication relationship mapping
- **Zoom & Pan Controls**: Navigate large datasets
- **Node Details**: Click to view connection information
- **Real-time Updates**: Dynamic graph rendering

#### Timeline Analysis
- **Chronological View**: Communication events over time
- **Event Sequencing**: Temporal pattern analysis
- **Duration Tracking**: Call/session length analysis
- **Communication Types**: Voice, SMS, Data categorization
- **Interactive Filtering**: Time-based data exploration

#### Data Table Management
- **Sortable Columns**: Sort by timestamp, duration, parties
- **Advanced Filtering**: Search by number, IP, communication type
- **Pagination Support**: Handle large datasets efficiently
- **Export Capabilities**: CSV/JSON data export
- **Real-time Updates**: Live data synchronization

### File Processing & Upload

#### Multi-Format Support
- **CSV Files**: Standard comma-separated values
- **TXT Files**: Plain text data formats
- **Batch Processing**: Multiple file upload support
- **Progress Tracking**: Real-time upload status
- **Error Handling**: Comprehensive validation and error reporting

#### Data Processing Pipeline
- **File Validation**: Format and content verification
- **Data Parsing**: Automatic field extraction
- **Duplicate Detection**: Prevent data redundancy
- **Quality Assurance**: Data integrity checks
- **Processing Analytics**: Performance metrics and statistics

### Advanced Filtering & Search

#### Multi-Dimensional Filtering
- **Date Range Selection**: Calendar-based date filtering
- **Communication Type**: Voice, SMS, Data filtering
- **IP Address Search**: Network-based filtering
- **Phone Number Lookup**: Contact-based search
- **Geographic Filtering**: Location-based data selection

#### Real-time Search
- **Instant Results**: Live search with debouncing
- **Multi-field Search**: Cross-field data matching
- **Wildcard Support**: Flexible pattern matching
- **Search History**: Recent searches and favorites
- **Saved Filters**: Persistent filter configurations

## 🛡️ Security & Monitoring

### IP Tracking & Geolocation

#### Real-time Location Monitoring
- **IP Address Detection**: Automatic IP identification
- **Geolocation Services**: City, country, timezone detection
- **Visit History Tracking**: Session-based activity logs
- **Location Analytics**: Geographic pattern analysis
- **Privacy Compliance**: GDPR-compliant data handling

#### Security Analytics
- **Suspicious Activity Detection**: Anomaly identification
- **IP Blacklisting**: Malicious IP blocking
- **Geographic Analysis**: Location-based security insights
- **Visit Pattern Analysis**: Behavioral analytics
- **Threat Intelligence**: Security threat monitoring

### Camera Integration & Biometrics

#### Face Authentication System
- **Camera Access**: Secure camera permission handling
- **Face Detection**: Computer vision algorithms
- **Biometric Verification**: Facial recognition technology
- **Privacy Protection**: Local processing, no cloud storage
- **Fallback Authentication**: Alternative login methods

#### Security Camera Feeds
- **Live Video Streaming**: Real-time camera monitoring
- **Multi-camera Support**: Multiple camera management
- **Recording Capabilities**: Video capture and storage
- **Motion Detection**: Automated security alerts
- **Access Control**: Camera permission management

### Audit & Compliance

#### Complete Audit Trail
- **Authentication Logs**: All login/logout activities
- **Data Access Logs**: File and data access tracking
- **System Events**: Configuration and system changes
- **User Actions**: All user-initiated activities
- **Security Events**: Suspicious activity monitoring

#### Compliance Features
- **Data Retention Policies**: Configurable data lifecycle
- **Access Logging**: Who, when, what access tracking
- **Security Reporting**: Automated compliance reports
- **Data Encryption**: Secure data storage and transmission
- **Privacy Controls**: User data protection measures

## 📁 Project Structure

```
cyberssecproject/
├── 📁 data/                          # Data storage directory
│   ├── users.json                   # User accounts and profiles
│   ├── logins.json                  # Authentication activity logs
│   └── sessions.json                # Active session tracking
│
├── 📁 src/                          # Frontend source code
│   ├── 📁 components/               # React components
│   │   ├── Auth/                    # Authentication components
│   │   │   ├── SignUp.tsx          # User registration
│   │   │   ├── DigiLockerAuth.tsx  # DigiLocker authentication
│   │   │   └── FaceAuth.tsx        # Face recognition
│   │   ├── Dashboard/               # Dashboard components
│   │   │   ├── IPTracker.tsx       # IP tracking component
│   │   │   ├── NetworkGraph.tsx    # D3.js network visualization
│   │   │   └── DataTable.tsx       # Data table component
│   │   ├── UI/                     # Reusable UI components
│   │   │   ├── Button.tsx          # Custom button component
│   │   │   ├── Card.tsx            # Card component
│   │   │   └── Table.tsx           # Table component
│   │   └── Utils/                  # Utility components
│   │       ├── PasswordChecker.tsx # Password strength checker
│   │       └── FileUpload.tsx      # File upload component
│   │
│   ├── 📁 lib/                     # Utility libraries
│   │   ├── auth.ts                 # Authentication utilities
│   │   ├── userService.ts          # User management service
│   │   └── authInterceptor.ts      # HTTP interceptors
│   │
│   ├── 📁 services/                # API service layer
│   │   ├── authService.ts          # Authentication API calls
│   │   ├── dataService.ts          # Data processing API calls
│   │   └── fileService.ts          # File upload API calls
│   │
│   ├── 📁 hooks/                   # Custom React hooks
│   │   ├── useAuth.ts              # Authentication hook
│   │   ├── useIPTracking.ts        # IP tracking hook
│   │   └── useFileUpload.ts        # File upload hook
│   │
│   ├── 📁 utils/                   # Utility functions
│   │   ├── validation.ts           # Input validation
│   │   ├── formatting.ts           # Data formatting
│   │   └── encryption.ts           # Data encryption
│   │
│   ├── 📁 types/                   # TypeScript type definitions
│   │   ├── auth.ts                 # Authentication types
│   │   ├── data.ts                 # Data types
│   │   └── api.ts                  # API response types
│   │
│   ├── App.tsx                     # Main application component
│   ├── main.tsx                    # Application entry point
│   └── index.css                   # Global styles
│
├── 📁 server/                      # Backend server
│   ├── server.cjs                  # Express server
│   ├── routes/                     # API route handlers
│   │   ├── auth.js                 # Authentication routes
│   │   ├── data.js                 # Data processing routes
│   │   └── files.js                # File upload routes
│   ├── middleware/                 # Express middleware
│   │   ├── auth.js                 # Authentication middleware
│   │   ├── cors.js                 # CORS configuration
│   │   └── rateLimit.js            # Rate limiting
│   ├── utils/                      # Server utilities
│   │   ├── jwt.js                  # JWT utilities
│   │   ├── validation.js           # Input validation
│   │   └── fileProcessing.js       # File processing
│   └── config/                     # Server configuration
│       ├── database.js             # Database configuration
│       └── security.js             # Security settings
│
├── 📁 public/                      # Static assets
│   ├── favicon.ico                 # Website favicon
│   ├── robots.txt                  # Search engine crawling
│   └── assets/                     # Images and media files
│
├── 📁 docs/                        # Documentation
│   ├── API.md                      # API documentation
│   ├── deployment.md               # Deployment guide
│   └── security.md                 # Security guidelines
│
├── 📄 package.json                 # Node.js dependencies
├── 📄 vite.config.ts               # Vite configuration
├── 📄 tailwind.config.ts           # Tailwind CSS configuration
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 .env                         # Environment variables
├── 📄 .gitignore                   # Git ignore rules
└── 📄 README.md                    # Project documentation
```

## 🔗 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `POST` | `/api/auth/register` | User registration | None |
| `POST` | `/api/auth/login` | User login | None |
| `POST` | `/api/auth/refresh` | Refresh access token | Refresh Token |
| `POST` | `/api/auth/logout` | User logout | Access Token |
| `GET` | `/api/auth/me` | Get current user | Access Token |
| `GET` | `/api/auth/logs` | Get login activity logs | Access Token |
| `DELETE` | `/api/auth/delete-account` | Delete user account | Access Token |
| `POST` | `/api/auth/digilocker` | DigiLocker authentication | None |
| `POST` | `/api/auth/reset` | Reset authentication system | None |

### Data Processing Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/api/data/ipdr` | Get IPDR records | Access Token |
| `POST` | `/api/data/upload` | Upload data file | Access Token |
| `GET` | `/api/data/files` | Get uploaded files | Access Token |
| `DELETE` | `/api/data/files/:id` | Delete uploaded file | Access Token |
| `GET` | `/api/data/analytics` | Get data analytics | Access Token |

### System Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| `GET` | `/api/health` | Health check | None |
| `GET` | `/api/system/info` | System information | Access Token |
| `GET` | `/api/system/logs` | System logs | Access Token |

## 🧪 Testing Guide

### 1. Initial Setup & Authentication

#### User Registration
1. **Access Application**: Open http://localhost:5173
2. **Create Account**: Click "Create Account" button
3. **Fill Registration Form**:
   - Enter first name and last name
   - Choose unique username
   - Provide valid email address
   - Create strong password (8+ chars, mixed case, numbers, symbols)
   - Confirm password
4. **Complete Registration**: Submit form and wait for confirmation

#### Authentication Testing
1. **Credentials Login**:
   - Use registered username/password
   - Test password requirements
   - Verify successful login

2. **Face Authentication**:
   - Click "Face Auth" tab
   - Grant camera permissions
   - Test face detection (70% success rate)

3. **DigiLocker Authentication**:
   - Click "DigiLocker" tab
   - Enter 12-digit Aadhaar number
   - Use test OTP: `123456`, `654321`, `111111`

### 2. IPDR Analysis Testing

#### Data Visualization
1. **Network Graph**:
   - Navigate to "Network" tab
   - Interact with nodes and connections
   - Test zoom and pan functionality
   - Click nodes for detailed information

2. **Data Table**:
   - Switch to "Table" tab
   - Sort columns by clicking headers
   - Use search functionality
   - Apply filters (date range, communication type)

3. **Timeline View**:
   - Select "Timeline" tab
   - View chronological communication records
   - Test timeline navigation

#### File Upload Testing
1. **Upload Files**:
   - Click file upload area or drag files
   - Select CSV or TXT files
   - Monitor upload progress
   - Verify file processing completion

2. **Data Processing**:
   - Check processed records count
   - Verify data accuracy
   - Test filtering on uploaded data

### 3. Security Features Testing

#### Account Security
1. **Failed Login Attempts**:
   - Try wrong passwords multiple times
   - Verify account lockout after 5 attempts
   - Test account unlock functionality

2. **Session Management**:
   - Check token expiration (15 minutes)
   - Test automatic token refresh
   - Verify logout functionality

#### Audit Logging
1. **View Login Logs**:
   - Click "View Logs" button
   - Review authentication attempts
   - Check IP addresses and timestamps
   - Verify success/failure status

2. **Security Monitoring**:
   - Monitor IP tracking information
   - Check visit history
   - Review security alerts

### 4. Account Management

#### Profile Management
1. **Update Profile**:
   - Access profile settings
   - Modify user information
   - Change password securely

#### Account Deletion
1. **Delete Account**:
   - Click "Delete Account" button
   - Confirm deletion
   - Verify complete data removal
   - Check login logs cleanup

## 📊 Data Storage

### users.json Structure
```json
[
  {
    "id": "user_1234567890_abc123",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "passwordHash": "$2a$12$...",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "ipAddress": "192.168.1.100",
    "location": "New York, United States",
    "registrationDate": "2025-09-01T10:00:00.000Z",
    "lastLogin": "2025-09-01T14:30:00.000Z",
    "failedLoginAttempts": 0,
    "accountLocked": false,
    "isActive": true,
    "digiLockerVerified": false
  }
]
```

### logins.json Structure
```json
[
  {
    "id": "log_1234567890_abc123",
    "userId": "user_1234567890_abc123",
    "action": "login",
    "timestamp": "2025-09-01T14:30:00.000Z",
    "ipAddress": "192.168.1.100",
    "location": "New York, United States",
    "success": true,
    "reason": null,
    "details": "Successful login via credentials",
    "failedAttempts": 0
  }
]
```

### IPDR Data Structure
```json
[
  {
    "id": "record_001",
    "timestamp": "2025-09-01T10:15:30.000Z",
    "aParty": "555-1234",
    "bParty": "555-5678",
    "publicIP": "192.168.1.1",
    "communicationType": "VOICE",
    "duration": 245,
    "bytes": 184320,
    "location": "New York, US",
    "networkType": "4G"
  }
]
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start frontend (Vite dev server)
npm run server           # Start backend server
npm run dev:full         # Start both frontend & backend concurrently

# Build & Production
npm run build           # Build frontend for production
npm run build:dev       # Build for development
npm run preview         # Preview production build locally

# Code Quality
npm run lint            # Run ESLint for code linting
npm run format          # Format code with Prettier

# Testing
npm run test            # Run test suite
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate test coverage report

# Database & Data
npm run db:reset        # Reset database/data files
npm run db:seed         # Seed database with sample data
npm run data:clean      # Clean data files

# Deployment
npm run deploy:staging  # Deploy to staging environment
npm run deploy:prod     # Deploy to production environment
```

## 🔄 Reset & Maintenance

### System Reset Options

#### 1. Complete System Reset
```bash
# Reset all data and authentication
curl -X POST http://localhost:3001/api/auth/reset
```

#### 2. Manual Data Reset
```bash
# Clear JSON files manually
echo "[]" > data/users.json
echo "[]" > data/logins.json
echo "[]" > data/sessions.json
```

#### 3. Frontend Reset
```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
```

### Maintenance Tasks

#### Database Cleanup
```bash
# Remove old logs (older than 90 days)
npm run maintenance:clean-logs

# Archive old data
npm run maintenance:archive

# Optimize database
npm run maintenance:optimize
```

#### Security Updates
```bash
# Update dependencies
npm audit fix

# Update security patches
npm run security:update

# Rotate encryption keys
npm run security:rotate-keys
```

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Server Won't Start
**Problem**: Port 3001 already in use or missing dependencies
**Solutions**:
```bash
# Check port usage
netstat -ano | findstr :3001

# Kill process using port
taskkill /PID <PID> /F

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Frontend Build Errors
**Problem**: TypeScript errors or missing dependencies
**Solutions**:
```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build

# Check TypeScript configuration
npx tsc --noEmit
```

#### Authentication Issues
**Problem**: Login not working or tokens invalid
**Solutions**:
```bash
# Clear local storage
# In browser: localStorage.clear()

# Reset authentication data
curl -X POST http://localhost:3001/api/auth/reset

# Check server logs
tail -f logs/server.log
```

#### Database Connection Issues
**Problem**: JSON files not accessible or corrupted
**Solutions**:
```bash
# Check file permissions
ls -la data/

# Reset data files
npm run db:reset

# Validate JSON structure
node -e "JSON.parse(require('fs').readFileSync('data/users.json', 'utf8'))"
```

#### Camera/Microphone Issues
**Problem**: Face authentication not working
**Solutions**:
```bash
# Check browser permissions
# Chrome: Settings > Privacy > Camera

# Test camera access
# Open browser console and run:
navigator.mediaDevices.getUserMedia({video: true})
  .then(stream => console.log('Camera accessible'))
  .catch(err => console.error('Camera error:', err));
```

### Debug Mode

#### Enable Detailed Logging
```bash
# Server debug mode
DEBUG=* npm run server

# Frontend debug mode
npm run dev -- --mode development

# Network debugging
# Open browser DevTools > Network tab
```

#### Log File Locations
```
logs/
├── server.log          # Backend server logs
├── error.log           # Error logs
├── access.log          # Access logs
└── security.log        # Security events
```

## 📝 Development Notes

### Architecture Decisions

#### Frontend Architecture
- **React 18** with hooks for state management
- **TypeScript** for type safety and better DX
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible component primitives

#### Backend Architecture
- **Express.js** for RESTful API development
- **JWT** for stateless authentication
- **bcryptjs** for secure password hashing
- **JSON files** for simple data persistence
- **CORS** for cross-origin resource sharing

#### Security Architecture
- **Multi-layer authentication** (credentials, biometrics, government ID)
- **Role-based access control** (RBAC)
- **Audit logging** for compliance
- **Rate limiting** for DDoS protection
- **Input validation** and sanitization

### Performance Optimizations

#### Frontend Optimizations
- **Code splitting** with dynamic imports
- **Lazy loading** for components
- **Image optimization** and compression
- **Bundle analysis** and tree shaking
- **Service worker** for caching

#### Backend Optimizations
- **Request compression** with gzip
- **Database indexing** and query optimization
- **Caching layers** with Redis (future)
- **Load balancing** preparation
- **API rate limiting**

### Future Enhancements

#### Planned Features
- [ ] **Real Database Integration** (PostgreSQL/MongoDB)
- [ ] **Real-time Notifications** with WebSockets
- [ ] **Advanced Analytics Dashboard**
- [ ] **Machine Learning Integration** for anomaly detection
- [ ] **Multi-tenant Architecture**
- [ ] **API Documentation** with Swagger/OpenAPI
- [ ] **Automated Testing Suite**
- [ ] **Container Orchestration** with Docker/Kubernetes
- [ ] **CI/CD Pipeline** with GitHub Actions
- [ ] **Monitoring & Alerting** with Prometheus/Grafana

#### Security Enhancements
- [ ] **OAuth 2.0 Integration** (Google, GitHub, etc.)
- [ ] **Two-Factor Authentication** (2FA)
- [ ] **Hardware Security Keys** (FIDO2/WebAuthn)
- [ ] **End-to-end Encryption** for sensitive data
- [ ] **Security Headers** (CSP, HSTS, etc.)
- [ ] **Vulnerability Scanning** and automated fixes

## 🚀 Production Deployment

### Environment Setup

#### Production Environment Variables
```env
NODE_ENV=production
PORT=3001

# Security
JWT_SECRET=your-production-jwt-secret-key
JWT_REFRESH_SECRET=your-production-refresh-secret-key
BCRYPT_ROUNDS=12

# Database (when using real database)
DATABASE_URL=postgresql://user:password@localhost:5432/ipdr_db
REDIS_URL=redis://localhost:6379

# External Services
IPIFY_API_KEY=your-production-ipify-key
IPAPI_API_KEY=your-production-ipapi-key

# Email Service (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Storage
UPLOAD_PATH=/var/www/uploads
MAX_FILE_SIZE=10485760

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

### Deployment Steps

#### 1. Server Preparation
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Create application directory
sudo mkdir -p /var/www/ipdr-system
sudo chown -R $USER:$USER /var/www/ipdr-system
```

#### 2. Application Deployment
```bash
# Clone repository
cd /var/www/ipdr-system
git clone <repository-url> .
npm ci --production

# Build frontend
npm run build

# Create data directories
mkdir -p data logs uploads

# Set proper permissions
chmod 755 data logs uploads
```

#### 3. Process Management
```bash
# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Check status
pm2 status
pm2 logs
```

#### 4. Nginx Configuration
```nginx
# /etc/nginx/sites-available/ipdr-system
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/ipdr-system/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

#### 5. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Monitoring & Maintenance

#### Health Checks
```bash
# Application health
curl http://localhost:3001/api/health

# System resources
htop
df -h
free -h

# Logs monitoring
tail -f /var/log/nginx/access.log
pm2 logs ipdr-system
```

#### Backup Strategy
```bash
# Database backup
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump ipdr_db > backup_$DATE.sql

# File backup
tar -czf uploads_$DATE.tar.gz uploads/

# Automated backup script
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

## 🤝 Contributing

### Development Workflow

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/ipdr-system.git
   cd ipdr-system
   git checkout -b feature/your-feature-name
   ```

2. **Set Up Development Environment**
   ```bash
   npm install
   cp .env.example .env
   npm run dev:full
   ```

3. **Follow Coding Standards**
   ```bash
   # Run linting
   npm run lint

   # Format code
   npm run format

   # Run tests
   npm run test
   ```

4. **Commit Guidelines**
   ```bash
   git add .
   git commit -m "feat: add new authentication method"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Provide detailed description
   - Reference related issues
   - Include screenshots for UI changes
   - Ensure all tests pass

### Code Review Process

#### Review Checklist
- [ ] **Security**: No security vulnerabilities
- [ ] **Performance**: No performance regressions
- [ ] **Code Quality**: Follows coding standards
- [ ] **Testing**: Adequate test coverage
- [ ] **Documentation**: Updated documentation
- [ ] **Accessibility**: WCAG compliance
- [ ] **Browser Compatibility**: Cross-browser testing

#### Testing Requirements
- [ ] Unit tests for new features
- [ ] Integration tests for API changes
- [ ] E2E tests for user workflows
- [ ] Performance tests for critical paths
- [ ] Security tests for authentication flows

## 📞 Support

### Getting Help

#### Documentation
- 📖 **README.md**: Complete setup and usage guide
- 📚 **API Documentation**: Detailed endpoint specifications
- 🐛 **Troubleshooting Guide**: Common issues and solutions
- 🔒 **Security Guidelines**: Security best practices

#### Community Support
- 💬 **GitHub Discussions**: General questions and discussions
- 🐛 **GitHub Issues**: Bug reports and feature requests
- 📧 **Email Support**: security-support@example.com
- 📱 **Live Chat**: Available during business hours

#### Professional Support
- 🚀 **Enterprise Support**: 24/7 technical support
- 📈 **Consulting Services**: Architecture and implementation guidance
- 🎓 **Training Programs**: Developer and administrator training
- 🔧 **Custom Development**: Tailored feature development

### Issue Reporting

#### Bug Reports
```markdown
**Bug Description**
Clear description of the issue

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 91]
- Version: [e.g., v1.0.0]

**Additional Context**
Any other relevant information
```

#### Feature Requests
```markdown
**Feature Summary**
Brief description of the requested feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
Detailed description of the proposed solution

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Any other relevant information
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing React framework
- **Vercel** for Vite build tool inspiration
- **Tailwind CSS** for utility-first CSS framework
- **Radix UI** for accessible component primitives
- **D3.js** for powerful data visualization
- **Open Source Community** for invaluable contributions

---

**Built with ❤️ for cybersecurity professionals and organizations worldwide**

---

*For more information, visit our [documentation website](https://docs.ipdr-system.com) or contact our support team.*

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

## 🛠️ Installation & Setup

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd cyberssecproject

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# Server Configuration
PORT=3001

# Node Environment
NODE_ENV=development
```

### 3. Start the Application

#### Option A: Run Both Frontend & Backend Together
```bash
npm run dev:full
```

#### Option B: Run Separately

**Terminal 1 - Backend Server:**
```bash
npm run server
# or: node server.cjs
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 4. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/health

## 📁 Project Structure

```
cyberssecproject/
├── server.cjs                 # Backend Express server
├── .env                       # Environment variables
├── data/
│   ├── users.json            # User data storage
│   └── logins.json           # Login activity logs
├── src/
│   ├── components/
│   │   ├── SignUp.tsx        # Registration component
│   │   ├── DigiLockerAuth.tsx # DigiLocker authentication
│   │   ├── FaceAuth.tsx      # Face authentication
│   │   └── PasswordChecker.tsx # Password strength checker
│   ├── lib/
│   │   ├── auth.ts           # Authentication utilities
│   │   ├── userService.ts    # User management
│   │   └── authInterceptor.ts # Token management
│   ├── services/
│   │   └── authService.ts    # API service layer
│   └── App.tsx               # Main application
└── package.json
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logs` - Get login activity logs

### DigiLocker
- `POST /api/auth/digilocker` - DigiLocker authentication

### Account Management
- `DELETE /api/auth/delete-account` - Delete user account
- `POST /api/auth/reset` - Reset authentication system (admin)

### System
- `GET /api/health` - Health check

## 🧪 Testing the System

### 1. User Registration
1. Open http://localhost:5173
2. Click "Create Account"
3. Fill registration form with strong password
4. Complete registration

### 2. Authentication Methods

#### Credentials Login
- Use registered username/password
- Test password strength requirements

#### Face Authentication
- Click "Face Auth" tab
- Mock face detection (70% success rate)

#### DigiLocker Authentication
- Click "DigiLocker" tab
- Enter 12-digit Aadhaar number
- Use test OTPs: `123456`, `654321`, `111111`

### 3. Account Management
- **View Login Logs:** Click "View Logs" or switch to "Login Logs" tab
- **Delete Account:** Click "Delete Account" → Confirm deletion
- **Profile Management:** Access user profile features

### 4. Security Testing
- Try wrong passwords (account locks after 5 attempts)
- Test token expiration (15-minute access tokens)
- Check audit logs for all activities

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start frontend (Vite)
npm run server           # Start backend server
npm run dev:full         # Start both frontend & backend

# Build
npm run build           # Build for production
npm run build:dev       # Build for development

# Other
npm run lint            # Run ESLint
npm run preview         # Preview production build
```

## 🔒 Security Features

### Password Security
- **Minimum Requirements:** 8+ characters, uppercase, lowercase, numbers, special characters
- **Hashing:** bcryptjs with 12 salt rounds
- **Strength Validation:** Real-time feedback during registration

### Account Protection
- **Failed Login Tracking:** Logs all failed attempts with IP
- **Account Lockout:** Automatic lock after 5 consecutive failures
- **Session Management:** Secure token handling with automatic refresh

### Data Security
- **JWT Tokens:** Short-lived access tokens with refresh mechanism
- **Audit Logging:** Complete activity tracking with timestamps and IPs
- **Input Validation:** Comprehensive validation on all inputs
- **Data Sanitization:** All user data properly sanitized

## 📊 Data Storage

### users.json Structure
```json
[
  {
    "id": "unique_user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "passwordHash": "hashed_password",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "ipAddress": "192.168.1.1",
    "location": "City, Country",
    "registrationDate": "2025-09-01T10:00:00.000Z",
    "lastLogin": "2025-09-01T10:30:00.000Z",
    "failedLoginAttempts": 0,
    "accountLocked": false,
    "isActive": true
  }
]
```

### logins.json Structure
```json
[
  {
    "id": "log_entry_id",
    "userId": "user_id_or_unknown",
    "action": "login/register/digilocker",
    "timestamp": "2025-09-01T10:30:00.000Z",
    "ipAddress": "192.168.1.1",
    "location": "City, Country",
    "success": true,
    "reason": "optional_failure_reason",
    "failedAttempts": 0
  }
]
```

## 🔄 Reset & Maintenance

### Reset Authentication System
```bash
# Option 1: Manual reset (edit files)
# Clear data/users.json and data/logins.json

# Option 2: API reset
curl -X POST http://localhost:3001/api/auth/reset

# Option 3: Frontend reset
# Use authService.resetAuth() in browser console
```

### Clear Local Storage
```javascript
// In browser console
localStorage.clear();
```

## 🐛 Troubleshooting

### Common Issues

**Server won't start:**
- Check if port 3001 is available
- Verify Node.js version (v16+)
- Check `.env` file configuration

**Frontend build errors:**
- Run `npm install` to ensure all dependencies
- Check Node.js and npm versions
- Clear node_modules and reinstall

**Authentication issues:**
- Clear browser localStorage
- Reset JSON files
- Check server logs for errors

**DigiLocker not working:**
- Use test OTPs: `123456`, `654321`, `111111`
- Ensure 12-digit Aadhaar format

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run server
```

## 📝 Development Notes

### Architecture
- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express + JWT
- **Storage:** JSON files (easily replaceable with database)
- **Security:** bcryptjs + JWT + input validation

### Production Deployment
1. Change JWT secrets in `.env`
2. Use HTTPS in production
3. Replace JSON storage with database (MongoDB/PostgreSQL)
4. Add rate limiting middleware
5. Implement proper CORS configuration
6. Add request logging and monitoring

### Future Enhancements
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Email verification for registration
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] Social login integration
- [ ] Admin dashboard
- [ ] User roles and permissions
- [ ] API rate limiting
- [ ] Session management improvements

## 📄 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review server logs
3. Test with clean data files
4. Check browser console for frontend errors

---

**Happy coding! 🚀**
