# MatCron Web & Mobile Application Workflow Documentation

## Table of Contents
- [System Overview](#system-overview)
- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Frontend Architecture (Web Admin Dashboard)](#frontend-architecture-web-admin-dashboard)
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
- [**Deployment Architecture**](#deployment-architecture)
- [**CI/CD Pipeline**](#cicd-pipeline)
- [**Performance & Scalability**](#performance--scalability)
- [**Monitoring & Observability**](#monitoring--observability)
- [**Testing Strategy**](#testing-strategy)
- [**Data Management & Backup**](#data-management--backup)
- [**Mobile Architecture (Detailed)**](#mobile-architecture-detailed)
- [**Integration Architecture**](#integration-architecture)
- [**Compliance & Governance**](#compliance--governance)
- [**Disaster Recovery Plan**](#disaster-recovery-plan)
- [**API Documentation Standards**](#api-documentation-standards)
- [**Version Control Strategy**](#version-control-strategy)



## System Overview

MatCron is a comprehensive mattress management and tracking platform designed for healthcare organizations to efficiently manage, track, and transfer mattresses across different facilities. The system provides:

- **Web Admin Dashboard**: React-based admin portal for comprehensive mattress management, organization administration, and reporting
- **Mobile Application**: End-user application for real-time mattress tracking and notifications  
- **Backend API**: Centralized .NET Core Web API serving both applications
- **Database**: MySQL database with complex entity relationships for data integrity
- **Authentication**: JWT-based security system with role-based access control

### Key Capabilities
- **Mattress Tracking**: Complete lifecycle management with RFID/QR code integration
- **User Management**: Multi-role user system with organization-based access control
- **Identifier Pool Management**: Excel-based bulk identifier import and validation
- **Dashboard Analytics**: Real-time statistics and reporting
- **Guest Access**: Public interface for mattress status checking
- **Group Transfer System**: Inter-organization mattress transfer workflows

## Architecture Overview

The system follows a modern **3-tier architecture** pattern with multiple client applications:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
├─────────────────────┬─────────────────────┬─────────────────┤
│   Web Admin App    │   Mobile App        │   Guest Portal  │
│   React SPA +      │   Offline Sync +    │   Public Access │
│   Material-UI +    │   Push Notifications│   QR/EPC Lookup │
│   Tailwind CSS     │   Offline Sync +    │   Status Check  │
└─────────────────────┴─────────────────────┴─────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     BUSINESS LAYER                          │
│     ASP.NET Core Web API + JWT Auth + Repository Pattern   │
│     Controllers + Services + Custom Middleware             │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                             │
│          Entity Framework Core + MySQL Database            │
│          Complex Relationships + Audit Logging             │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Patterns Used
- **Repository Pattern**: Data access abstraction
- **Service Layer Pattern**: Business logic encapsulation
- **Context API Pattern**: State management in React
- **Protected Route Pattern**: Authentication-based routing
- **DTO Pattern**: Data transfer objects for API communication
- **Middleware Pattern**: Custom JWT validation and security

## Technology Stack

### Frontend Technologies (Web Admin Dashboard)
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.0.0 | Core UI framework |
| **Material-UI** | 6.4.5 | Component library |
| **Tailwind CSS** | 3.3.5 | Utility-first CSS |
| **React Router** | 7.2.0 | Client-side routing |
| **Axios** | 1.7.9 | HTTP client |
| **Recharts** | 2.15.1 | Data visualization |
| **Crypto-JS** | 4.2.0 | Encryption utilities |
| **QRCode** | 1.5.4 | QR code generation |

### Frontend Technologies (Mobile - Planned)
| Technology | Purpose |
|------------|---------|
| [To be specified] | Offline sync, Push notifications, Location tracking |

### Backend Technologies
| Technology | Purpose |
|------------|---------|
| **ASP.NET Core** | Web API framework |
| **Entity Framework Core** | ORM and database access |
| **JWT** | Authentication tokens |
| **SendGrid** | Email service integration |
| **EPPlus** | Excel file processing |
| **BCrypt** | Password hashing |
| **Swagger** | API documentation |

### Database & Infrastructure
| Technology | Purpose |
|------------|---------|
| **MySQL 8.0** | Primary database |
| **Docker** | Containerization |
| **IndexedDB** | Client-side session storage |

### Development Tools
- **Node.js 18**: Frontend build environment
- **npm**: Package management
- **Git**: Version control

## Frontend Architecture (Web Admin Dashboard)

### Component Hierarchy
```
App
├── AuthProvider (Context)
├── UserProvider (Context)  
├── DBProvider (Context)
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

### State Management Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    CONTEXT PROVIDERS                        │
├─────────────────┬─────────────────┬─────────────────────────┤
│   AuthContext   │   UserContext   │      DBContext          │
│                 │                 │                         │
│ • Authentication│ • User Profile  │ • IndexedDB Session     │
│ • Token State   │ • Organization  │ • Offline Storage       │
│ • Login/Logout  │ • Permissions   │ • Cache Management      │
└─────────────────┴─────────────────┴─────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   COMPONENT STATE                           │
├─────────────────┬─────────────────┬─────────────────────────┤
│ useState        │ useEffect       │ Custom Hooks            │
│ Local State     │ Side Effects    │ Business Logic          │
└─────────────────┴─────────────────┴─────────────────────────┘
```

### Routing Strategy
```
PUBLIC ROUTES (Unauthenticated)
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ /               │───▶│ LandingPage     │    │ Marketing Info  │
│ (Root)          │    │                 │    │ Feature List    │
└─────────────────┘    └─────────────────┘    └─────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ /login          │───▶│ Login           │    │ Authentication  │
│                 │    │                 │    │ Form            │
└─────────────────┘    └─────────────────┘    └─────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ /verify-email   │───▶│ ConfirmReg      │    │ Email Confirm   │
│ ?token=xxx      │    │                 │    │ & Registration  │
└─────────────────┘    └─────────────────┘    └─────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ /guest          │───▶│ GuestPage       │    │ Public Mattress │
│                 │    │                 │    │ Lookup          │
└─────────────────┘    └─────────────────┘    └─────────────────┘

PROTECTED ROUTES (Authenticated)
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ /dashboard      │───▶│ Dashboard       │    │ Analytics &     │
│                 │    │                 │    │ Statistics      │
└─────────────────┘    └─────────────────┘    └─────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ /users          │───▶│ UsersPage       │    │ User Management │
│                 │    │                 │    │ & Invitations   │
└─────────────────┘    └─────────────────┘    └─────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ /mattress       │───▶│ MattressPage    │    │ Mattress CRUD   │
│                 │    │                 │    │ & Lifecycle     │
└─────────────────┘    └─────────────────┘    └─────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ /mattress-types │───▶│ MattressType    │    │ Type Management │
│                 │    │ Page            │    │ & DPP Creation  │
└─────────────────┘    └─────────────────┘    └─────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ /extraction     │───▶│ ExtractionPage  │    │ Identifier Pool │
│                 │    │                 │    │ & Excel Import  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Service Layer Architecture
```
services/
├── AuthService.js           # Authentication API calls
├── UserService.js           # User management operations  
├── MattressService.js       # Mattress CRUD operations
├── MattressTypeService.js   # Mattress type management
├── IdentifierPoolService.js # Identifier pool operations
└── EncryptionService.js     # Security utilities

┌─────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER FLOW                       │
├─────────────────┬─────────────────┬─────────────────────────┤
│ Component       │ Service Layer   │ Backend API             │
│ (UI Layer)      │ (Abstraction)   │ (Data Source)           │
└─────────┬───────┴─────────┬───────┴─────────┬───────────────┘
          ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Button Click    │ │ Service Method  │ │ HTTP Request    │
│ Form Submit     │ │ Error Handling  │ │ JSON Response   │
│ User Action     │ │ Data Transform  │ │ Status Codes    │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## 2. System Components

| Component | Description | Key Features |
|-----------|-------------|--------------|
| **Web Application** | Admin/User Portal | Mattress lifecycle management, Organization administration, Group transfers, Reporting & analytics, User management |
| **Mobile Application** | End-user Application | Real-time mattress tracking, Location services, Push notifications, Offline capabilities |
| **Backend API**: Centralized .NET Core Web API serving both applications | JWT authentication, Repository pattern, Real-time notifications, Email integration, Excel operations |
| **Database**: MySQL database with complex entity relationships for data integrity | Entity relationships, Connection pooling, Retry mechanisms, Data integrity constraints |
| **Authentication**: JWT + Email Verification | Token-based auth, Email verification, Role-based authorization, Custom middleware |

## 3. Technology Stack

| Layer | Technology | Implementation Details |
|-------|------------|----------------------|
| **Frontend (Web)** | [To be specified] | Responsive UI, Real-time updates, Secure token management |
| **Frontend (Mobile)** | [To be specified] | Offline sync, Push notifications, Location tracking |
| **Backend** | .NET Core 6.0+ | Entity Framework Core, Repository Pattern, Dependency Injection |
| **Database** | MySQL 8.0 | Connection retry (5 attempts, 30s delay), Secure connections |
| **Hosting** | Docker Containers | Multi-environment support, Scalable architecture |
| **Authentication** | JWT (HS256) | Custom middleware, Email verification, Role validation |
| **Communication** | REST APIs over HTTPS | CORS enabled, Swagger documentation |
| **Email Service** | SendGrid Integration | Template-based emails, Verification workflows |
| **File Processing** | EPPlus (Excel) | Import/Export capabilities, QR code generation |

## 4. Database Architecture & Relationships (Updated from ERD)

### 4.1 Core Entities (Actual Implementation)

#### **User Entity**
```csharp
- id (PK)
- org_id (FK → organisation)
- password
- token_remember
- email
- email_verified
- user_type
- image
```

**Relationships:**
- **Many-to-One** with Organisation (User belongs to one Organization)
- **One-to-Many** with UserNotification (User receives notifications)
- **One-to-Many** with RequestOrder (User can create orders)

#### **Organisation Entity**
```csharp
- id (PK)
- account_id (FK)
- name
- email
- discption (description)
- postal_address
- normal_address
- website_link
- logo
- reg_no (registration number)
- org_type (organization type)
```

**Relationships:**
- **One-to-Many** with Users (Organization has many users)
- **One-to-Many** with Mattresses (Organization owns mattresses)
- **One-to-Many** with Groups (Organization manages groups)
- **One-to-Many** with Notifications (Organization receives notifications)

#### **Mattress Entity**
```csharp
- uid (PK)
- type_id (FK → mattress_type)
- batch_no
- production_date
- group_id (FK → group)
- org_id (FK → organisation)
- epc_code
- status
- life_cycles_end
- days_to_rotate
- image
- location_id (FK → location_mattress)
```

**Relationships:**
- **Many-to-One** with MattressType (Type classification)
- **Many-to-One** with Organisation (Ownership)
- **Many-to-One** with Group (Group assignment)
- **Many-to-One** with LocationMattress (Location tracking)
- **One-to-Many** with LogMattress (Activity logs)
- **Many-to-Many** with Groups (via Mattretss_group junction table)

#### **Group Entity**
```csharp
- id (PK)
- Org_ID (FK → organisation)
- user_id (FK → User)
- contact_number
- Status
```

**Relationships:**
- **Many-to-One** with Organisation (Group belongs to organization)
- **Many-to-One** with User (Group managed by user)
- **One-to-Many** with Mattresses (Group contains mattresses)
- **Many-to-Many** with Mattresses (via Mattretss_group junction table)
- **One-to-Many** with RequestOrder (Group can have orders)
- **One-to-Many** with LogGroup (Group activity logs)

#### **MattressType Entity**
```csharp
- id (PK)
- width
- length
- height
- composition
- washable
- name
- rotation_interval
- recycling_details
- expected_lifespan
- warranty_period
- image
```

**Relationships:**
- **One-to-Many** with Mattresses (Type defines multiple mattresses)

#### **LocationMattress Entity**
```csharp
- id (PK)
- name
- description
- status
```

**Relationships:**
- **One-to-Many** with Mattresses (Location hosts multiple mattresses)

#### **Notification System**

##### **NotificationType Entity**
```csharp
- id (PK)
- name
- description
- template
```

##### **Notification Entity**
```csharp
- id (PK)
- org_id (FK → organisation)
- notification_type_id (FK → notification_type)
- message
- status
- created_at
- updated_at
```

##### **UserNotification Entity**
```csharp
- id (PK)
- notification_id (FK → notification)
- User_ID (FK → User)
- read_status
- read_at
```

**Relationships:**
- **One-to-Many**: NotificationType → Notification
- **Many-to-One**: Notification → Organisation
- **One-to-Many**: Notification → UserNotification
- **Many-to-One**: UserNotification → User

#### **Junction Tables**

##### **Mattretss_group (Many-to-Many Junction)**
```csharp
- Mattress_id (FK → mattress)
- group_id (FK → group)
- Composite PK (Mattress_id, group_id)
```

#### **Logging System**

##### **LogMattress Entity**
```csharp
- id (PK)
- mattress_id (FK → mattress)
- status
- details
- type
- time_stamp
```

##### **LogGroup Entity**
```csharp
- id (PK)
- group_id (FK → group)
- detail (JSON format)
```

#### **RequestOrder Entity**
```csharp
- id (PK)
- group_id (FK → group)
- user_ID (FK → User)
```

### 4.2 Updated Entity Relationship Diagram Flow

```
Organisation (1) ←→ (Many) User
Organisation (1) ←→ (Many) Mattress
Organisation (1) ←→ (Many) Group
Organisation (1) ←→ (Many) Notification

User (1) ←→ (Many) UserNotification
User (1) ←→ (Many) Group (as manager)
User (1) ←→ (Many) RequestOrder

MattressType (1) ←→ (Many) Mattress
LocationMattress (1) ←→ (Many) Mattress

Group (1) ←→ (Many) Mattress (direct relationship)
Group (Many) ←→ (Many) Mattress (via Mattretss_group junction)
Group (1) ←→ (Many) RequestOrder
Group (1) ←→ (Many) LogGroup

Mattress (1) ←→ (Many) LogMattress

NotificationType (1) ←→ (Many) Notification
Notification (1) ←→ (Many) UserNotification
```

### 4.3 Key Database Design Observations

#### **Dual Group-Mattress Relationships**
The system implements both:
1. **Direct relationship**: `mattress.group_id → group.id`
2. **Many-to-Many relationship**: via `Mattretss_group` junction table

This design allows for:
- Primary group assignment (direct FK)
- Multiple group associations (junction table)
- Flexible mattress grouping scenarios

#### **Comprehensive Logging System**
- **LogMattress**: Tracks individual mattress operations and status changes
- **LogGroup**: Stores group-level activities in JSON format for flexibility
- **UserNotification**: Maintains read status and notification delivery tracking

#### **Location Management**
- **LocationMattress**: Dedicated entity for location tracking
- Enables detailed location-based reporting and mattress positioning

#### **Request/Order System**
- **RequestOrder**: Links users to groups for order management
- Enables workflow for mattress requests and approvals

#### **Notification Architecture**
- **Template-based system**: NotificationType stores reusable templates
- **Organization-scoped**: Notifications tied to specific organizations
- **User-specific delivery**: UserNotification tracks individual user interactions

## 5. Application Workflow

### 5.1 Authentication Flow

#### **Login Process**
```
1. User → POST /api/auth/login (LoginRequestDto)
2. AuthController → AuthRepository.LoginUserAsync()
3. Repository validates credentials against User table
4. JWT token generated with claims (Id, OrgId, Email, Role)
5. Token returned to client
6. Subsequent requests include Bearer token in Authorization header
7. JwtMiddleware validates token and populates HttpContext.User
```

#### **Registration & Email Verification**
```
1. Admin → Creates user invitation (EmailInvitationDto)
2. AuthRepository.CreateUserAndVerificationAsync()
3. User record created with EmailVerified = 0
4. Verification token generated and stored in UserVerification
5. Email sent via EmailService with verification link
6. User clicks link → GET /api/auth/verify?token=xxx
7. AuthRepository.VerifyEmailTokenAsync() validates token
8. User → POST /api/auth/complete-registration (CompleteRegistrationDto)
9. Profile completed, EmailVerified = 1
```

### 5.2 Mattress Management Flow

#### **Mattress Lifecycle**
```
1. Identifier Pool Management:
   - Bulk import of EPC codes via IdentifierPoolController
   - QR code generation and storage
   - Assignment tracking

2. Mattress Creation:
   - POST /api/mattress (MattressDto)
   - MattressRepository.AddMattressAsync()
   - Assignment from identifier pool
   - Location and type association

3. Group Management:
   - Groups created for mattress transfers
   - Multiple mattresses assigned to groups
   - Status tracking (Active → InTransit → Archived)

4. Transfer Process:
   - Group status: Active → InTransit (TransferOut)
   - Mattress status: Available → InTransit
   - Notifications sent to involved organizations
   - ImportMattresses updates: InTransit → Available
   - Group archived after successful import
```

### 5.3 Mobile Application Flow

#### **Mobile Authentication**
```
1. Mobile App → Login API with credentials
2. JWT token received and stored securely
3. Token included in all API requests
4. Automatic token refresh logic
5. Logout clears stored tokens
```

#### **Real-time Synchronization**
```
1. Mobile App → Periodic API calls for data sync
2. Local caching of critical data
3. Offline queue for pending operations
4. Conflict resolution on reconnection
5. Push notifications for real-time updates
```

## 6. Controller Implementation Details

### 6.1 AuthController
**Repository Interface:** `IAuthRepository`

**Key Functions:**
- `LoginUserAsync()`: Credential validation and JWT generation
- `VerifyEmailTokenAsync()`: Email verification token validation  
- `CompleteRegistrationAsync()`: User profile completion

**Endpoints:**
- `POST /api/auth/login` - User authentication
- `GET /api/auth/verify` - Email verification  
- `POST /api/auth/complete-registration` - Profile completion

### 6.2 MattressController  
**Repository Interface:** `IMattressRepository`

**Key Functions:**
- `GetAllMattressesAsync()`: Retrieve all mattresses with filtering
- `GetMattressByIdAsync()`: Detailed mattress information
- `AddMattressAsync()`: Create new mattress
- `EditMattressAsync()`: Update mattress details
- `DeleteMattressAsync()`: Soft delete mattress

**Endpoints:**
- `GET /api/mattress` - List all mattresses
- `GET /api/mattress/{id}` - Get specific mattress
- `POST /api/mattress` - Create mattress
- `PUT /api/mattress/{id}` - Update mattress
- `DELETE /api/mattress/{id}` - Delete mattress

### 6.3 GroupController
**Repository Interfaces:** `IGroupRepository`, `INotificationRepository`, `ILogRepository`

**Key Functions:**
- `CreateGroupAsync()`: New group creation
- `AddMattressesToGroupAsync()`: Bulk mattress assignment
- `GetGroupsByStatusAsync()`: Filtered group retrieval
- `TransferOutGroupAsync()`: Initiate transfer process
- `ImportMattressesFromGroupAsync()`: Complete transfer

**Complex Workflows:**
- Group-based mattress transfers between organizations
- Status management throughout transfer lifecycle
- Automatic notification generation
- Audit logging for all operations

### 6.4 OrganisationController
**Repository Interface:** `IOrganisationRepository`

**Key Functions:**
- Organization CRUD operations
- User association management
- Organization-specific data filtering

### 6.5 NotificationController
**Repository Interface:** `INotificationRepository`

**Key Functions:**
- `CreateNotificationAsync()`: System notification creation
- `GetUserNotificationsAsync()`: User-specific notifications
- `MarkAsReadAsync()`: Read status management
- Template-based notification generation

### 6.6 IdentifierPoolController
**Repository Interface:** `IIdentifierPoolRepository`

**Key Functions:**
- Bulk EPC code import from Excel files
- QR code generation and storage
- Assignment tracking and management
- Organization-specific identifier pools

## 7. Repository Pattern Implementation

### 7.1 Interface-Based Architecture
Each controller depends on repository interfaces, enabling:
- **Dependency Injection**: Loose coupling between layers
- **Unit Testing**: Easy mocking of data access
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy replacement of implementations

### 7.2 Repository Responsibilities

#### **IAuthRepository**
- User authentication and authorization
- Email verification workflows
- JWT token management
- Password security

#### **IMattressRepository**  
- Mattress CRUD operations
- Status management
- Location tracking
- Lifecycle management

#### **IGroupRepository**
- Group lifecycle management
- Mattress-group associations
- Transfer orchestration
- Status transitions

#### **INotificationRepository**
- Notification creation and delivery
- Template management
- User notification tracking
- Read status management

## 8. Security Implementation

### 8.1 JWT Authentication
**Token Structure:**
```json
{
  "Id": "user-guid",
  "OrgId": "organization-guid", 
  "Email": "user@domain.com",
  "Role": "user-role",
  "exp": "expiration-timestamp"
}
```

**Security Features:**
- HS256 signature algorithm
- Configurable expiration times
- Claims-based authorization
- Token validation middleware

### 8.2 Custom JWT Middleware
**Validation Process:**
1. Extract Bearer token from Authorization header
2. Validate token signature and expiration
3. Extract claims and verify against database
4. Populate HttpContext.User with claims
5. Verify user exists and org/email match claims
6. Allow/deny request based on validation

**Route Protection:**
- Whitelisted public routes (login, registration, verification)
- All other routes require valid JWT token
- Role-based access control via claims

### 8.3 Data Protection
- Secure connection strings in configuration
- Environment-specific settings
- CORS policy implementation
- HTTPS enforcement
- Input validation and sanitization

## 9. Connectivity Flow

### 9.1 System Architecture
```
[Web App] ←→ [Backend API (.NET Core)] ←→ [Mobile App]
    ↓              ↓                         ↓
[JWT Auth]   [MySQL Database]        [Push Notifications]
    ↓              ↓                         ↓
[HTTPS]      [Email Service]         [Local Storage]
             [Excel Processing]
```

### 9.2 API Communication
- **Protocol**: HTTPS REST APIs
- **Authentication**: JWT Bearer tokens
- **Data Format**: JSON request/response
- **CORS**: Configured for cross-origin requests
- **Documentation**: Swagger/OpenAPI specification

### 9.3 Real-time Features
- Push notifications via NotificationController
- Email notifications via SendGrid integration
- Real-time status updates for transfers
- Audit logging for all operations

## 10. Data Flow Scenarios

### 10.1 Complete Mattress Transfer Flow
```
1. Organization A creates transfer group
2. Multiple mattresses assigned to group
3. Group status: Active
4. Transfer initiated → Group status: InTransit
5. Mattresses status: Available → InTransit  
6. Notifications sent to Organization B
7. Organization B imports mattresses
8. Mattresses status: InTransit → Available
9. Group status: InTransit → Archived
10. Audit logs created for all steps
```

### 10.2 User Onboarding Flow
```
1. Admin creates user invitation
2. Email sent with verification link
3. User verifies email address
4. User completes registration profile
5. Account activated with appropriate role
6. User can access organization-specific data
```

### 10.3 Mobile Synchronization Flow
```
1. Mobile app authenticates with JWT
2. Periodic data synchronization calls
3. Local database updated with changes
4. Offline operations queued locally
5. Sync queue processed on reconnection
6. Conflict resolution for concurrent edits
```

## 11. Integration Points

### 11.1 External Services
- **SendGrid**: Email delivery service for notifications and verification
- **EPPlus**: Excel file processing for bulk operations
- **QR Code Generation**: Identifier visualization
- **Push Notification Service**: Real-time mobile notifications

### 11.2 Internal Service Communication
- Repository pattern for data access abstraction
- Dependency injection for service composition
- Event-driven notifications for status changes
- Centralized logging for audit trails

## 12. Monitoring and Logging

### 12.1 Audit System
- **LogRepository**: Centralized logging service
- **LogMattress**: Mattress-specific operation logs
- **UserNotification**: User activity tracking
- **System Events**: Transfer status changes, authentication events

### 12.2 Error Handling
- Global exception handling middleware
- Structured error responses
- Detailed logging for debugging
- User-friendly error messages

## 13. Scalability Considerations

### 13.1 Architecture Benefits
- **Repository Pattern**: Easy to extend and modify
- **Dependency Injection**: Loose coupling enables scaling
- **Stateless API**: Horizontal scaling capability
- **Database Connection Pooling**: Efficient resource usage

### 13.2 Performance Optimizations
- Entity Framework query optimization
- Connection retry mechanisms
- Bulk operations for large datasets
- Caching strategies for frequently accessed data

## 14. Future Enhancements

### 14.1 Technical Improvements
- Redis caching for improved performance
- SignalR for real-time web updates
- Background services for automated tasks
- API versioning for backward compatibility

### 14.2 Functional Enhancements
- Advanced reporting and analytics
- IoT integration for smart mattresses
- Barcode/RFID scanning capabilities
- Mobile offline synchronization improvements

---

*This documentation provides a comprehensive overview of the MatCron system architecture, covering all major components, data flows, and implementation details. For specific implementation questions or modifications, refer to the individual controller and repository files in the codebase.* 

## 15. Detailed Security Implementation Guide

### 15.1 Password Security Mechanism

#### **Password Security Flow**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Input    │───▶│   Validation    │───▶│   BCrypt Hash   │
│   Password      │    │   Rules Check   │    │   with Salt     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Store Hash    │◀───│   Generate      │◀───│   Secure Hash   │
│   in Database   │    │   Unique Salt   │    │   Generated     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### **Password Validation Rules**
- **Minimum Length**: 8 characters
- **Complexity**: Must contain uppercase, lowercase, number, special character
- **Storage**: Never store plain text passwords
- **Salt**: Unique salt per password (BCrypt generates automatically)
- **Work Factor**: BCrypt cost factor of 12 (adjustable for security vs. performance)

#### **Password Reset Flow**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ User Requests   │───▶│ Generate Secure │───▶│ Store Token in  │
│ Password Reset  │    │ Reset Token     │    │ Database        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Send Email with │◀───│ Email Service   │◀───│ Token + Email   │
│ Reset Link      │    │ (SendGrid)      │    │ Template        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ User Clicks     │───▶│ Validate Token  │───▶│ Password Reset  │
│ Reset Link      │    │ (Expiry/Usage)  │    │ Form Displayed  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ New Password    │───▶│ Hash New        │───▶│ Update Database │
│ Submitted       │    │ Password        │    │ Mark Token Used │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 15.2 Complete JWT Authentication Mechanism

#### **JWT Token Structure**
```
┌─────────────────────────────────────────────────────────────┐
│                        JWT TOKEN                            │
├─────────────────┬─────────────────────┬─────────────────────┤
│     HEADER      │       PAYLOAD       │      SIGNATURE      │
│                 │                     │                     │
│ {               │ {                   │ HMACSHA256(         │
│   "alg":"HS256" │   "Id": "user-id"   │   base64UrlEncode(  │
│   "typ":"JWT"   │   "OrgId": "org-id" │     header) + "." + │
│ }               │   "Email": "email"  │   base64UrlEncode(  │
│                 │   "Role": "role"    │   base64UrlEncode(  │
│                 │   "exp": timestamp  │   payload),       │
│                 │ }                   │   secret)           │
└─────────────────┴─────────────────────┴─────────────────────┘
```

#### **JWT Generation & Validation Flow**
```
LOGIN REQUEST
     ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Validate User   │───▶│ Create Claims   │───▶│ Generate JWT    │
│ Credentials     │    │ (Id,Org,Email)  │    │ with Signature  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
     ▼                           ▼                           ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Return Token    │◀───│ Set Expiration  │◀───│ Sign with       │
│ to Client       │    │ (24 hours)      │    │ Secret Key      │
└─────────────────┘    └─────────────────┘    └─────────────────┘

API REQUEST WITH TOKEN
     ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Extract Bearer  │───▶│ Validate        │───▶│ Verify Database │
│ Token from      │    │ Signature &     │    │ User/Org Match  │
│ Auth Header     │    │ Expiration      │    │ Token Claims    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
     ▼                           ▼                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    JWT VALIDATION                           │
├─────────┬───────────┬───────────┬───────────┬───────────────┤
│ Parse   │ Signature │ Claims    │ Database  │ HttpContext   │
│ Token   │ Verify    │ Extract   │ Verify    │ Population    │
└─────────┴───────────┴───────────┴───────────┴───────────────┘
          ▼
┌─────────────────────────────────────────────────────────────┐
│ AUTHORIZATION CHECK                                         │
├─────────────────┬─────────────────┬─────────────────────────┤
│ Route Protection│ Role Check      │ Organization Access     │
│ Public/Private  │ Admin/User      │ Own Data Only           │
└─────────┬───────┴─────────┬───────┴─────────┬───────────────┘
          ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ CONTROLLER      │ │ REPOSITORY      │ │ DATABASE        │
│ Action Execute  │ │ Data Access     │ │ Query Execute   │
└─────────┬───────┘ └─────────┬───────┘ └─────────┬───────┘
          ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│ RESPONSE PIPELINE                                           │
├─────────────────┬─────────────────┬─────────────────────────┤
│ Security Headers│ JSON Serialization│ HTTP Response         │
│ XSS, CSRF, etc. │ Data → JSON     │ Status Code + Data      │
└─────────────────┴─────────────────┴─────────────────────────┘
```

### 15.4 Frontend Token Management Flow

#### **Web Application Authentication Flow**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ User Login Form │───▶│ POST /api/auth/ │───▶│ Server          │
│ Email/Password  │    │ login           │    │ Validation      │
└─────────────────┘    └─────────────────┘    └─────────┬───────┘
          ▲                                              ▼
┌─────────────────┐                              ┌─────────────────┐
│ Redirect Login  │◀─── FAIL ◀───────────────────│ JWT Generated   │
│ Show Error      │                              │ Success Response│
└─────────────────┘                              └─────────┬───────┘
                                                           ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Store in        │◀───│ Parse Token     │◀───│ Receive Token   │
│ localStorage    │    │ Extract Claims  │    │ from Server     │
└─────────┬───────┘    └─────────────────┘    └─────────────────┘
          ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Set User State  │───▶│ Redirect to     │───▶│ Dashboard/      │
│ ID, Role, Org   │    │ Dashboard       │    │ Main App        │
└─────────────────┘    └─────────────────┘    └─────────────────┘

SUBSEQUENT API CALLS
          ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ HTTP Interceptor│───▶│ Add Bearer      │───▶│ API Request     │
│ Auto-triggered  │    │ Token Header    │    │ with Auth       │
└─────────────────┘    └─────────────────┘    └─────────┬───────┘
          ▲                                              ▼
┌─────────────────┐                              ┌─────────────────┐
│ Logout User     │◀─── 401 RESPONSE ◀───────────│ Server Response │
│ Clear Storage   │                              │ 200/401/403     │
└─────────────────┘                              └─────────────────┘
```

#### **Mobile Application Security Flow**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ App Launch      │───▶│ Check Secure    │───▶│ Token Exists?   │
│                 │    │ Storage         │    │                 │
└─────────────────┘    └─────────────────┘    └─────────┬───────┘
                                                         ▼
                                              ┌─────────────────┐
                                         YES  │ Validate Token  │  NO
                                    ┌─────────│ Expiration      │──────┐
                                    ▼         └─────────────────┘       ▼
                          ┌─────────────────┐           │         ┌─────────────────┐
                          │ Biometric/PIN   │           │ EXPIRED │ Show Login      │
                          │ Authentication  │           ▼         │ Screen          │
                          └─────────┬───────┘ ┌─────────────────┐ └─────────────────┘
                                    ▼         │ Refresh Token   │
                          ┌─────────────────┐ │ or Re-login     │
                          │ AUTHENTICATED   │ └─────────────────┘
                          │ Main App Access │
                          └─────────────────┘

API CALL PROCESS
          ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Get Valid Token │───▶│ Create HTTP     │───▶│ Add Bearer      │
│ from Secure     │    │ Client          │    │ Authorization   │
│ Storage         │    │                 │    │ Header          │
└─────────────────┘    └─────────────────┘    └─────────┬───────┘
                                                         ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Cache Response  │◀───│ Process Server  │◀───│ Execute API     │
│ (if needed)     │    │ Response        │    │ Request         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 15.5 Database Security Architecture

#### **Multi-Layer Security Model**
```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                        │
├─────────────────┬─────────────────┬─────────────────────────┤
│ Input Validation│ Authorization   │ Business Logic          │
│ Model Binding   │ Claims Check    │ Repository Pattern      │
└─────────┬───────┴─────────┬───────┴─────────┬───────────────┘
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   ENTITY FRAMEWORK CORE                     │
├─────────────────┬─────────────────┬─────────────────────────┤
│ Query           │ Change          │ Organization            │
│ Parameterization│ Tracking        │ Data Filtering          │
└─────────┬───────┴─────────┬───────┴─────────┬───────────────┘
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    CONNECTION LAYER                         │
├─────────────────┬─────────────────┬─────────────────────────┤
│ SSL/TLS         │ Connection      │ Retry Logic             │
│ Encryption      │ Pooling         │ Circuit Breaker         │
└─────────┬───────┴─────────┬───────┴─────────┬───────────────┘
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                      MYSQL DATABASE                         │
├─────────────────┬─────────────────┬─────────────────────────┤
│ User Privileges │ Network         │ Data Encryption         │
│ Role-based      │ Firewall        │ at Rest                 │
└─────────────────┴─────────────────┴─────────────────────────┘
```

#### **Organization-Based Data Access Flow**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ User Makes      │───▶│ Extract User    │───▶│ Repository      │
│ API Request     │    │ Claims (OrgId)  │    │ Method Called   │
└─────────────────┘    └─────────────────┘    └─────────┬───────┘
                                                         ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Return Filtered │◀───│ Execute Query   │◀───│ Add OrgId       │
│ Results         │    │ with WHERE      │    │ Filter to       │
└─────────────────┘    └─────────────────┘    │ LINQ Query      │
                                              └─────────────────┘

EXAMPLE FLOW:
GET /api/mattresses
   ▼
User Claims: { OrgId: "org-123" }
   ▼
Query: SELECT * FROM mattresses WHERE org_id = 'org-123'
   ▼
Return: Only mattresses belonging to user's organization
```

### 15.6 Error Handling & Security Response Flow

#### **Security Error Response Pipeline**
```
┌─────────────────┐
│ SECURITY ERROR  │
│ DETECTED        │
└─────────┬───────┘
          ▼
┌─────────────────────────────────────────────────────────────┐
│                    ERROR CLASSIFICATION                     │
├─────────────────┬─────────────────┬─────────────────────────┤
│ Authentication  │ Authorization   │ Validation              │
│ 401 Unauthorized│ 403 Forbidden   │ 400 Bad Request         │
└─────────┬───────┴─────────┬───────┴─────────┬───────────────┘
          ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Log Security    │ │ Log Access      │ │ Log Input       │
│ Event           │ │ Violation       │ │ Validation      │
└─────────┬───────┘ └─────────┬───────┘ └─────────┬───────┘
          ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                 SANITIZED RESPONSE                          │
├─────────────────┬─────────────────┬─────────────────────────┤
│ Generic Message │ Request ID      │ No Sensitive Data       │
│ User-Friendly   │ for Tracking    │ in Error Response       │
└─────────────────┴─────────────────┴─────────────────────────┘
```

This comprehensive flow-based documentation provides all the micro-level security and authentication details in an easy-to-understand visual format for new developers joining the MatCron project. 

## Backend Architecture

### API Structure
```
Backend/
├── Controllers/
│   ├── AuthController.cs           # Authentication endpoints
│   ├── IdentifierPoolController.cs # Identifier pool management
│   ├── MattressController.cs       # Mattress CRUD operations
│   ├── MattressTypeController.cs   # Mattress type management
│   ├── UserController.cs           # User management
│   ├── OrganisationController.cs   # Organization operations
│   ├── GroupController.cs          # Group transfer workflows
│   ├── NotificationController.cs   # Notification system
│   ├── EmailController.cs          # Email services
│   └── LogController.cs            # Audit logging
├── Repositories/
│   ├── Interfaces/                 # Repository contracts
│   │   ├── IAuthRepository.cs
│   │   ├── IIdentifierPoolRepository.cs
│   │   ├── IMattressRepository.cs
│   │   ├── IUserRepository.cs
│   │   └── [Other Interfaces]
│   └── Implementations/            # Repository implementations
├── DTOs/                           # Data transfer objects
│   ├── Auth/
│   ├── IdentifierPool/
│   ├── Mattress/
│   ├── User/
│   └── [Other DTOs]
├── Entities/                       # Database entities
├── Middlewares/
│   └── JwtMiddleware.cs           # Custom JWT validation
├── Common/
│   └── Utilities/
│       └── JwtUtils.cs            # JWT helper methods
└── Services/
    └── EmailService.cs            # Email integration
```

### Repository Pattern Implementation Flow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controller    │───▶│   Interface     │───▶│ Implementation  │
│   (API Layer)   │    │   (Contract)    │    │ (Data Access)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ HTTP Request    │    │ Business Logic  │    │ Entity Framework│
│ DTO Validation  │    │ Abstraction     │    │ Database Query  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Transfer Objects (DTOs) Structure
**Core DTOs for Web Admin Dashboard:**
- **MattressIdentifierDto**: Identifier pool data structure
- **IdentifierStatsDto**: Pool statistics for dashboard
- **IdentifierValidationResultDto**: Excel validation results
- **AssignIdentifierRequest**: Assignment operations
- **UserInvitationDto**: Email invitation data
- **LoginRequestDto**: Authentication credentials
- **CompleteRegistrationDto**: User registration completion
- **MattressDto**: Mattress CRUD operations
- **MattressTypeDto**: Type management operations

## Database Design

### Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           MATCRON DATABASE SCHEMA (ERD)                                 │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  location_mattress│     │ notification_type│     │   notification   │     │ user_notification│
├──────────────────┤     ├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│ PK │ id          │     │ PK │ id          │     │ PK │ id          │     │ PK │ id          │
│    │ name        │     │    │ name        │────▶│ FK │notification_ │     │ FK │notification_│
│    │ description │     │    │ description │     │    │type_id      │     │    │id           │
│    │ status      │     │    │ template    │     │ FK │ org_id      │     │ FK │ User_ID     │
└────┼─────────────┘     └──────────────────┘     │    │ message     │     │    │ read_status │
     │                                            │    │ status      │     │    │ read_at     │
     │                                            │    │ created_at  │     └──────────────────┘
     │                                            │    │ updated_at  │              │
     │                                            └────┼─────────────┘              │
     │                                                 │                            │
     │                   ┌──────────────────┐         │         ┌──────────────────┼──────────┐
     │                   │   mattress_type  │         │         │       User       │          │
     │                   ├──────────────────┤         │         ├──────────────────┤          │
     │                   │ PK │ id          │         │         │ PK │ id          │          │
     │                   │    │ width       │         │         │ FK │ org_id      │          │
     │                   │    │ length      │         │         │    │ password    │          │
     │                   │    │ height      │         │         │    │ token_      │          │
     │                   │    │ Composition │         │         │    │ remember    │          │
     │                   │    │ washable    │         │         │    │ email       │          │
     │                   │    │ name        │         │         │    │ email_      │          │
     │                   │    │ Rotation    │         │         │    │ verified    │          │
     │                   │    │ Interval    │         │         │    │ user_type   │          │
     │                   │    │ Recycling   │         │         │    │ image       │          │
     │                   │    │ details     │         │         └────┼─────────────┘          │
     │                   │    │ Expected    │         │              │                        │
     │                   │    │ Lifespan    │         │              │                        │
     │                   │    │ Warranty    │         │              │                        │
     │                   │    │ period      │         │              │                        │
     │                   │    │ image       │         │              │                        │
     │                   └────┼─────────────┘         │              │                        │
     │                        │                       │              │                        │
     └────────────────────────┼───────────────────────┼──────────────┼────────────────────────┼─┐
                              │                       │              │                        │ │
     ┌────────────────────────┼───────────────────────▼──────────────▼────────────────────────┼─┘
     │                        │              ┌──────────────────┐                            │
     │                        │              │   organisation   │                            │
     │                        │              ├──────────────────┤                            │
     │                        │              │ PK │ id          │                            │
     │                        │              │ FK │ account_id  │                            │
     │                        │              │    │ name        │                            │
     │                        │              │    │ email       │                            │
     │                        │              │    │ discption   │                            │
     │                        │              │    │ postal_     │                            │
     │                        │              │    │ address     │                            │
     │                        │              │    │ normal_     │                            │
     │                        │              │    │ address     │                            │
     │                        │              │    │ website_link│                            │
     │                        │              │    │ logo        │                            │
     │                        │              │    │ reg_no      │                            │
     │                        │              │    │ org_type    │                            │
     │                        │              └────┼─────────────┘                            │
     │                        │                   │                                          │
     │                        │                   │              ┌──────────────────┐       │
     │                        │                   │              │      group       │       │
     │                        │                   │              ├──────────────────┤       │
     │                        │                   │              │ PK │ id          │       │
     │                        │                   └─────────────▶│ FK │ Org_ID      │       │
     │                        │                                  │ FK │ user_id     │◀──────┘
     │                        │                                  │    │ contact_    │
     │                        │                                  │    │ number      │
     │                        │                                  │    │ Status      │
     │                        │                                  └────┼─────────────┘
     │                        │                                       │
     │                        │              ┌──────────────────┐     │     ┌──────────────────┐
     │                        │              │    mattress      │     │     │  Mattretss_group │
     │                        │              ├──────────────────┤     │     ├──────────────────┤
     │                        └─────────────▶│ FK │ type_id     │     │     │ PK │Mattress_id  │◀┐
     │                                       │ PK │ uid         │◀────┼────▶│ PK │group_id     │ │
     └──────────────────────────────────────▶│ FK │ location_id │     │     └──────────────────┘ │
                                             │    │ batch_no    │     │                          │
                                             │    │ production_ │     │     ┌──────────────────┐ │
                                             │    │ date        │     │     │  request_order   │ │
                                             │ FK │ group_id    │◀────┘     ├──────────────────┤ │
                                             │ FK │ org_id      │           │ PK │ id          │ │
                                             │    │ epc_code    │           │ FK │ group_id    │─┘
                                             │    │ status      │           │ FK │ user_ID     │
                                             │    │ life_cycles_│           └──────────────────┘
                                             │    │ end         │
                                             │    │ days_to_    │           ┌──────────────────┐
                                             │    │ rotate      │           │   log_group      │
                                             │    │ image       │           ├──────────────────┤
                                             └────┼─────────────┘           │ PK │ id          │
                                                  │                         │ FK │ group_id    │
                                                  │                         │    │ detail      │
                                                  │                         │    │(JSON format)│
                                                  ▼                         └──────────────────┘
                                             ┌──────────────────┐
                                             │   log_mattress   │
                                             ├──────────────────┤
                                             │ PK │ id          │
                                             │ FK │ matress_id  │
                                             │    │ status      │
                                             │    │ details     │
                                             │    │ type        │
                                             │    │ time_stamp  │
                                             └──────────────────┘
```

### Database Relationships Summary

| **Relationship Type** | **From Entity** | **To Entity** | **Description** |
|-----------------------|-----------------|---------------|-----------------|
| **One-to-Many** | `organisation` | `User` | Organization has many users |
| **One-to-Many** | `organisation` | `mattress` | Organization owns many mattresses |
| **One-to-Many** | `organisation` | `group` | Organization manages many groups |
| **One-to-Many** | `organisation` | `notification` | Organization receives many notifications |
| **One-to-Many** | `User` | `user_notification` | User receives many notifications |
| **One-to-Many** | `User` | `group` | User manages many groups |
| **One-to-Many** | `User` | `request_order` | User creates many orders |
| **One-to-Many** | `mattress_type` | `mattress` | Type defines many mattresses |
| **One-to-Many** | `location_mattress` | `mattress` | Location hosts many mattresses |
| **One-to-Many** | `group` | `mattress` | Group contains many mattresses (direct) |
| **One-to-Many** | `group` | `request_order` | Group has many orders |
| **One-to-Many** | `group` | `log_group` | Group has many activity logs |
| **One-to-Many** | `mattress` | `log_mattress` | Mattress has many operation logs |
| **One-to-Many** | `notification_type` | `notification` | Type defines many notifications |
| **One-to-Many** | `notification` | `user_notification` | Notification sent to many users |
| **Many-to-Many** | `mattress` | `group` | Via `Mattretss_group` junction table |

### Updated Core Entities (From ERD + Web Implementation)

#### **User Entity (Enhanced)**
```sql
Users
├── id (PK)
├── org_id (FK → organisation) 
├── password (encrypted)
├── token_remember 
├── email
├── email_verified
├── user_type (Admin=0, Manager=1, User=2)
├── image (profile picture)
├── first_name (from web registration)
├── last_name (from web registration)
└── created_at
```

#### **Organisation Entity (Enhanced)**
```sql
Organisation
├── id (PK)
├── account_id (FK)
├── name
├── email
├── discption (description)
├── postal_address
├── normal_address
├── website_link
├── logo
├── reg_no (registration number)
├── org_type (organization type)
└── organization_code
```

#### **Mattress Entity (Comprehensive)**
```sql
Mattress
├── uid (PK)
├── type_id (FK → mattress_type)
├── batch_no
├── production_date
├── group_id (FK → group)
├── org_id (FK → organisation)
├── epc_code
├── status (lifecycle status - 8 states)
├── life_cycles_end
├── days_to_rotate
├── image
├── location_id (FK → location_mattress)
├── rotation_timer
└── latest_date_rotate
```

#### **MattressIdentifiers Entity (Web Admin Feature)**
```sql
MattressIdentifiers
├── id (PK)
├── mattress_identifier (unique identifier)
├── epc_code (RFID code)
├── qr_code (base64 QR code)
├── is_assigned (assignment status)
├── mattress_id (FK → mattress)
├── org_id (FK → organisation)
└── created_at
```

### Mattress Status Flow (Web Dashboard)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ In Production   │───▶│ In Inventory    │───▶│ Assigned        │
│ (Status: 0)     │    │ (Status: 1)     │    │ (Status: 2)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                                             │
          ▼                                             ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Decommissioned  │◀───│ Needs Cleaning  │◀───│ In Use          │
│ (Status: 5)     │    │ (Status: 4)     │    │ (Status: 3)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ End of Life     │    │ Rotation Needed │    │ In Transit      │
│                 │    │ (Status: 7)     │    │ (Status: 6)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Database Relationships (Updated)
```
Organisation (1) ←→ (Many) User
Organisation (1) ←→ (Many) Mattress
Organisation (1) ←→ (Many) MattressIdentifiers
Organisation (1) ←→ (Many) Group
Organisation (1) ←→ (Many) Notification

User (1) ←→ (Many) UserNotification
User (1) ←→ (Many) Group (as manager)
User (1) ←→ (Many) RequestOrder

MattressType (1) ←→ (Many) Mattress
LocationMattress (1) ←→ (Many) Mattress
MattressIdentifiers (1) ←→ (0..1) Mattress

Group (1) ←→ (Many) Mattress (direct relationship)
Group (Many) ←→ (Many) Mattress (via Mattretss_group junction)
Group (1) ←→ (Many) RequestOrder
Group (1) ←→ (Many) LogGroup

Mattress (1) ←→ (Many) LogMattress

NotificationType (1) ←→ (Many) Notification
Notification (1) ←→ (Many) UserNotification
```

## Authentication & Security

### JWT Token Structure (Enhanced for Web Dashboard)
```json
{
  "Id": "user-guid",
  "Email": "user@example.com",
  "UserType": 0,           // 0=Admin, 1=Manager, 2=User
  "OrgId": "org-guid",
  "OrgType": "organization-type",
  "iss": "Matcron.online",
  "aud": "Matcron.online", 
  "exp": 1640995200,       // 24-hour expiration
  "iat": 1640908800,
  "nbf": 1640908800
}
```

### Multi-Layer Security Features
```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                          │
├─────────────────┬─────────────────┬─────────────────────────┤
│   Frontend      │   Transport     │      Backend            │
│   Security      │   Security      │      Security           │
└─────────┬───────┴─────────┬───────┴─────────┬───────────────┘
          ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ • Password      │ │ • HTTPS/TLS     │ │ • JWT Validation│
│   Encryption    │ │ • CORS Policy   │ │ • BCrypt Hash   │
│ • Token Storage │ │ • Security      │ │ • DB Encryption │
│ • Route Guards  │ │   Headers       │ │ • Input Valid   │
│ • Input Valid   │ │ • Request       │ │ • Role-based    │
│ • XSS Prevention│ │   Timeout       │ │   Authorization │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Role-Based Access Control (RBAC)
```
┌─────────────────────────────────────────────────────────────┐
│                    USER ROLE HIERARCHY                      │
├─────────────────┬─────────────────┬─────────────────────────┤
│     ADMIN       │    MANAGER      │        USER             │
│   (Type: 0)     │   (Type: 1)     │     (Type: 2)           │
└─────────┬───────┴─────────┬───────┴─────────┬───────────────┘
          ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ • All Features  │ │ • User Mgmt     │ │ • View Only     │
│ • User Mgmt     │ │ • Mattress Mgmt │ │ • Basic Actions │
│ • System Config │ │ • Reports       │ │ • Own Profile   │
│ • Organization  │ │ • Groups        │ │                 │
│   Admin         │ │                 │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘

ROUTE PROTECTION FLOW
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ User Access     │───▶│ Check Token     │───▶│ Validate Role   │
│ Protected Route │    │ & Expiration    │    │ & Permissions   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ DENY ACCESS     │◀───│ TOKEN INVALID   │    │ TOKEN VALID     │───▶┌─────────────────┐
│ Redirect Login  │    │                 │    │                 │    │ ALLOW ACCESS    │
└─────────────────┘    └─────────────────┘    └─────────────────┘    │ Render Component│
                                                                      └─────────────────┘
```

## Detailed Authentication Implementation

### Complete Login Process Flow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ User Enters     │───▶│ EncryptionService│───▶│ AuthService     │
│ Credentials     │    │ Encrypt Password │    │ API Call        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Form Validation │    │ SHA256 + Salt   │    │ AuthService     │
│ Email Format    │    │ + Timestamp     │    │ API Call        │
│ Password Length │    │ + AES Encrypt   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Valid Input     │───▶│ Encrypted       │───▶│ Backend         │
│ Continue        │    │ Password        │    │ Validation      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Store in        │◀───│ JWT Token       │◀───│ Success         │
│ localStorage    │    │ Generated       │    │ Response        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Update Auth     │───▶│ Decode Token    │───▶│ Navigate to     │
│ Context         │    │ Extract Claims  │    │ Dashboard       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Password Security Implementation Flow
```
PASSWORD ENCRYPTION LAYERS
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Layer 1:        │───▶│ Layer 2:        │───▶│ Layer 3:        │
│ Hash + Salt     │    │ Add Timestamp   │    │ AES Encryption  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ SHA256(pass +   │    │ hash + "|" +    │    │ AES-CBC with    │
│ "matrcronIs     │    │ ISO timestamp   │    │ random IV       │
│ TheBest2024")   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Fixed length    │    │ Temporal data   │    │ "IV:CIPHERTEXT" │
│ hash output     │    │ for uniqueness  │    │ final format    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Token Management System

### JWT Lifecycle Management
```
TOKEN GENERATION & VALIDATION CYCLE
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Successful      │───▶│ Create Claims   │───▶│ Sign with       │
│ Authentication  │    │ (Id,Org,Email)  │    │ Secret Key      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ 24-hour         │◀───│ Set Expiration  │◀───│ JWT Token       │
│ Expiration      │    │ Timestamp       │    │ Generated       │
└─────────────────┘    └─────────────────┘    └─────────────────┘

EVERY API REQUEST VALIDATION
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Extract Bearer  │───▶│ Parse Token     │───▶│ Validate        │
│ from Auth       │    │ Structure       │    │ Signature       │
│ Header          │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    JWT VALIDATION                           │
├─────────┬───────────┬───────────┬───────────┬───────────────┤
│ Parse   │ Signature │ Claims    │ Database  │ HttpContext   │
│ Token   │ Verify    │ Extract   │ Verify    │ Population    │
└─────────┴───────────┴───────────┴───────────┴───────────────┘
          ▼
┌─────────────────────────────────────────────────────────────┐
│ AUTHORIZATION CHECK                                         │
├─────────────────┬─────────────────┬─────────────────────────┤
│ Route Protection│ Role Check      │ Organization Access     │
│ Public/Private  │ Admin/User      │ Own Data Only           │
└─────────┬───────┴─────────┬───────┴─────────┬───────────────┘
          ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ CONTROLLER      │ │ REPOSITORY      │ │ DATABASE        │
│ Action Execute  │ │ Data Access     │ │ Query Execute   │
└─────────┬───────┘ └─────────┬───────┘ └─────────┬───────┘
          ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│ RESPONSE PIPELINE                                           │
├─────────────────┬─────────────────┬─────────────────────────┤
│ Security Headers│ JSON Serialization│ HTTP Response         │
│ XSS, CSRF, etc. │ Data → JSON     │ Status Code + Data      │
└─────────────────┴─────────────────┴─────────────────────────┘
```

### Frontend Token Management Flow
```
WEB APPLICATION TOKEN HANDLING
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ App Startup     │───▶│ Check           │───▶│ Token Exists?   │
│                 │    │ localStorage    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────┬───────┘
                                                         │
                                              YES ┌──────▼──────┐ NO
                                          ┌───────│ Validate    │──────┐
                                          ▼         └─────────────────┘       ▼
                                 ┌─────────────────┐           │         ┌─────────────────┐
                                 │ VALID TOKEN     │           │ EXPIRED │ Show Login      │
                                 │ → Auto Login    │           │         │ Screen          │
                                 └─────────────────┘           │         └─────────────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │ CLEAR STORAGE   │
                                                │ → Show Login    │
                                                └─────────────────┘
```

## Email System Implementation

### User Invitation Workflow
```
ADMIN INVITATION PROCESS
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Admin Opens     │───▶│ InviteUser      │───▶│ Form Validation │
│ Invite Dialog   │    │ Dialog          │    │ Email & Role    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Select Role     │    │ Enter Email     │    │ Submit Button   │
│ Admin/Manager/  │    │ Address         │    │ Clicked         │
│ User            │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ UserService     │───▶│ POST /api/email/│───▶│ Backend Creates │
│ inviteUser()    │    │ invite          │    │ User Record     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Generate        │    │ Send Email via  │    │ Show Success    │
│ Verification    │    │ SendGrid        │    │ Message         │
│ Token           │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘

EMAIL CONFIRMATION PROCESS
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ User Clicks     │───▶│ GET /api/auth/  │───▶│ Token           │
│ Email Link      │    │ verify?token=   │    │ Validation      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ VALID TOKEN     │    │ INVALID TOKEN   │    │ Show            │
│ → Show Form     │    │ → Error Message │    │ Registration    │
└─────────────────┘    └─────────────────┘    │ Form            │
          │                       │           └─────────────────┘
          ▼                       ▼                       │
┌─────────────────┐    ┌─────────────────┐               │
│ Fill Profile    │    │ Redirect to     │               │
│ Information     │    │ Login           │               │
└─────────┬───────┘    └─────────────────┘               │
          ▼                                               │
┌─────────────────┐    ┌─────────────────┐               │
│ POST /api/auth/ │───▶│ Account         │◀──────────────┘
│ complete-reg    │    │ Activated       │
└─────────────────┘    └─────────────────┘
```

## API Endpoints

### Complete API Reference
```
AUTHENTICATION ENDPOINTS
POST /api/auth/login                 # User login with encrypted password
GET  /api/auth/verify                # Email verification token check
POST /api/auth/complete-registration # Complete user profile setup

USER MANAGEMENT ENDPOINTS  
GET  /api/Users/organization/{orgId} # Get organization users
POST /api/email/invite               # Send user invitation email

IDENTIFIER POOL MANAGEMENT
GET    /api/IdentifierPool           # Get all identifiers for organization
GET    /api/IdentifierPool/stats     # Get pool statistics for dashboard
GET    /api/IdentifierPool/{id}      # Get specific identifier details
POST   /api/IdentifierPool/upload    # Upload Excel file for validation
POST   /api/IdentifierPool/bulk-save # Save validated identifiers
POST   /api/IdentifierPool/assign    # Assign identifier to mattress
DELETE /api/IdentifierPool/{id}      # Remove identifier from pool

MATTRESS MANAGEMENT
GET    /api/mattress                 # Get all mattresses for organization
GET    /api/mattress/{id}            # Get specific mattress details
GET    /api/mattress/{id}/log        # Get mattress activity logs
POST   /api/mattress                 # Create new mattress
PUT    /api/mattress/{id}            # Update mattress information
DELETE /api/mattress/{id}            # Decommission mattress

MATTRESS TYPE MANAGEMENT
GET    /api/mattresstype/display-all-types # Get all mattress types
GET    /api/mattresstype/summaries         # Get type summaries for dropdown
GET    /api/mattresstype/{id}              # Get specific type details
POST   /api/mattresstype                   # Create new mattress type
PUT    /api/mattresstype/{id}              # Update mattress type
DELETE /api/mattresstype/{id}              # Remove mattress type

GROUP TRANSFER SYSTEM
GET    /api/groups                   # Get groups by status and organization
POST   /api/groups/add               # Create new transfer group
POST   /api/groups/mattresses/multiple     # Add mattresses to group
POST   /api/groups/transfer-out/{groupId}  # Initiate transfer
POST   /api/groups/import-mattresses/{id}  # Complete import process
```

## Features

### ✅ Implemented Features (Web Admin Dashboard)

**🔐 Authentication & User Management**
- Multi-role authentication (Admin=0, Manager=1, User=2)
- Organization-based access control
- Email invitation system with role assignment
- Password encryption (SHA256 + Salt + AES)
- JWT token-based session management
- Email verification workflow
- User profile management with profile pictures

**📊 Dashboard & Analytics**
- Real-time mattress statistics
- Organization-specific metrics
- Mattress distribution charts (Recharts)
- Lifecycle timeline visualization
- Pool utilization statistics
- Status breakdown analytics

**🏥 Mattress Management**
- Complete lifecycle tracking (8 status states)
- Mattress CRUD operations
- Status management workflow
- Location tracking integration
- Batch number management
- RFID/EPC code integration
- QR code generation and display

**📋 Identifier Pool Management**
- Excel file bulk import (.xlsx)
- Data validation and error reporting
- Pool statistics dashboard
- QR code generation (base64)
- Assignment tracking
- Organization-scoped pools
- Validation result display

**👥 User Administration**
- Role-based user management
- Email invitation workflow
- User profile completion
- Organization user listing
- Permission-based access control

**🏷️ Mattress Type Management**
- Digital Product Passport (DPP) creation
- Type specifications (dimensions, materials)
- Lifecycle parameters (rotation intervals, lifespan)
- Type-based categorization

**🔍 Guest Access**
- Public mattress lookup interface
- QR/EPC code scanning
- Status verification without authentication

### 🚧 Planned Features
- Advanced reporting and analytics
- Mobile application integration
- IoT device connectivity
- Automated notification system
- Audit logging dashboard
- Data export functionality
- Real-time notifications
- Barcode scanning capabilities

## File Structure

### Complete Project Structure
```
MATCRON/
├── web-app/                    # React Frontend (Web Admin Dashboard)
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/             # Images, icons, static files
│   │   ├── components/         # Reusable UI components
│   │   │   ├── layout/         # Layout components
│   │   │   │   ├── Navbar.js
│   │   │   │   └── Sidebar.js
│   │   │   ├── ui/             # UI primitives
│   │   │   │   └── button.js
│   │   │   ├── MattressLifecycleTimeline.js
│   │   │   └── Snackbar.js
│   │   ├── context/            # React Context providers
│   │   │   ├── AuthContext.js
│   │   │   ├── UserContext.js
│   │   │   └── DBContext.js
│   │   ├── lib/                # Utility libraries
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.js
│   │   │   ├── LandingPage.js
│   │   │   ├── Login.js
│   │   │   ├── ConfirmRegistration.js
│   │   │   ├── Users/
│   │   │   │   ├── UsersPage.js
│   │   │   │   └── InviteUserDialog.js
│   │   │   ├── Mattress/
│   │   │   │   ├── MattressPage.js
│   │   │   │   └── MattressDetailsDrawer.js
│   │   │   ├── MattressType/
│   │   │   │   ├── MattressTypePage.js
│   │   │   │   ├── CreateDPPForm.js
│   │   │   │   └── MattressTypeDetailDrawer.js
│   │   │   ├── Extraction/
│   │   │   │   └── ExtractionPage.js
│   │   │   └── Guest/
│   │   │       └── GuestPage.js
│   │   ├── services/           # API service layer
│   │   │   ├── AuthService.js
│   │   │   ├── UserService.js
│   │   │   ├── MattressService.js
│   │   │   ├── MattressTypeService.js
│   │   │   ├── IdentifierPoolService.js
│   │   │   └── EncryptionService.js
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
│   │   ├── Interfaces/         # Repository contracts
│   │   └── Implementations/    # Repository implementations
│   ├── DTOs/                   # Data transfer objects
│   ├── Entities/               # Database entity models
│   ├── Middlewares/            # Custom middleware
│   ├── Common/                 # Shared utilities
│   └── Services/               # Business logic services
└── README.md                   # Project documentation
```

## Development Setup

### Prerequisites
- **Node.js 18+**: Frontend development environment
- **.NET 6.0+**: Backend development framework
- **MySQL 8.0**: Database server
- **Docker**: Optional containerization

### Frontend Setup (Web Admin Dashboard)
```bash
# Navigate to frontend directory
cd web-app

# Install dependencies
npm install

# Start development server
npm start                       # Runs on http://localhost:3000

# Available scripts
npm run build                   # Production build
npm run test                    # Run test suite
npm run eject                   # Eject from Create React App
```

### Backend Setup
```bash
# Navigate to backend directory
cd Backend

# Restore NuGet packages
dotnet restore

# Run development server
dotnet run                      # Runs on http://localhost:5225

# Available commands
dotnet build                    # Build project
dotnet test                     # Run tests
dotnet publish                  # Create deployment package
```

### Environment Configuration

#### Frontend Environment (.env)
```env
REACT_APP_API_URL=http://localhost:5225
REACT_APP_APP_NAME=MATCRON
REACT_APP_VERSION=2.0.0
```

#### Backend Configuration (appsettings.json)
```json
{
  "ConnectionStrings": {
    "MySQLConnection": "Server=localhost;Database=matcron_db;User Id=root;Password=password;"
  },
  "Jwt": {
    "Key": "your-secret-key-here",
    "Issuer": "Matcron.online",
    "Audience": "Matcron.online"
  },
  "SendGrid": {
    "ApiKey": "your-sendgrid-api-key",
    "FromEmail": "noreply@matcron.com",
    "FromName": "MatCron Team"
  }
}
```

### Docker Setup
```bash
# Build and run frontend container
cd web-app
docker build -t matcron-frontend .
docker run -p 3000:3000 matcron-frontend

# Build and run backend container (when Dockerfile available)
cd Backend
docker build -t matcron-backend .
docker run -p 5225:5225 matcron-backend
```

## Troubleshooting Guide

### 🔧 Common Authentication Issues

**1. Token Expired Errors**
```
SYMPTOMS: User redirected to login unexpectedly
SOLUTION: Check browser console for token expiration logs
DEBUG: localStorage.getItem('token') → verify expiration
FIX: Implement token refresh or extend expiration time
```

**2. Password Encryption Mismatch**
```
SYMPTOMS: Login fails with correct credentials
SOLUTION: Verify encryption service is working correctly
DEBUG: Console.log encrypted password before API call
FIX: Ensure frontend encryption matches backend decryption
```

**3. CORS Configuration Issues**
```
SYMPTOMS: API calls blocked by browser
SOLUTION: Configure backend CORS policy
DEBUG: Check browser network tab for preflight requests
FIX: Add frontend URL to allowed origins in backend
```

### 📊 Common Dashboard Issues

**1. Statistics Not Loading**
```
SYMPTOMS: Dashboard shows loading or empty state
SOLUTION: Check API endpoints are responding
DEBUG: Network tab → verify /api/IdentifierPool/stats calls
FIX: Ensure user has proper organization permissions
```

**2. Charts Not Rendering**
```
SYMPTOMS: Recharts components not displaying
SOLUTION: Verify data format matches chart requirements
DEBUG: Console.log chart data before rendering
FIX: Transform API data to match Recharts format
```

### 📁 File Upload Issues

**1. Excel Import Failures**
```
SYMPTOMS: File upload returns validation errors
SOLUTION: Check Excel file format and structure
DEBUG: Verify Content-Type headers in network tab
FIX: Ensure .xlsx format with correct column headers
```

**2. Large File Timeouts**
```
SYMPTOMS: Upload fails on large Excel files
SOLUTION: Increase request timeout limits
DEBUG: Check network tab for timeout status
FIX: Configure axios timeout or split large files
```

### 🚀 Performance Issues

**1. Slow Page Loading**
```
SYMPTOMS: Long initial page load times
SOLUTION: Implement code splitting and lazy loading
DEBUG: Chrome DevTools → Performance tab
FIX: Use React.lazy() for route-based splitting
```

**2. Memory Leaks**
```
SYMPTOMS: Browser becomes slow over time
SOLUTION: Check for memory leaks in components
DEBUG: Chrome DevTools → Memory tab
FIX: Cleanup useEffect subscriptions and intervals
```

### 🔍 Development Debug Tips

**1. Enable Verbose Logging**
```javascript
// Add to localStorage for debug mode
localStorage.setItem('debug', 'true');

// Check console for detailed authentication logs
// All AuthContext operations will be logged
```

**2. API Response Monitoring**
```javascript
// Monitor all API calls in browser console
// Check for 401/403/500 error responses
// Verify request/response data format
```

**3. State Management Issues**
```javascript
// Use React DevTools to inspect context state
// Verify AuthContext, UserContext, DBContext values
// Check component re-render cycles
```

---

**Document Version**: 3.0  
**Last Updated**: January 2025  
**Maintained By**: MatCron Development Team  
**Coverage**: Complete Web Admin Dashboard + Backend API + Mobile Planning

---

## Deployment Architecture

### Production Environment Setup
```
┌─────────────────────────────────────────────────────────────┐
│                   PRODUCTION INFRASTRUCTURE                 │
├─────────────────┬─────────────────┬─────────────────────────┤
│  Load Balancer  │  Web Servers    │    Database Cluster     │
│                 │                 │                         │
│ • NGINX/HAProxy │ • Multiple      │ • MySQL Master/Slave   │
│ • SSL Termination│   .NET Cores   │ • Read/Write Split      │
│ • Rate Limiting │ • Auto Scaling  │ • Backup Automation     │
└─────────────────┴─────────────────┴─────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   CONTAINER ORCHESTRATION                   │
├─────────────────┬─────────────────┬─────────────────────────┤
│   Docker Swarm  │   Kubernetes    │    Service Mesh         │
│   or            │   Alternative   │                         │
│   • Compose     │ • Pods & Deploy │ • Internal Comms        │
│   • Networks    │ • ConfigMaps    │ • Traffic Management    │
│   • Volumes     │ • Secrets       │ • Security Policies     │
└─────────────────┴─────────────────┴─────────────────────────┘
```

### Environment Configuration
```
ENVIRONMENTS
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  DEVELOPMENT    │───▶│    STAGING      │───▶│   PRODUCTION    │
│                 │    │                 │    │                 │
│ • Local Docker  │    │ • Pre-prod      │    │ • Live System   │
│ • Hot Reload    │    │ • Full Testing  │    │ • High Avail    │
│ • Debug Mode    │    │ • Performance   │    │ • Monitoring    │
└─────────────────┘    └─────────────────┘    └─────────────────┘

DEPLOYMENT STRATEGIES
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Blue/Green     │    │  Rolling Update │    │ Canary Deploy   │
│                 │    │                 │    │                 │
│ • Zero Downtime │    │ • Gradual       │    │ • Risk Mitigation│
│ • Quick Rollback│    │ • Health Checks │    │ • A/B Testing   │
│ • Resource Heavy│    │ • Progressive   │    │ • Gradual Rollout│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Infrastructure as Code
```yaml
# docker-compose.production.yml
version: '3.8'
services:
  web-app:
    image: matcron/frontend:latest
    ports:
      - "80:80"
      - "443:443"
    environment:
      - NODE_ENV=production
    volumes:
      - ./ssl:/etc/nginx/ssl
  
  api:
    image: matcron/backend:latest
    ports:
      - "5225:5225"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__MySQLConnection=${DB_CONNECTION}
    depends_on:
      - database
  
  database:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: matcron_production
    volumes:
      - mysql_data:/var/lib/mysql
      - ./backup:/backup
```

## CI/CD Pipeline

### Complete Pipeline Flow
```
┌─────────────────────────────────────────────────────────────┐
│                   CI/CD PIPELINE STAGES                     │
├─────────────────┬─────────────────┬─────────────────────────┤
│  SOURCE CONTROL │   BUILD STAGE   │    DEPLOYMENT STAGE     │
│                 │                 │                         │
│ • Git Push      │ • Code Build    │ • Environment Deploy   │
│ • PR Creation   │ • Tests Run     │ • Health Checks        │
│ • Branch Rules  │ • Security Scan │ • Rollback Capability  │
└─────────────────┴─────────────────┴─────────────────────────┘

DETAILED PIPELINE
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ 1. CODE COMMIT  │───▶│ 2. AUTOMATED    │───▶│ 3. BUILD &      │
│                 │    │    TESTING      │    │    PACKAGE     │
│ • Git Push      │    │ • Unit Tests    │    │ • Docker Build  │
│ • Webhook       │    │ • Integration   │    │ • Image Tag     │
│ • Trigger Build │    │ • Security Scan │    │ • Artifact Store│
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ 4. STAGING      │───▶│ 5. TESTING      │───▶│ 6. PRODUCTION   │
│    DEPLOY       │    │    VALIDATION   │    │    DEPLOYMENT   │
│ • Auto Deploy  │    │ • E2E Tests     │    │ • Manual/Auto   │
│ • Smoke Tests   │    │ • Performance   │    │ • Blue/Green    │
│ • Integration   │    │ • User Accept   │    │ • Health Monitor│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### GitHub Actions Workflow
```yaml
# .github/workflows/ci-cd.yml
name: MatCron CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd web-app && npm ci
      - name: Run tests
        run: cd web-app && npm test -- --coverage
      - name: Run security audit
        run: cd web-app && npm audit --audit-level high

  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '6.0.x'
      - name: Restore dependencies
        run: cd Backend && dotnet restore
      - name: Build
        run: cd Backend && dotnet build --no-restore
      - name: Test
        run: cd Backend && dotnet test --no-build --verbosity normal

  build-and-deploy:
    needs: [test-frontend, test-backend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Build Docker Images
        run: |
          docker build -t matcron/frontend:${{ github.sha }} ./web-app
          docker build -t matcron/backend:${{ github.sha }} ./Backend
      - name: Deploy to Staging
        run: |
          echo "Deploy to staging environment"
          # Deployment scripts here
```

## Performance & Scalability

### Performance Optimization Strategy
```
┌─────────────────────────────────────────────────────────────┐
│                  PERFORMANCE LAYERS                         │
├─────────────────┬─────────────────┬─────────────────────────┤
│   FRONTEND      │    BACKEND      │      DATABASE           │
│   OPTIMIZATION  │   OPTIMIZATION  │     OPTIMIZATION        │
└─────────┬───────┴─────────┬───────┴─────────┬───────────────┘
          ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ • Code Splitting│ │ • Connection    │ │ • Query         │
│ • Lazy Loading  │ │   Pooling       │ │   Optimization  │
│ • Caching       │ │ • Response      │ │ • Indexing      │
│ • Image Optimize│ │   Compression   │ │ • Partitioning  │
│ • Bundle Size   │ │ • Async Ops     │ │ • Read Replicas │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Scalability Architecture
```
HORIZONTAL SCALING
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Load Balancer  │───▶│ Multiple API    │───▶│ Database        │
│                 │    │ Instances       │    │ Clustering      │
│ • Round Robin   │    │ • Auto Scaling  │    │ • Master/Slave  │
│ • Health Checks │    │ • Stateless     │    │ • Sharding      │
│ • SSL Term      │    │ • Session Store │    │ • Connection    │
└─────────────────┘    └─────────────────┘    │   Pooling       │
                                              └─────────────────┘

VERTICAL SCALING
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Resource        │───▶│ Performance     │───▶│ Monitoring      │
│ Optimization    │    │ Tuning          │    │ & Alerts        │
│ • CPU/Memory    │    │ • Query Opt     │    │ • Metrics       │
│ • Storage SSD   │    │ • Cache Layer   │    │ • Thresholds    │
│ • Network       │    │ • CDN Usage     │    │ • Auto Scale    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Caching Strategy
```
MULTI-LEVEL CACHING
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  BROWSER CACHE  │───▶│   CDN CACHE     │───▶│ APPLICATION     │
│                 │    │                 │    │ CACHE           │
│ • Static Assets │    │ • Global Assets │    │ • Redis/Memory  │
│ • API Responses │    │ • Geographic    │    │ • Database      │
│ • localStorage  │    │   Distribution  │    │   Query Cache   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    CACHE INVALIDATION                       │
├─────────────────┬─────────────────┬─────────────────────────┤
│ Time-based      │ Event-based     │ Manual                  │
│ (TTL/Expiry)    │ (Data Changes)  │ (Admin Control)         │
└─────────────────┴─────────────────┴─────────────────────────┘
```

## Monitoring & Observability

### Comprehensive Monitoring Stack
```
┌─────────────────────────────────────────────────────────────┐
│                   OBSERVABILITY PYRAMID                     │
├─────────────────┬─────────────────┬─────────────────────────┤
│     METRICS     │      LOGS       │       TRACES            │
│                 │                 │                         │
│ • System Stats  │ • Application   │ • Request Flow          │
│ • Business KPIs │ • Error Logs    │ • Performance           │
│ • Performance   │ • Audit Trails  │ • Dependencies          │
└─────────────────┴─────────────────┴─────────────────────────┘

MONITORING TOOLS INTEGRATION
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PROMETHEUS    │───▶│    GRAFANA      │───▶│   ALERTMANAGER  │
│                 │    │                 │    │                 │
│ • Metrics       │    │ • Dashboards    │    │ • Notifications │
│ • Time Series   │    │ • Visualization │    │ • Escalation    │
│ • Scraping      │    │ • Analysis      │    │ • Integration   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ELK STACK     │    │   JAEGER        │    │ HEALTH CHECKS   │
│                 │    │                 │    │                 │
│ • Elasticsearch │    │ • Distributed   │    │ • Endpoint      │
│ • Logstash      │    │   Tracing       │    │   Monitoring    │
│ • Kibana        │    │ • Performance   │    │ • Service       │
└─────────────────┘    └─────────────────┘    │   Discovery     │
                                              └─────────────────┘
```

### Key Metrics to Monitor
```yaml
# monitoring/metrics.yml
application_metrics:
  performance:
    - api_response_time
    - database_query_time
    - memory_usage
    - cpu_utilization
  
  business:
    - active_users
    - mattress_operations_per_hour
    - organization_growth
    - feature_usage_stats
  
  reliability:
    - error_rate
    - uptime_percentage
    - failed_requests
    - service_availability

infrastructure_metrics:
  server:
    - disk_usage
    - network_io
    - connection_pool_status
  
  database:
    - query_performance
    - connection_count
    - replication_lag
    - storage_growth
```

## Testing Strategy

### Multi-Level Testing Pyramid
```
┌─────────────────────────────────────────────────────────────┐
│                    TESTING PYRAMID                          │
├─────────────────┬─────────────────┬─────────────────────────┤
│      E2E        │  INTEGRATION    │      UNIT               │
│   (Few Tests)   │ (Some Tests)    │   (Many Tests)          │
└─────────┬───────┴─────────┬───────┴─────────┬───────────────┘
          ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ • User Journeys │ │ • API Testing   │ │ • Component     │
│ • UI Testing    │ │ • Service Layer │ │   Testing       │
│ • Browser Auto  │ │ • Database      │ │ • Function      │
│ • Cross-device  │ │   Integration   │ │   Testing       │
└─────────────────┘ └─────────────────┘ └─────────────────┘

TESTING TYPES BY LAYER
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │    BACKEND      │    │   DATABASE      │
│   TESTING       │    │    TESTING      │    │   TESTING       │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ • Jest/RTL      │    │ • xUnit/NUnit   │    │ • Migration     │
│ • Cypress       │    │ • Integration   │    │   Tests         │
│ • Playwright    │    │ • Repository    │    │ • Data          │
│ • Storybook     │    │   Tests         │    │   Integrity     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Test Automation Strategy
```javascript
// Frontend Testing Structure
describe('MatCron Application Tests', () => {
  describe('Unit Tests', () => {
    // Component testing
    // Service testing
    // Utility function testing
  });
  
  describe('Integration Tests', () => {
    // API integration
    // Context providers
    // Route testing
  });
  
  describe('E2E Tests', () => {
    // User workflows
    // Cross-browser testing
    // Performance testing
  });
});

// Backend Testing Structure
[TestClass]
public class MattressControllerTests
{
    [Test]
    public async Task GetMattresses_ReturnsOrgMattresses() 
    {
        // Arrange
        // Act  
        // Assert
    }
}
```

## Data Management & Backup

### Backup Strategy
```
┌─────────────────────────────────────────────────────────────┐
│                   BACKUP ARCHITECTURE                       │
├─────────────────┬─────────────────┬─────────────────────────┤
│  AUTOMATED      │   INCREMENTAL   │      DISASTER           │
│  DAILY BACKUP   │   HOURLY        │      RECOVERY           │
└─────────┬───────┴─────────┬───────┴─────────┬───────────────┘
          ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ • Full DB Dump  │ │ • Transaction   │ │ • Geo-redundant │
│ • File Storage  │ │   Log Backup    │ │   Storage       │
│ • Config Files  │ │ • Change Delta  │ │ • RTO: 1 hour   │
│ • Retention:    │ │ • Point-in-time │ │ • RPO: 15 min   │
│   30 days       │ │   Recovery      │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘

BACKUP SCHEDULE
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    HOURLY       │───▶│     DAILY       │───▶│    WEEKLY       │
│                 │    │                 │    │                 │
│ • Transaction   │    │ • Full Database │    │ • Archive       │
│   Logs          │    │ • Application   │    │ • Long-term     │
│ • Change Delta  │    │   Files         │    │   Retention     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Retention Policy
```yaml
# data-retention-policy.yml
retention_policies:
  user_data:
    active_users: "indefinite"
    inactive_users: "2_years"
    deleted_users: "30_days_then_purge"
  
  mattress_data:
    active_mattresses: "indefinite"
    decommissioned: "7_years"
    transferred: "5_years"
  
  audit_logs:
    security_events: "7_years"
    user_actions: "3_years"
    system_logs: "1_year"
  
  backups:
    daily_backups: "30_days"
    weekly_backups: "12_weeks"
    monthly_backups: "12_months"
    yearly_backups: "7_years"
```

## Mobile Architecture (Detailed)

### Mobile Application Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                   MOBILE APP ARCHITECTURE                   │
├─────────────────┬─────────────────┬─────────────────────────┤
│   PRESENTATION  │   BUSINESS      │      DATA               │
│                 │                 │                         │
│ • React Native  │ • Redux/Zustand │ • SQLite Local          │
│ • Navigation    │ • Middleware    │ • API Client            │
│ • Components    │ • Services      │ • Offline Queue         │
└─────────────────┴─────────────────┴─────────────────────────┘

OFFLINE-FIRST STRATEGY
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  LOCAL STORAGE  │───▶│ SYNC MECHANISM  │───▶│ CONFLICT        │
│                 │    │                 │    │ RESOLUTION      │
│ • SQLite DB     │    │ • Delta Sync    │    │ • Timestamp     │
│ • Cache Layer   │    │ • Background    │    │ • Server Wins   │
│ • Queue Ops     │    │ • Retry Logic   │    │ • User Choice   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Push Notification System
```
NOTIFICATION FLOW
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Backend Event   │───▶│ Push Service    │───▶│ Mobile Device   │
│                 │    │ (FCM/APNS)      │    │                 │
│ • Status Change │    │ • Message Queue │    │ • Notification  │
│ • Assignment    │    │ • Delivery      │    │ • Badge Update  │
│ • Transfer      │    │ • Analytics     │    │ • Sound/Vibrate │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Integration Architecture

### External Service Integration
```
┌─────────────────────────────────────────────────────────────┐
│                   INTEGRATION LAYER                         │
├─────────────────┬─────────────────┬─────────────────────────┤
│   EMAIL         │     IoT         │    THIRD-PARTY          │
│   SERVICES      │   DEVICES       │    APIS                 │
└─────────┬───────┴─────────┬───────┴─────────┬───────────────┘
          ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ • SendGrid      │ │ • RFID Readers  │ │ • Healthcare    │
│ • SMTP Backup   │ │ • QR Scanners   │ │   Systems       │
│ • Template Mgmt │ │ • Location      │ │ • ERP Systems   │
│ • Analytics     │ │   Beacons       │ │ • Reporting     │
└─────────────────┘ └─────────────────┘ └─────────────────┘

API GATEWAY PATTERN
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CLIENTS       │───▶│   API GATEWAY   │───▶│   SERVICES      │
│                 │    │                 │    │                 │
│ • Web App       │    │ • Authentication│    │ • MatCron API   │
│ • Mobile App    │    │ • Rate Limiting │    │ • Email Service │
│ • IoT Devices   │    │ • Load Balancing│    │ • Notification  │
│ • Third-party   │    │ • Monitoring    │    │ • External APIs │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Compliance & Governance

### Data Privacy & Security Compliance
```
┌─────────────────────────────────────────────────────────────┐
│                  COMPLIANCE FRAMEWORK                       │
├─────────────────┬─────────────────┬─────────────────────────┤
│     GDPR        │    HIPAA        │      SOC 2              │
│   (if EU users) │ (Healthcare)    │   (Security)            │
└─────────┬───────┴─────────┬───────┴─────────┬───────────────┘
          ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ • Right to      │ │ • PHI Protection│ │ • Security      │
│   be Forgotten  │ │ • Access        │ │   Controls      │
│ • Data          │ │   Controls      │ │ • Audit Logs    │
│   Portability   │ │ • Audit Trails  │ │ • Monitoring    │
│ • Consent Mgmt  │ │ • Encryption    │ │ • Incident Resp │
└─────────────────┘ └─────────────────┘ └─────────────────┘

AUDIT & COMPLIANCE MONITORING
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Automated       │───▶│ Manual          │───▶│ Compliance      │
│ Compliance      │    │ Reviews         │    │ Reporting       │
│ Checks          │    │                 │    │                 │
│ • Data Access   │    │ • Security      │    │ • Quarterly     │
│ • Retention     │    │   Assessment    │    │ • Annual        │
│ • Encryption    │    │ • Code Review   │    │ • Certification │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Disaster Recovery Plan

### Business Continuity Strategy
```
┌─────────────────────────────────────────────────────────────┐
│                  DISASTER RECOVERY TIERS                    │
├─────────────────┬─────────────────┬─────────────────────────┤
│   TIER 1        │    TIER 2       │      TIER 3             │
│  (Critical)     │  (Important)    │   (Standard)            │
└─────────┬───────┴─────────┬───────┴─────────┬───────────────┘
          ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ • RTO: 1 hour   │ │ • RTO: 4 hours  │ │ • RTO: 24 hours │
│ • RPO: 15 min   │ │ • RPO: 1 hour   │ │ • RPO: 8 hours  │
│ • Auth System   │ │ • Main App      │ │ • Reporting     │
│ • Core API      │ │ • Dashboard     │ │ • Analytics     │
└─────────────────┘ └─────────────────┘ └─────────────────┘

RECOVERY PROCEDURES
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ 1. DETECTION    │───▶│ 2. ASSESSMENT   │───▶│ 3. RESPONSE     │
│                 │    │                 │    │                 │
│ • Monitoring    │    │ • Impact        │    │ • Failover      │
│ • Alerts        │    │ • Recovery Time │    │ • Communication │
│ • Escalation    │    │ • Resources     │    │ • Restoration   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## API Documentation Standards

### OpenAPI/Swagger Specification
```yaml
# swagger-config.yml
openapi: 3.0.0
info:
  title: MatCron API
  version: 2.0.0
  description: Comprehensive mattress management system API
  
security:
  - bearerAuth: []

paths:
  /api/auth/login:
    post:
      tags: [Authentication]
      summary: User login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
      responses:
        200:
          description: Login successful
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
```

### API Design Standards
```
RESTful API CONVENTIONS
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   RESOURCE      │    │   HTTP METHOD   │    │   STATUS CODE   │
│   NAMING        │    │   USAGE         │    │   STANDARDS     │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ • Plural Nouns  │    │ • GET (Read)    │    │ • 200 Success  │
│ • Snake Case    │    │ • POST (Create) │    │ • 201 Created  │
│ • Hierarchical  │    │ • PUT (Update)  │    │ • 400 Bad Req  │
│ • Versioned     │    │ • DELETE (Del)  │    │ • 401 Unauth   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Version Control Strategy

### Git Workflow & Branching Strategy
```
┌─────────────────────────────────────────────────────────────┐
│                    GIT FLOW STRATEGY                        │
├─────────────────┬─────────────────┬─────────────────────────┤
│     MAIN        │    DEVELOP      │     FEATURE             │
│   (Production)  │   (Integration) │    (Development)        │
└─────────┬───────┴─────────┬───────┴─────────┬───────────────┘
          ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ • Stable Code   │ │ • Integration   │ │ • Feature Work  │
│ • Tagged        │ │ • Testing       │ │ • Experiments   │
│ • Releases      │ │ • Staging       │ │ • Bug Fixes     │
│ • Hotfixes      │ │ • Pre-prod      │ │ • Prototypes    │
└─────────────────┘ └─────────────────┘ └─────────────────┘

BRANCH PROTECTION RULES
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ MAIN BRANCH     │    │ DEVELOP BRANCH  │    │ FEATURE BRANCH  │
│                 │    │                 │    │                 │
│ • Require PR    │    │ • Require PR    │    │ • Regular       │
│ • Review Req    │    │ • CI Pass       │    │   Commits       │
│ • CI Must Pass  │    │ • 1+ Approvals  │    │ • Descriptive   │
│ • No Direct     │    │ • Up-to-date    │    │   Names         │
│   Commits       │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Release Management
```yaml
# release-process.yml
release_cycle:
  major_releases: "quarterly"
  minor_releases: "monthly" 
  patch_releases: "as_needed"
  
versioning_scheme: "semantic_versioning"
  # MAJOR.MINOR.PATCH (2.1.3)
  
release_process:
  1. "feature_freeze"
  2. "testing_period"
  3. "release_candidate"
  4. "production_deployment"
  5. "post_release_monitoring"
```

---

**Document Version**: 4.0  
**Last Updated**: January 2025  
**Maintained By**: MatCron Development Team  
**Coverage**: Complete Enterprise-Grade System Architecture Documentation