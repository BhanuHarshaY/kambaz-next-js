# Kambaz - Learning Management System

A full-stack Learning Management System inspired by Canvas, built with **Next.js**, **React**, **Node.js**, **Express**, and **MongoDB Atlas**. Kambaz provides a complete academic platform for course management, assignments, quizzes, enrollments, and user administration across four distinct user roles.

---

## Project Metrics

| Category | Count |
|---|---|
| React Components | 40+ |
| RESTful API Endpoints | 43 |
| MongoDB Collections | 7 |
| API Resource Categories | 8 |
| User Roles | 4 (Faculty, TA, Student, Admin) |
| Course Sections | 8 |
| Quiz Question Types | 3 (Multiple Choice, True/False, Fill-in-the-Blank) |

---

## Features

### Authentication and User Management
- Session-based authentication with HttpOnly cookies
- Role-based access control dynamically renders UI elements and restricts API access per role
- Profile management with editable user details
- Sign in, sign up, and sign out flows

### Dashboard
- Displays all published courses with cover images, descriptions, and quick navigation
- Course enrollment and unenrollment for students
- Course creation and deletion for faculty

### Course Management
- Full CRUD operations for courses, modules, and assignments
- Nested module and lesson architecture with drag-and-drop style organization
- Module controls, including publish/unpublish and collapse/expand
- Breadcrumb navigation across course sections

### Assignments
- Assignment creation with configurable points, due dates, availability windows, and submission types
- Support for multiple submission options (text entry, website URL, media recordings, file upload, student annotation)
- Assignment group management with weighted grading
- Search and filter functionality

### Quiz Module
- Three question types: Multiple Choice, True/False, Fill-in-the-Blank
- Countdown timer with auto-submission on expiry
- Access code validation for restricted quizzes
- Auto-save during quiz attempts
- Automated scoring with real-time state management using Redux
- Centralized submission logic through useRef-based handler to prevent duplicate submissions during timed assessments

### People and Enrollments
- Enrollment management linking users to courses
- People table displaying enrolled users with role, section, login ID, and activity metrics
- Filtering by course context

### State Management
- Redux store with dedicated reducers for each feature domain
- React state management demonstrations including string, boolean, date, object, and array state variables
- Parent-child state communication patterns
- Todo list implementation with full CRUD using Redux Toolkit

---

## Tech Stack

### Frontend
- **Next.js** with TypeScript and App Router
- **React Bootstrap** for UI components
- **Redux Toolkit** for global state management
- **Axios** for API communication with credential handling
- **React Icons** for iconography
- **Vercel** for production deployment

### Backend
- **Node.js** with Express
- **Mongoose** for MongoDB schema validation and queries
- **Express Session** for authentication
- **CORS** configured for cross-origin cookie support
- **Render** for production deployment

### Database
- **MongoDB Atlas** with 7 collections
- Embedded document relationships (lessons within modules)
- Role-based data access patterns

---

## Project Structure

