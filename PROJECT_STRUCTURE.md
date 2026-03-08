# SMS Gateway Project Structure

## Overview

Clean, organized codebase with separate dashboards and sidebars for ADMIN and USER roles.

---

## 📁 Directory Structure

### Frontend (`osms/src`)

```
src/
├── app/
│   ├── (auth)/                    # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboardLayout)/         # Protected dashboard routes
│   │   ├── admin/                 # ADMIN role routes
│   │   │   ├── overview/          # Admin Dashboard
│   │   │   ├── packages/          # Package Management
│   │   │   └── users/             # User Management
│   │   ├── user/                  # USER role routes
│   │   │   ├── overview/          # User Dashboard
│   │   │   └── packages/          # User Packages
│   │   ├── profile/               # Shared Profile (both roles)
│   │   └── api-docs/              # Shared API Docs (both roles)
│   └── layout.tsx                 # Dashboard layout wrapper
│
├── components/
│   ├── admin/                     # ADMIN-only components
│   │   ├── packages/
│   │   │   └── PackagesManager.tsx
│   │   └── users/
│   │       └── UsersManager.tsx
│   ├── user/                      # USER-only components
│   │   └── packages/
│   │       └── UserPackagesPage.tsx
│   ├── dashboard/                 # Dashboard components
│   │   ├── AdminDashboard.tsx
│   │   └── UserDashboard.tsx
│   ├── profile/
│   │   └── ProfilePage.tsx
│   ├── pages/
│   │   └── APIDocumentation.tsx
│   └── auth/                      # Auth components
│       ├── adminLogin/
│       └── register/
│
├── sidebar/
│   ├── sidebar.config.ts          # Sidebar configuration (organized by role)
│   ├── DashboardSidebar.tsx       # Sidebar component
│   ├── DashboardHeader.tsx        # Header component
│   └── sidebar.types.ts
│
├── services/
│   └── api.ts                     # API service (auth, packages, users, messaging)
│
└── types/
    └── user.role.ts               # Role types: ADMIN | USER
```

---

## 🔐 Role-Based Access

### ADMIN Role

**Sidebar Items:**

- Dashboard → `/admin/overview`
- Packages → `/admin/packages` (Create, Read, Update, Delete)
- Users → `/admin/users` (Manage all users)
- Profile → `/profile`
- API Documentation → `/api-docs`
- Messaging (submenu)
- Phonebook (submenu)
- Templates
- Blacklist
- Chat Box
- Reports (submenu)
- Developer/API (submenu)

**Permissions:**

- Create/Edit/Delete packages
- Manage all users
- View all reports
- Access admin features

### USER Role

**Sidebar Items:**

- Dashboard → `/user/overview`
- Packages → `/user/packages` (View only, select packages)
- Profile → `/profile`
- API Documentation → `/api-docs`
- Phonebook (submenu)
- Reports (submenu)
- Developer/API (submenu)

**Permissions:**

- View available packages
- Select packages for SMS sending
- Get package tokens
- View own profile
- Access API documentation

---

## 🎯 Key Components

### Dashboards

- **AdminDashboard** (`components/dashboard/AdminDashboard.tsx`)
  - Stats cards
  - Recent activity
  - Management options

- **UserDashboard** (`components/dashboard/UserDashboard.tsx`)
  - Package selection
  - Package details
  - Token display
  - Usage guide

### Package Management

- **Admin**: `components/admin/packages/PackagesManager.tsx`
  - Full CRUD operations
  - Create new packages
  - Edit existing packages
  - Delete packages
  - Toggle status

- **User**: `components/user/packages/UserPackagesPage.tsx`
  - View available packages
  - Select packages
  - Copy package tokens
  - View package details

### Shared Components

- **ProfilePage** (`components/profile/ProfilePage.tsx`)
  - User information
  - Account details
  - Logout button

- **APIDocumentation** (`components/pages/APIDocumentation.tsx`)
  - Tabbed code examples
  - Full API reference
  - Interactive testing

---

## 🔄 Sidebar Configuration

**File:** `sidebar/sidebar.config.ts`

```typescript
// Organized by role with clear comments
SIDEBAR_CONFIG = [
  // ============================================
  // ADMIN PANEL - For ADMIN users
  // ============================================
  { title: "Admin Panel", roles: ["ADMIN"], items: [...] },

  // ============================================
  // USER PANEL - For USER users
  // ============================================
  { title: "User Panel", roles: ["USER"], items: [...] }
]
```

---

## 🛡️ Middleware & Authentication

**File:** `middleware.ts`

```typescript
// Route protection by role
- /admin/* → ADMIN only
- /user/* → USER only
- /profile → Both roles
- /api-docs → Both roles
```

**File:** `lib/dummyAuth.ts`

```typescript
// Current test user
DUMMY_USER = {
  email: "test@example.com",
  role: "USER", // Change to "ADMIN" to test admin features
};
```

---

## 📡 Backend Structure

### Routes

- `/api/auth/` - Authentication
- `/api/packages/` - Package management (ADMIN only)
- `/api/users/` - User management (ADMIN only)
- `/api/messaging/` - SMS sending (ADMIN & USER)

### Models

- **User** - User data with role
- **Package** - SMS packages with token

### Services

- **AuthService** - Login, register, token generation
- **PackageService** - Package CRUD operations
- **MessagingService** - SMS sending via external API

---

## 🚀 How to Switch Roles

Edit `osms/src/lib/dummyAuth.ts`:

```typescript
// For ADMIN testing
export const DUMMY_USER = {
  email: "test@example.com",
  role: "ADMIN" as UserRole,
};

// For USER testing
export const DUMMY_USER = {
  email: "test@example.com",
  role: "USER" as UserRole,
};
```

Then refresh the page to see the appropriate sidebar and dashboard.

---

## 📝 Code Organization Principles

1. **Separation by Role**
   - Admin components in `components/admin/`
   - User components in `components/user/`
   - Shared components in `components/`

2. **Clear Naming**
   - `AdminDashboard.tsx` vs `UserDashboard.tsx`
   - `PackagesManager.tsx` (admin) vs `UserPackagesPage.tsx` (user)

3. **Organized Sidebar Config**
   - Comments separating ADMIN and USER sections
   - Easy to add/remove menu items per role

4. **Consistent Routing**
   - `/admin/*` for admin routes
   - `/user/*` for user routes
   - `/profile` and `/api-docs` for shared routes

5. **Easy to Extend**
   - Add new admin features in `components/admin/`
   - Add new user features in `components/user/`
   - Update sidebar config for new menu items

---

## ✅ Current Features

- ✅ Role-based authentication (ADMIN & USER)
- ✅ Separate dashboards per role
- ✅ Organized sidebar with role-specific items
- ✅ Package management (admin only)
- ✅ User management (admin only)
- ✅ Package selection (user only)
- ✅ Shared profile page
- ✅ Shared API documentation
- ✅ Clean, readable code structure
