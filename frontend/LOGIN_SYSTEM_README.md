# Login System User Guide

## Overview

Based on the Notifications component design in Header.tsx, we have built a complete user authentication system.

## Main Features

### 1. User Authentication Context (`AuthContext.tsx`)
- Provides global user state management
- Supports login and logout functionality
- Automatically checks authentication status in local storage
- Provides loading state management

### 2. User Menu Component (`UserMenu.tsx`)
- Based on the design style of the original Notifications component
- Shows login/register buttons when not logged in
- Shows user avatar and dropdown menu when logged in
- Contains user information, settings options, and logout functionality

### 3. Login Page (`SignIn.tsx`)
- Localized login form
- Form validation and error handling
- Auto-redirect to main page
- Loading state display

### 4. Registration Page (`SignUp.tsx`)
- Localized registration form
- Password confirmation validation
- Terms of service agreement check
- Auto-login functionality

### 5. Route Protection (`ProtectedRoute.tsx`)
- Protects pages that require authentication
- Auto-redirects unauthenticated users to login page
- Loading state handling

## Usage

### 1. Access Login Page
- Directly visit `/signin` to enter login page
- Or click the "Login" button in the Header

### 2. Register New Account
- Visit `/signup` to enter registration page
- Or click "Create New Account" from the login page

### 3. Test Authentication System
- After login, visit `/pages/auth-test` to view authentication status
- Can view current user information and system status

### 4. Logout
- Click the "Logout" option in the user avatar dropdown menu

## Technical Features

1. **Based on Existing Design**: Completely based on the design style of the Notifications component in Header.tsx
2. **Responsive Design**: Supports desktop and mobile devices
3. **Localization**: All interface text has been localized
4. **State Management**: Uses React Context for global state management
5. **Local Storage**: Supports remembering login status
6. **Route Protection**: Automatically protects pages that require authentication

## Current Implementation

- ✅ User Authentication Context
- ✅ Login/Registration Pages
- ✅ User Menu Component
- ✅ Route Protection
- ✅ Local State Persistence
- ✅ Test Page
- ✅ **Dual-Mode Authentication System** (Mock + Real API)
- ✅ Backend API Integration
- ✅ JWT Token Verification

## Future Extensions

1. **Backend Integration**: Connect to actual authentication API
2. **Password Reset**: Implement forgot password functionality
3. **User Profile Management**: Personal profile editing page
4. **Permission Management**: Role-based access control
5. **Social Login**: Support third-party login (Google, Facebook, etc.)

## Dual-Mode Authentication System

### 🔄 Mode Switching
The system supports two authentication modes, switchable at the top of login/registration pages:

1. **Mock Mode** (Default)
   - Any username and password can login
   - Suitable for development and testing
   - No backend service required

2. **API Mode**
   - Connects to real backend API
   - Requires valid user accounts
   - Supports real registration and login

### 🔧 Backend API Endpoints

- `POST /login` - User login
- `POST /users` - User registration
- `GET /verify-token` - Token verification

### 🛠️ Technical Implementation

- **Password Security**: Uses bcrypt hashing
- **Token Management**: JWT Token authentication
- **State Persistence**: localStorage storage
- **Error Handling**: Complete error messaging

## Notes

- Uses mock mode by default, suitable for rapid development testing
- API mode requires backend service running at the address configured in `VITE_API_BASE_URL`
- User data is stored in browser's localStorage
- Production environment recommends using API mode with appropriate security measures