```
kambaz-next-web-app/
├── app/
│   ├── layout.tsx                  # Root layout with Bootstrap
│   ├── page.tsx                    # Root redirect to Sign in
│   ├── globals.css                 # Global styles
│   │
│   ├── Account/
│   │   ├── layout.tsx              # Account layout with sidebar nav
│   │   ├── Navigation.tsx          # Signin / Signup / Profile links
│   │   ├── Signin/page.tsx
│   │   ├── Signup/page.tsx
│   │   └── Profile/page.tsx
│   │
│   ├── Dashboard/
│   │   └── page.tsx                # Course cards grid
│   │
│   ├── Courses/
│   │   └── [cid]/
│   │       ├── layout.tsx          # Course layout with breadcrumb and nav
│   │       ├── Navigation.tsx      # Course section links
│   │       ├── Breadcrumb.tsx
│   │       ├── Home/page.tsx       # Modules + Course Status
│   │       ├── Modules/
│   │       │   ├── page.tsx        # Module list with lessons
│   │       │   ├── ModulesControls.tsx
│   │       │   ├── ModuleControlButtons.tsx
│   │       │   ├── LessonControlButtons.tsx
│   │       │   └── GreenCheckmark.tsx
│   │       ├── Assignments/
│   │       │   ├── page.tsx        # Assignment list
│   │       │   └── [aid]/page.tsx  # Assignment editor
│   │       ├── Grades/page.tsx
│   │       └── People/
│   │           └── Table/page.tsx  # Enrolled users table
│   │
│   ├── Labs/
│   │   ├── layout.tsx              # Labs layout with TOC
│   │   ├── TOC.tsx                 # Table of contents navigation
│   │   ├── Lab1/                   # HTML examples
│   │   ├── Lab2/                   # CSS basics
│   │   ├── Lab3/                   # JavaScript fundamentals
│   │   └── Lab4/                   # React and Redux
│   │       ├── page.tsx
│   │       ├── ClickEvent.tsx
│   │       ├── Counter.tsx
│   │       ├── BooleanStateVariables.tsx
│   │       ├── StringStateVariables.tsx
│   │       ├── DateStateVariable.tsx
│   │       ├── ObjectStateVariable.tsx
│   │       ├── ArrayStateVariable.tsx
│   │       ├── ParentStateComponent.tsx
│   │       ├── ChildStateComponent.tsx
│   │       ├── store/index.ts      # Redux store config
│   │       └── ReduxExamples/
│   │           └── todos/          # Todo CRUD with Redux
│   │
│   ├── Kambaz/
│   │   ├── layout.tsx              # Main app layout with sidebar
│   │   ├── Navigation.tsx          # Sidebar navigation
│   │   └── styles.css              # Kambaz-specific styles
│   │
│   └── Database/
│       ├── index.ts                # Data exports
│       ├── courses.json            # 8 courses
│       ├── modules.json            # 24 modules with 72 lessons
│       ├── assignments.json        # 24 assignments
│       ├── users.json              # 28 users
│       └── enrollments.json        # 60 enrollments
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account (for backend)

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/BhanuHarshaY/kambaz-next-web-app.git
cd kambaz-next-web-app

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_REMOTE_SERVER=http://localhost:4000" > .env.local

# Run development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Backend Setup

```bash
# Clone the backend repository
git clone https://github.com/BhanuHarshaY/kambaz-node-server-app.git
cd kambaz-node-server-app

# Install dependencies
npm install

# Create .env
# Add the following:
# MONGO_CONNECTION_STRING=<your-mongodb-atlas-connection-string>
# FRONTEND_URL=http://localhost:3000

# Run the server
node app.js
```

The server will be available at `http://localhost:4000`.

---

## Deployment

| Layer | Platform | URL |
|---|---|---|
| Frontend | Vercel | [Live App](https://kambaz-next-js-zeta-liart.vercel.app) |
| Backend | Render | Hosted API |
| Database | MongoDB Atlas | Cloud cluster |

### Deployment Notes
- CORS is configured to allow credentials across Vercel and Render domains
- Session cookies use `SameSite: none` and `Secure: true` for cross-origin persistence
- Environment variables are set independently on each platform

---

## User Roles and Permissions

| Action | Admin | Faculty | TA | Student |
|---|---|---|---|---|
| Create/Edit/Delete Courses | Yes | Yes | No | No |
| Create/Edit/Delete Modules | Yes | Yes | No | No |
| Create/Edit/Delete Assignments | Yes | Yes | Yes | No |
| Manage Enrollments | Yes | Yes | No | No |
| Enroll/Unenroll Self | No | No | No | Yes |
| Take Quizzes | No | No | No | Yes |
| View People Table | Yes | Yes | Yes | Yes |

---

## Sample Credentials

| Username | Password | Role |
|---|---|---|
| iron_man | stark123 | Faculty |
| dark_knight | wayne123 | Student |
| black_widow | romanoff123 | TA |
| ada | 123 | Admin |

---

## API Endpoints Overview

The backend exposes 43 endpoints across 8 resource categories:

- **Users** : Registration, authentication, profile management, role-based queries
- **Courses** : CRUD operations, course search, enrollment counts
- **Modules** : Nested CRUD within courses, lesson management
- **Assignments** : CRUD with due dates, points, and availability configuration
- **Enrollments** : User-course associations, bulk enrollment operations
- **Quizzes** : Quiz creation, configuration, publishing
- **Questions** : Question CRUD tied to quizzes, multiple type support
- **Attempts** : Quiz attempt tracking, scoring, submission management

---

## Labs

The application includes 4 lab modules demonstrating progressive web development concepts:

- **Lab 1** : HTML structure, semantic elements, forms, and tables
- **Lab 2** : CSS styling, Bootstrap grid, responsive design
- **Lab 3** : JavaScript fundamentals, ES6 features, DOM manipulation
- **Lab 4** : React state management, events, Redux Toolkit, component composition


