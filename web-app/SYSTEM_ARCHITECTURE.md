# MATCRON Web Admin Dashboard - System Architecture Documentation

## Table of Contents
- [System Overview](#system-overview)
- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Design](#database-design)
- [Authentication & Security](#authentication--security)
- [Detailed Authentication Implementation](#detailed-authentication-implementation)
- [Token Management System](#token-management-system)
- [Session Management](#session-management)
- [Email System Implementation](#email-system-implementation)
- [User Invitation Workflow](#user-invitation-workflow)
- [Email Confirmation Process](#email-confirmation-process)
- [Security Implementation Details](#security-implementation-details)
- [Error Handling & Validation](#error-handling--validation)
- [API Endpoints](#api-endpoints)
- [Data Flow](#data-flow)
- [Component Structure](#component-structure)
- [Features](#features)
- [Implementation Examples](#implementation-examples)
- [File Structure](#file-structure)
- [Development Setup](#development-setup)
- [Troubleshooting Guide](#troubleshooting-guide)

## System Overview

MATCRON is a comprehensive web-based admin dashboard for mattress lifecycle management. The system enables organizations to track, manage, and monitor mattresses throughout their entire lifecycle from production to decommissioning.

### Key Capabilities
- **Mattress Tracking**: Complete lifecycle management with RFID/QR code integration
- **User Management**: Multi-role user system with organization-based access control
- **Identifier Pool Management**: Excel-based bulk identifier import and validation
- **Dashboard Analytics**: Real-time statistics and reporting
- **Guest Access**: Public interface for mattress status checking

## Architecture Overview

The system follows a modern **3-tier architecture** pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  React SPA + Material-UI + Tailwind CSS + React Router     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     BUSINESS LAYER                          │
│     ASP.NET Core Web API + JWT Auth + Repository Pattern   │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                             │
│          Entity Framework Core + SQL Server Database       │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Patterns Used
- **Repository Pattern**: Data access abstraction
- **Service Layer Pattern**: Business logic encapsulation
- **Context API Pattern**: State management in React
- **Protected Route Pattern**: Authentication-based routing
- **DTO Pattern**: Data transfer objects for API communication

## Technology Stack

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.0.0 | Core UI framework |
| Material-UI | 6.4.5 | Component library |
| Tailwind CSS | 3.3.5 | Utility-first CSS |
| React Router | 7.2.0 | Client-side routing |
| Axios | 1.7.9 | HTTP client |
| Recharts | 2.15.1 | Data visualization |
| Crypto-JS | 4.2.0 | Encryption utilities |
| QRCode | 1.5.4 | QR code generation |

### Backend Technologies
| Technology | Purpose |
|------------|---------|
| ASP.NET Core | Web API framework |
| Entity Framework Core | ORM and database access |
| JWT | Authentication tokens |
| AutoMapper | Object mapping |
| Swagger | API documentation |

### Development Tools
- **Docker**: Containerization
- **Node.js 18**: Frontend build environment
- **npm**: Package management
- **Git**: Version control

## Frontend Architecture

### Component Hierarchy
```
App
├── AuthProvider (Context)
├── Router
│   ├── PublicLayout
│   │   ├── LandingPage
│   │   ├── Login
│   │   ├── ConfirmRegistration
│   │   └── GuestPage
│   └── ProtectedLayout
│       ├── Dashboard
│       ├── Users/UsersPage
│       ├── Mattress/MattressPage
│       ├── MattressType/MattressTypePage
│       └── Extraction/ExtractionPage
```

### State Management
- **AuthContext**: User authentication state
- **UserContext**: User profile data
- **DBContext**: IndexedDB session management
- **Local State**: Component-specific state using React hooks

### Routing Strategy
```javascript
// Public Routes (Unauthenticated)
/                    → LandingPage
/login              → Login
/verify-email       → ConfirmRegistration
/guest              → GuestPage

// Protected Routes (Authenticated)
/dashboard          → Dashboard
/users              → UsersPage
/mattress           → MattressPage
/mattress-types     → MattressTypePage
/extraction         → ExtractionPage
```

### Service Layer
```
services/
├── AuthService.js           # Authentication API calls
├── UserService.js           # User management operations
├── MattressService.js       # Mattress CRUD operations
├── MattressTypeService.js   # Mattress type management
├── IdentifierPoolService.js # Identifier pool operations
└── EncryptionService.js     # Security utilities
```

## Backend Architecture

### API Structure
```
Backend/
├── Controllers/
│   └── IdentifierPoolController.cs
├── Repositories/
│   └── Interfaces/
│       └── IIdentifierPoolRepository.cs
├── DTOs/
├── Models/
├── Services/
└── Common/
    └── Utilities/
```

### Repository Pattern Implementation
```csharp
// Interface Definition
public interface IIdentifierPoolRepository
{
    Task<List<MattressIdentifierDto>> GetIdentifiersForOrgAsync(Guid? orgId = null, bool? assigned = null);
    Task<MattressIdentifierDto> GetIdentifierByIdAsync(Guid id);
    Task<IdentifierValidationResultDto> ValidateIdentifiersAsync(List<MattressIdentifierDto> identifiers);
    Task<bool> SaveIdentifiersAsync(List<MattressIdentifierDto> identifiers);
    // ... additional methods
}
```

### Data Transfer Objects (DTOs)
- **MattressIdentifierDto**: Identifier pool data structure
- **IdentifierStatsDto**: Pool statistics
- **IdentifierValidationResultDto**: Validation results
- **AssignIdentifierRequest**: Assignment operations

## Database Design

### Entity Relationship Diagram

![MATCRON Database ERD](public/ERD_Diagram.png)

### Core Entity Relationships
```
Organizations (1) ──────────── (*) Users
     │                              │
     │                              │
     └─── (*) MattressTypes         │
              │                     │
              │                     │
              └─── (*) Mattresses ──┘
                        │
                        │
                   (*) MattressIdentifiers
```

### Core Entities (Inferred from DTOs)
```sql
-- Organizations
Organizations
├── Id (GUID)
├── Name
├── Type
└── CreatedAt

-- Users
Users
├── Id (GUID)
├── Email
├── FirstName
├── LastName
├── UserType (Enum: Admin, Manager, User)
├── OrgId (FK)
└── CreatedAt

-- MattressTypes
MattressTypes
├── Id (GUID)
├── Name
├── Description
├── DaysToRotate
├── LifeCyclesEnd
└── OrgId (FK)

-- Mattresses
Mattresses
├── Id (GUID)
├── MattressTypeId (FK)
├── Status (Enum)
├── Location
├── BatchNo
├── EpcCode
├── ProductionDate
└── OrgId (FK)

-- MattressIdentifiers
MattressIdentifiers
├── Id (GUID)
├── MattressIdentifier
├── EpcCode
├── QrCode
├── IsAssigned
├── MattressId (FK)
└── OrgId (FK)
```

### Mattress Status Enum
```csharp
public enum MattressStatus
{
    InProduction = 0,
    InInventory = 1,
    Assigned = 2,
    InUse = 3,
    NeedsCleaning = 4,
    Decommissioned = 5,
    InTransit = 6,
    RotationNeeded = 7
}
```

## Authentication & Security

### JWT Token Structure
```json
{
  "Id": "user-guid",
  "Email": "user@example.com",
  "UserType": 0,
  "OrgId": "org-guid",
  "OrgType": "organization-type",
  "exp": 1234567890
}
```

### Security Features
- **Password Encryption**: SHA256 with salt + AES encryption
- **JWT Authentication**: Stateless token-based auth
- **Route Protection**: React Router guards
- **Token Expiration**: Automatic logout on token expiry
- **CORS Configuration**: Cross-origin request handling

### Encryption Implementation
```javascript
// Password encryption with salt and datetime
const encryptedPassword = EncryptionService.encryptPassword(password);
// Result: "IV:CIPHERTEXT" format with datetime embedding
```

## Detailed Authentication Implementation

### 1. Login Process Implementation

#### Frontend Login Component (`src/pages/Login.js`)
```javascript
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Encrypt password using EncryptionService
      const encryptedPassword = EncryptionService.encryptPassword(password);
      
      // Call AuthContext login method
      const success = await login(email, encryptedPassword);
      
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      // Handle login errors
      setSnackbar({
        open: true,
        message: error.message || 'Login failed',
        severity: 'error'
      });
    }
  };
};
```

#### AuthContext Implementation (`src/context/AuthContext.js`)
```javascript
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Token validation on app startup
  useEffect(() => {
    const validateTokenOnStartup = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          const isExpired = isTokenExpired(storedToken);
          if (!isExpired) {
            const decodedToken = decodeToken(storedToken);
            if (decodedToken) {
              setToken(storedToken);
              setUser({
                id: decodedToken.Id,
                email: decodedToken.Email,
                userType: decodedToken.UserType,
                orgId: decodedToken.OrgId,
                orgType: decodedToken.OrgType
              });
            }
          } else {
            handleLogout();
          }
        }
      } catch (error) {
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    validateTokenOnStartup();
  }, []);

  const login = async (email, encryptedPassword) => {
    setLoading(true);
    try {
      const response = await authService.login(email, encryptedPassword);
      
      if (response.success && response.data) {
        const token = response.data.token || response.token;
        localStorage.setItem('token', token);
        
        const decodedToken = decodeToken(token);
        if (decodedToken) {
          setUser({
            id: decodedToken.Id,
            email: decodedToken.Email,
            userType: decodedToken.UserType,
            orgId: decodedToken.OrgId,
            orgType: decodedToken.OrgType
          });
          setToken(token);
          return true;
        }
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
};
```

### 2. Password Encryption Implementation

#### EncryptionService (`src/services/EncryptionService.js`)
```javascript
class EncryptionService {
  // Hash password with salt
  static hashAndSaltPassword(password, salt = "matrcronIsTheBest2024") {
    const combined = password + salt;
    return CryptoJS.SHA256(combined).toString();
  }

  // Get current datetime for encryption
  static getCurrentDatetime() {
    return new Date().toISOString();
  }

  // Combine password hash with datetime
  static combinePasswordAndDatetime(passwordHash, datetime) {
    return `${passwordHash}|${datetime}`;
  }

  // AES encryption with random IV
  static encryptData(data, encryptionKey = "encryptPassword") {
    const key = encryptionKey.padEnd(32, ' ');
    const iv = CryptoJS.lib.WordArray.random(16);
    
    const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
    const ciphertextBase64 = encrypted.toString();
    
    return `${ivBase64}:${ciphertextBase64}`;
  }

  // Complete password encryption process
  static encryptPassword(password) {
    const hashedPassword = this.hashAndSaltPassword(password);
    const datetime = this.getCurrentDatetime();
    const combinedData = this.combinePasswordAndDatetime(hashedPassword, datetime);
    return this.encryptData(combinedData);
  }
}
```

### 3. Protected Route Implementation

#### ProtectedLayout Component (`src/App.js`)
```javascript
const ProtectedLayout = () => {
  const { isAuthenticated, loading, token, isTokenExpired, user } = useAuth();

  // Detailed logging for debugging
  console.group('Protected Route Check');
  console.log('Is Authenticated:', isAuthenticated);
  console.log('Loading:', loading);
  console.log('Token exists:', !!token);
  console.log('User:', user);
  if (token) {
    console.log('Token expired:', isTokenExpired(token));
  }
  console.groupEnd();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Check authentication and token validity
  if (!isAuthenticated || (token && isTokenExpired(token))) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
```

## Token Management System

### 1. JWT Token Structure and Handling

#### Token Decoding Utility
```javascript
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};
```

#### Token Expiration Check
```javascript
const isTokenExpired = (token) => {
  try {
    const decodedToken = decodeToken(token);
    if (!decodedToken) return true;
    
    const expirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();
    
    console.log('Token expiration check:', {
      expirationTime: new Date(expirationTime),
      currentTime: new Date(currentTime),
      isExpired: currentTime >= expirationTime
    });
    
    return currentTime >= expirationTime;
  } catch (error) {
    return true;
  }
};
```

### 2. Axios Interceptor for Token Management

#### AuthService Token Injection (`src/services/AuthService.js`)
```javascript
// Automatic token injection for all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added token to request headers');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for token expiration handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 3. Token Storage and Cleanup

#### Logout Implementation
```javascript
const handleLogout = () => {
  console.group('Logout Process');
  
  // Clear frontend state
  setUser(null);
  setToken(null);
  setError(null);
  
  // Clear localStorage
  localStorage.removeItem('token');
  
  // Clear axios headers
  delete axios.defaults.headers.common['Authorization'];
  
  // Navigate to login
  navigate('/login', { replace: true });
  
  console.log('Logout completed');
  console.groupEnd();
};
```

## Session Management

### 1. IndexedDB Session Storage

#### DBContext Implementation (`src/context/DBContext.js`)
```javascript
export const DBProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const data = await indexedDBService.getAuthData();
        setSessionData(data);
        
        // Enhanced session logging
        console.group('Session Data Details');
        console.log('Raw Session Data:', data);
        
        if (data?.token) {
          const decodedToken = decodeToken(data.token);
          console.log('Decoded Token:', decodedToken);
          console.log('Token Expiration:', new Date(decodedToken?.exp * 1000).toLocaleString());
          console.log('User Details:', data.user);
        } else {
          console.log('No token found in session');
        }
        console.groupEnd();
        
      } catch (error) {
        console.error('Error fetching session data:', error);
      }
    };

    fetchSessionData();
  }, []);

  const value = {
    sessionData,
    setSessionData,
  };

  return (
    <DBContext.Provider value={value}>
      {children}
    </DBContext.Provider>
  );
};
```

### 2. User Context for Profile Management

#### UserContext Implementation (`src/context/UserContext.js`)
```javascript
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    id: null,
    email: null,
    userType: null,
    orgId: null,
    token: null
  });

  const updateUserData = (token, decodedData) => {
    setUserData({
      id: decodedData.Id,
      email: decodedData.Email,
      userType: decodedData.UserType,
      orgId: decodedData.OrgId,
      token: token
    });
    
    // Detailed user session logging
    console.group('User Session Details');
    console.log('Token:', token);
    console.log('User ID:', decodedData.Id);
    console.log('Email:', decodedData.Email);
    console.log('User Type:', decodedData.UserType);
    console.log('Organization ID:', decodedData.OrgId);
    console.groupEnd();
  };

  const clearUserData = () => {
    setUserData({
      id: null,
      email: null,
      userType: null,
      orgId: null,
      token: null
    });
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, clearUserData }}>
      {children}
    </UserContext.Provider>
  );
};
```

## Email System Implementation

### 1. User Invitation System

#### UserService Email Invitation (`src/services/UserService.js`)
```javascript
const UserService = {
  // Send user invitation email
  inviteUser: async (email, userRole, orgId) => {
    try {
      const token = localStorage.getItem('token');
      
      // Map user roles to backend enum values
      const UserRoleEnum = {
        ADMIN: 0,
        MANAGER: 1,
        USER: 2
      };
      
      const payload = {
        email: email,
        userRole: UserRoleEnum[userRole], // Convert to byte value
        orgId: orgId
      };
      
      console.log('Sending invitation request:', {
        payload,
        endpoint: `${BASE_URL}/api/email/invite`,
        hasToken: !!token
      });
      
      const response = await axios.post(`${BASE_URL}/api/email/invite`, 
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Invitation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error inviting user:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  }
};
```

#### InviteUserDialog Component (`src/pages/Users/InviteUserDialog.js`)
```javascript
const InviteUserDialog = ({ open, onClose, onInvite }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('User');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleInvite = async () => {
    if (!email || !role) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call UserService to send invitation
      await UserService.inviteUser(email, role.toUpperCase(), user.orgId);
      
      // Show success message
      onInvite({
        message: `Invitation sent successfully to ${email}`,
        severity: 'success'
      });
      
      // Reset form and close dialog
      setEmail('');
      setRole('User');
      onClose();
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Invite New User</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
          helperText={error}
        />
        
        <FormControl fullWidth margin="dense">
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            label="Role"
          >
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleInvite} 
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Send Invitation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```

## User Invitation Workflow

### Step-by-Step Invitation Process

1. **Admin/Manager Initiates Invitation**
   ```javascript
   // From UsersPage.js
   const handleInviteUser = () => {
     setInviteDialogOpen(true);
   };
   ```

2. **Email and Role Selection**
   ```javascript
   // InviteUserDialog.js validates input
   const validateEmail = (email) => {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return emailRegex.test(email);
   };
   ```

3. **Backend API Call**
   ```javascript
   // UserService.inviteUser() sends POST to /api/email/invite
   POST /api/email/invite
   {
     "email": "newuser@example.com",
     "userRole": 2, // User role enum
     "orgId": "org-guid"
   }
   ```

4. **Email Template and Delivery**
   ```csharp
   // Backend EmailService (inferred implementation)
   public async Task<bool> SendInvitationEmail(string email, UserRole role, Guid orgId)
   {
     var invitationToken = GenerateInvitationToken(email, role, orgId);
     var confirmationLink = $"{frontendUrl}/verify-email?token={invitationToken}";
     
     var emailTemplate = $@"
       <h2>Welcome to MATCRON</h2>
       <p>You've been invited to join as a {role}.</p>
       <p><a href='{confirmationLink}'>Click here to complete registration</a></p>
     ";
     
     return await _emailProvider.SendAsync(email, "MATCRON Invitation", emailTemplate);
   }
   ```

## Email Confirmation Process

### 1. Email Verification Implementation

#### ConfirmRegistration Component (`src/pages/ConfirmRegistration.js`)
```javascript
const ConfirmRegistration = () => {
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    profilePicture: null
  });
  
  const location = useLocation();
  const navigate = useNavigate();

  // Extract token from URL and verify
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const emailToken = urlParams.get('token');
    
    if (emailToken) {
      setToken(emailToken);
      verifyEmailToken(emailToken);
    } else {
      setLoading(false);
      setVerifying(false);
    }
  }, [location]);

  const verifyEmailToken = async (emailToken) => {
    try {
      console.log('Verifying email token:', emailToken);
      
      const response = await AuthService.verifyEmailToken(emailToken);
      
      if (response.success) {
        setEmail(response.email);
        setVerifying(false);
        setLoading(false);
      } else {
        throw new Error(response.message || 'Invalid verification token');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      setSnackbar({
        open: true,
        message: 'Invalid or expired verification link',
        severity: 'error'
      });
      // Redirect to login after error
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      // Encrypt password
      const encryptedPassword = EncryptionService.encryptPassword(formData.password);
      
      const registrationData = {
        token: token,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: encryptedPassword,
        profilePicture: formData.profilePicture
      };
      
      console.log('Submitting registration:', { ...registrationData, password: '[ENCRYPTED]' });
      
      const response = await AuthService.completeRegistration(registrationData);
      
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Registration completed successfully! Redirecting to login...',
          severity: 'success'
        });
        
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        ...errors,
        general: error.response?.data?.message || 'Registration failed'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
};
```

### 2. AuthService Email Verification Methods

```javascript
const AuthService = {
  // Verify email token
  verifyEmailToken: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Auth/verify`, {
        params: { token }
      });
      return response.data;
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  },
  
  // Complete user registration
  completeRegistration: async (registrationData) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/Auth/complete-registration`, registrationData);
      return response.data;
    } catch (error) {
      console.error('Registration completion error:', error);
      throw error;
    }
  }
};
```

## Security Implementation Details

### 1. Password Security Layers

#### Multi-Layer Password Protection
```javascript
// Layer 1: Client-side hashing with salt
const hashedPassword = CryptoJS.SHA256(password + "matrcronIsTheBest2024").toString();

// Layer 2: Combine with timestamp
const datetime = new Date().toISOString();
const combinedData = `${hashedPassword}|${datetime}`;

// Layer 3: AES encryption with random IV
const key = "encryptPassword".padEnd(32, ' ');
const iv = CryptoJS.lib.WordArray.random(16);
const encrypted = CryptoJS.AES.encrypt(combinedData, CryptoJS.enc.Utf8.parse(key), {
  iv: iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
});

// Final format: "IV:CIPHERTEXT"
const result = `${CryptoJS.enc.Base64.stringify(iv)}:${encrypted.toString()}`;
```

### 2. Request Security Headers

#### Axios Security Configuration
```javascript
// Default headers for all requests
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// CSRF protection
axios.defaults.withCredentials = true;

// Request timeout
axios.defaults.timeout = 30000;
```

### 3. Route-Level Security

#### Role-Based Access Control
```javascript
const checkUserPermissions = (requiredRole, userRole) => {
  const roleHierarchy = {
    'Admin': 3,
    'Manager': 2,
    'User': 1
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

// Usage in components
const UsersPage = () => {
  const { user } = useAuth();
  
  if (!checkUserPermissions('Manager', user.userType)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Component content for authorized users
};
```

## Error Handling & Validation

### 1. Form Validation Patterns

#### Real-time Validation Implementation
```javascript
const useFormValidation = (initialState, validationRules) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (fieldName, value) => {
    const rule = validationRules[fieldName];
    if (!rule) return '';

    if (rule.required && !value.trim()) {
      return `${fieldName} is required`;
    }

    if (rule.minLength && value.length < rule.minLength) {
      return `${fieldName} must be at least ${rule.minLength} characters`;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || `Invalid ${fieldName} format`;
    }

    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validate(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validate(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  return { values, errors, touched, handleChange, handleBlur };
};
```

### 2. API Error Handling

#### Centralized Error Management
```javascript
const ApiErrorHandler = {
  handleError: (error, context = '') => {
    console.error(`API Error in ${context}:`, error);
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 400:
          return data.message || 'Bad request';
        case 401:
          localStorage.removeItem('token');
          window.location.href = '/login';
          return 'Session expired. Please login again.';
        case 403:
          return 'You do not have permission to perform this action';
        case 404:
          return 'Resource not found';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return data.message || `HTTP Error ${status}`;
      }
    } else if (error.request) {
      // Network error
      return 'Network error. Please check your connection.';
    } else {
      // Other error
      return error.message || 'An unexpected error occurred';
    }
  }
};
```

### 3. Snackbar Notification System

#### Custom Snackbar Component (`src/components/Snackbar.js`)
```javascript
const CustomSnackbar = ({ snackbar, setSnackbar }) => {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert
        onClose={handleClose}
        severity={snackbar.severity || 'info'}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};
```

## API Endpoints

### Authentication Endpoints
```
POST /api/auth/login                 # User login
GET  /api/auth/verify                # Email verification
POST /api/auth/complete-registration # Complete user registration
```

### Identifier Pool Management
```
GET    /api/IdentifierPool           # Get all identifiers
GET    /api/IdentifierPool/stats     # Get pool statistics
GET    /api/IdentifierPool/{id}      # Get specific identifier
POST   /api/IdentifierPool/upload    # Upload Excel file
POST   /api/IdentifierPool/bulk-save # Save multiple identifiers
POST   /api/IdentifierPool/assign    # Assign identifier to mattress
```

### User Management
```
GET  /api/Users/organization/{orgId} # Get organization users
POST /api/email/invite               # Send user invitation
```

### Mattress Management
```
GET  /api/mattress                   # Get all mattresses
GET  /api/mattress/{id}              # Get specific mattress
GET  /api/mattress/{id}/log          # Get mattress logs
```

### Mattress Type Management
```
GET  /api/mattresstype/display-all-types # Get all mattress types
GET  /api/mattresstype/summaries         # Get type summaries
GET  /api/mattresstype/{id}              # Get specific type
POST /api/mattresstype                   # Create new type
```

## Data Flow

### User Authentication Flow
```
1. User enters credentials → Login component
2. EncryptionService encrypts password
3. AuthService calls /api/auth/login
4. Backend validates and returns JWT
5. AuthContext stores token and user data
6. Protected routes become accessible
```

### Identifier Pool Upload Flow
```
1. User selects Excel file → ExtractionPage
2. IdentifierPoolService uploads file
3. Backend validates Excel structure
4. Validation results returned to frontend
5. User confirms valid data
6. Bulk save operation executed
7. Dashboard statistics updated
```

### Mattress Lifecycle Flow
```
1. Production → In Production status
2. Quality Check → In Inventory
3. Assignment → Assigned to location
4. Deployment → In Use
5. Maintenance → Needs Cleaning
6. Rotation → Rotation Needed
7. End of Life → Decommissioned
```

## Component Structure

### Core Layout Components
```
components/
├── layout/
│   ├── Navbar.js           # Top navigation bar
│   └── Sidebar.js          # Side navigation menu
├── ui/
│   └── button.js           # Custom button component
├── MattressLifecycleTimeline.js # Lifecycle visualization
└── Snackbar.js             # Notification component
```

### Page Components
```
pages/
├── Dashboard.js            # Main dashboard with analytics
├── LandingPage.js          # Public landing page
├── Login.js                # Authentication page
├── ConfirmRegistration.js  # Email verification page
├── Users/
│   ├── UsersPage.js        # User management interface
│   └── InviteUserDialog.js # User invitation modal
├── Mattress/
│   ├── MattressPage.js     # Mattress listing and management
│   └── MattressDetailsDrawer.js # Mattress detail view
├── MattressType/
│   ├── MattressTypePage.js # Mattress type management
│   ├── CreateDPPForm.js    # Digital Product Passport creation
│   └── MattressTypeDetailDrawer.js # Type details
├── Extraction/
│   └── ExtractionPage.js   # Identifier pool management
└── Guest/
    └── GuestPage.js        # Public mattress lookup
```

## Features

### ✅ Implemented Features

**User Management**
- Multi-role authentication (Admin, Manager, User)
- Organization-based access control
- Email invitation system
- User profile management

**Mattress Management**
- Complete lifecycle tracking
- Status management (8 different states)
- Location tracking
- Batch number management
- RFID/EPC code integration

**Identifier Pool**
- Excel file bulk import
- Data validation and error reporting
- QR code generation
- Assignment tracking
- Pool statistics

**Dashboard & Analytics**
- Real-time statistics
- Mattress distribution charts
- Lifecycle timeline visualization
- Organization metrics

**Security**
- JWT-based authentication
- Password encryption with salt
- Token expiration handling
- Route-based access control

### 🔧 Planned Features
- Advanced reporting and analytics
- Mobile application support
- IoT device integration
- Automated notification system
- Audit logging
- Data export functionality

## Implementation Examples

### 1. Complete Login Flow Example

```javascript
// 1. User clicks login button
const handleLogin = async () => {
  try {
    // 2. Encrypt password
    const encrypted = EncryptionService.encryptPassword(password);
    
    // 3. Call API
    const response = await AuthService.login(email, encrypted);
    
    // 4. Store token and user data
    localStorage.setItem('token', response.data.token);
    
    // 5. Update context
    setUser(decodedUserData);
    
    // 6. Navigate to dashboard
    navigate('/dashboard');
  } catch (error) {
    showError(error.message);
  }
};
```

### 2. Complete File Upload Example

```javascript
// 1. User selects Excel file
const handleFileUpload = async (file) => {
  try {
    // 2. Validate file type
    if (!file.name.endsWith('.xlsx')) {
      throw new Error('Please select an Excel file');
    }
    
    // 3. Upload and validate
    const validationResult = await IdentifierPoolService.uploadAndValidate(file);
    
    // 4. Show validation results
    setValidationData(validationResult);
    
    // 5. Allow user to confirm save
    if (validationResult.isValid) {
      setShowConfirmDialog(true);
    }
  } catch (error) {
    showError(error.message);
  }
};
```

### 3. Complete User Invitation Example

```javascript
// 1. Admin opens invite dialog
const handleInviteClick = () => {
  setInviteDialogOpen(true);
};

// 2. Admin fills form and submits
const handleInviteSubmit = async (email, role) => {
  try {
    // 3. Send invitation
    await UserService.inviteUser(email, role, user.orgId);
    
    // 4. Show success message
    showSuccess('Invitation sent successfully');
    
    // 5. Close dialog
    setInviteDialogOpen(false);
  } catch (error) {
    showError(error.message);
  }
};
```

## File Structure

```
MATCRON/
├── web-app/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/             # Images, icons, static files
│   │   ├── components/         # Reusable UI components
│   │   │   ├── layout/         # Layout components
│   │   │   └── ui/             # UI primitives
│   │   ├── context/            # React Context providers
│   │   ├── lib/                # Utility libraries
│   │   ├── pages/              # Page components
│   │   ├── services/           # API service layer
│   │   ├── utils/              # Helper functions
│   │   ├── App.js              # Main application component
│   │   ├── index.js            # Application entry point
│   │   └── theme.js            # Material-UI theme config
│   ├── package.json            # Frontend dependencies
│   ├── tailwind.config.js      # Tailwind configuration
│   └── Dockerfile              # Frontend containerization
├── Backend/                    # ASP.NET Core API
│   ├── Controllers/            # API controllers
│   ├── Repositories/           # Data access layer
│   │   └── Interfaces/         # Repository contracts
│   ├── DTOs/                   # Data transfer objects
│   ├── Models/                 # Entity models
│   ├── Services/               # Business logic
│   └── Common/                 # Shared utilities
└── README.md                   # Project documentation
```

## Development Setup

### Prerequisites
- Node.js 18+
- .NET 6.0+
- SQL Server
- Docker (optional)

### Frontend Setup
```bash
cd web-app
npm install
npm start                       # Runs on http://localhost:3000
```

### Backend Setup
```bash
cd Backend
dotnet restore
dotnet run                      # Runs on http://localhost:5225
```

### Environment Variables
```env
# Frontend (.env)
REACT_APP_API_URL=http://localhost:5225

# Backend (appsettings.json)
ConnectionStrings__DefaultConnection="Server=...;Database=MATCRON;..."
JwtSettings__SecretKey="your-secret-key"
JwtSettings__Issuer="MATCRON"
JwtSettings__Audience="MATCRON-Users"
```

### Docker Setup
```bash
# Frontend only
docker build -t matcron-frontend .
docker run -p 3000:3000 matcron-frontend
```

## Troubleshooting Guide

### Common Authentication Issues

1. **Token Expired Error**
   ```javascript
   // Check browser console for:
   console.log('Token expired:', isTokenExpired(token));
   
   // Solution: Implement auto-refresh or logout
   if (isTokenExpired(token)) {
     localStorage.removeItem('token');
     navigate('/login');
   }
   ```

2. **CORS Issues**
   ```javascript
   // Ensure backend CORS configuration allows frontend domain
   // Check network tab for preflight OPTIONS requests
   ```

3. **Password Encryption Mismatch**
   ```javascript
   // Verify encryption matches backend expectations
   console.log('Encrypted password:', EncryptionService.encryptPassword(password));
   ```

### Common API Issues

1. **401 Unauthorized**
   - Check if token is included in request headers
   - Verify token hasn't expired
   - Ensure user has required permissions

2. **Network Timeout**
   ```javascript
   // Increase timeout in axios configuration
   axios.defaults.timeout = 60000; // 60 seconds
   ```

3. **File Upload Failures**
   - Check file size limits
   - Verify Content-Type headers
   - Ensure multipart/form-data encoding

### Development Tips

1. **Enable Debug Logging**
   ```javascript
   // Add to localStorage for verbose logging
   localStorage.setItem('debug', 'true');
   ```

2. **Mock API Responses**
   ```javascript
   // Use MSW (Mock Service Worker) for offline development
   ```

3. **Hot Reload Issues**
   ```bash
   # Clear React cache
   rm -rf node_modules/.cache
   npm start
   ```

---

**Document Version**: 2.0  
**Last Updated**: January 2025  
**Maintained By**: MATCRON Development Team 