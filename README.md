<div align="center">

# Task Management System

**Enterprise-Grade Task Management API with Role-Based Access Control**

A production-ready full-stack application built with Next.js 16, featuring JWT authentication, RBAC, and RESTful API design.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-tsk--mangr.vercel.app-000?style=for-the-badge&logo=vercel)](https://tsk-mangr.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[Live Demo](https://tsk-mangr.vercel.app/) • [API Documentation](docs/API_DOCUMENTATION.md) • [Quick Reference](docs/API_QUICK_REFERENCE.md) • [Scalability Strategy](SCALABILITY.md)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Authentication & Security](#authentication--security)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Deployment](#deployment)
- [Scalability](#scalability)
- [License](#license)

---

## Overview

The **Task Management System** is a full-stack web application designed to demonstrate production-ready backend architecture with enterprise-level security and scalability considerations. The application provides comprehensive task management capabilities with role-based access control, supporting both USER and ADMIN roles.

### Key Capabilities

- **Complete CRUD Operations**: Create, read, update, and delete tasks with full ownership validation
- **Secure Authentication**: JWT-based authentication with access/refresh token rotation
- **Role-Based Authorization**: Middleware-enforced RBAC with USER and ADMIN roles
- **RESTful API Design**: Versioned API endpoints following REST principles
- **Type-Safe Development**: Full TypeScript implementation with Zod validation
- **Production Deployment**: Live deployment on Vercel with PostgreSQL database

### Live Application

**Production URL**: [https://tsk-mangr.vercel.app/](https://tsk-mangr.vercel.app/)

---

## Core Features

### Authentication & Authorization

| Feature | Implementation |
|---------|---------------|
| **JWT Authentication** | Access tokens (15 min expiry) + Refresh tokens (7 day expiry) |
| **Token Rotation** | Automatic refresh token rotation with theft detection |
| **Password Security** | bcrypt hashing with 12 salt rounds |
| **Role-Based Access** | Middleware-enforced RBAC for USER and ADMIN roles |
| **Session Management** | httpOnly cookies for refresh tokens with secure flags |

### Task Management

| Feature | Description |
|---------|-------------|
| **CRUD Operations** | Full create, read, update, delete functionality |
| **Ownership Validation** | Users can only modify their own tasks |
| **Task Properties** | Title, description, completion status with timestamps |
| **Input Validation** | Zod schema validation for all inputs |
| **Error Handling** | Centralized error handling with detailed error codes |

### Admin Features

| Feature | Description |
|---------|-------------|
| **User Management** | View all registered users with task counts |
| **Dashboard Access** | Admin-only routes protected by middleware |
| **Task Overview** | Aggregate view of user activities |

---

## Technology Stack

### Backend Technologies

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | Next.js | 16 | Full-stack React framework with App Router |
| **Language** | TypeScript | 5 | Type-safe development |
| **Database** | PostgreSQL | Latest | Relational database management |
| **ORM** | Prisma | 7 | Type-safe database client |
| **Authentication** | jose | Latest | JWT token generation and verification |
| **Password Hashing** | bcryptjs | Latest | Secure password hashing |
| **Validation** | Zod | 4 | Runtime type validation |

### Frontend Technologies

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Styling** | Tailwind CSS | 4 | Utility-first CSS framework |
| **Font** | Geist | Google font optimization |
| **UI Components** | Custom | Reusable component library |

### Development Tools

- **ESLint**: Code quality and consistency
- **PostCSS**: CSS transformation
- **Prisma Client**: Auto-generated type-safe database client

---

## Architecture

### System Design

The application follows a layered architecture pattern:

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│              (React Components + UI)                     │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  Middleware Layer                        │
│         (JWT Verification + RBAC Enforcement)            │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   API Layer (v1)                         │
│         (Route Handlers + Business Logic)                │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  Data Access Layer                       │
│              (Prisma ORM + Validation)                   │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  Database Layer                          │
│                   (PostgreSQL)                           │
└─────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
┌─────────────┐              ┌─────────────┐              ┌─────────────┐
│   Client    │              │  Middleware │              │  API Route  │
└──────┬──────┘              └──────┬──────┘              └──────┬──────┘
       │                            │                            │
       │ 1. POST /auth/login        │                            │
       │ {email, password}          │                            │
       │───────────────────────────►│───────────────────────────►│
       │                            │                            │
       │                            │      2. Validate creds     │
       │                            │      3. Hash password      │
       │                            │      4. Generate tokens    │
       │◄───────────────────────────│◄───────────────────────────│
       │ accessToken (JSON)         │                            │
       │ refreshToken (Cookie)      │                            │
       │                            │                            │
       │ 5. GET /todos              │                            │
       │ Authorization: Bearer token│                            │
       │───────────────────────────►│                            │
       │                            │ 6. Verify JWT              │
       │                            │ 7. Check permissions       │
       │                            │ 8. Inject user context     │
       │                            │───────────────────────────►│
       │                            │                            │
       │                            │      9. Query database     │
       │                            │      10. Filter by userId  │
       │◄───────────────────────────│◄───────────────────────────│
       │ { tasks: [...] }           │                            │
       │                            │                            │
       │ 11. POST /auth/refresh     │                            │
       │ (Cookie: refreshToken)     │                            │
       │───────────────────────────►│───────────────────────────►│
       │                            │                            │
       │                            │   12. Verify refresh token │
       │                            │   13. Rotate tokens        │
       │                            │   14. Update DB hash       │
       │◄───────────────────────────│◄───────────────────────────│
       │ New accessToken (JSON)     │                            │
       │ New refreshToken (Cookie)  │                            │
```

---

## Getting Started

### Prerequisites

Ensure the following are installed on your system:

- **Node.js**: Version 18 or higher
- **Package Manager**: npm, yarn, pnpm, or bun
- **PostgreSQL**: Local instance or cloud database (Neon, Supabase, etc.)
- **Git**: For repository cloning

### Installation

**1. Clone the Repository**

```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

**2. Install Dependencies**

```bash
npm install
```

### Environment Configuration

**1. Create Environment File**

```bash
cp sample.env .env
```

**2. Configure Environment Variables**

Edit `.env` with your configuration:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host:5432/database_name"

# JWT Secrets (use strong, random strings)
JWT_SECRET="your-secure-access-token-secret-min-32-chars"
JWT_REFRESH_SECRET="your-secure-refresh-token-secret-min-32-chars"
```

#### Environment Variables Reference

| Variable | Type | Description | Required |
|----------|------|-------------|----------|
| `DATABASE_URL` | String | PostgreSQL connection string | ✅ Yes |
| `JWT_SECRET` | String | Secret for access token signing (min 32 chars) | ✅ Yes |
| `JWT_REFRESH_SECRET` | String | Secret for refresh token signing (min 32 chars) | ✅ Yes |

**Security Note**: Never commit `.env` files to version control. Use strong, randomly generated secrets in production.

### Database Setup

**1. Generate Prisma Client**

```bash
npx prisma generate
```

**2. Run Database Migrations**

```bash
npx prisma migrate dev
```

This command will:
- Create the database if it doesn't exist
- Apply all migrations
- Generate the Prisma Client

**3. (Optional) Seed Database**

```bash
npx prisma db seed
```

**4. (Optional) Open Prisma Studio**

```bash
npx prisma studio
```

Access the database GUI at `http://localhost:5555`

### Running the Application

**Development Mode**

```bash
npm run dev
```

Access the application at: `http://localhost:3000`

**Production Build**

```bash
npm run build
npm start
```

**Linting**

```bash
npm run lint
```

---

## API Reference

### Base URL

```
http://localhost:3000/api/v1
```

### Endpoint Summary

#### Authentication Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/auth/register` | ❌ No | Register new user account |
| `POST` | `/auth/login` | ❌ No | Authenticate user and issue tokens |
| `POST` | `/auth/refresh` | 🔐 Cookie | Refresh access token |
| `POST` | `/auth/logout` | 🔐 Cookie | Invalidate tokens and logout |

#### Task Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/todos` | 🔐 Bearer | Retrieve all user tasks |
| `POST` | `/todos` | 🔐 Bearer | Create new task |
| `PATCH` | `/todos/{id}` | 🔐 Bearer | Update existing task |
| `DELETE` | `/todos/{id}` | 🔐 Bearer | Delete task |

#### Admin Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/users` | 🔐 Admin | Retrieve all users (admin only) |

### Comprehensive Documentation

For detailed API documentation including request/response schemas, sample payloads, and error codes:

- **Full Documentation**: [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)
- **Quick Reference**: [docs/API_QUICK_REFERENCE.md](docs/API_QUICK_REFERENCE.md)
- **Postman Collection**: [docs/Postman_Collection.json](docs/Postman_Collection.json)

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────────────────────────────┐
│                  User                    │
├─────────────────────────────────────────┤
│ id              String (PK, CUID)       │
│ email           String (Unique, Indexed)│
│ passwordHash    String                  │
│ role            Enum (USER | ADMIN)     │
│ refreshTokenHash String?                │
│ createdAt       DateTime                │
│ updatedAt       DateTime                │
└───────────────────┬─────────────────────┘
                    │
                    │ 1:N
                    │
                    ▼
┌─────────────────────────────────────────┐
│                  Task                    │
├─────────────────────────────────────────┤
│ id              String (PK, CUID)       │
│ title           String                  │
│ description     String? (Text)          │
│ isCompleted     Boolean (default: false)│
│ userId          String (FK, Indexed)    │
│ createdAt       DateTime                │
│ updatedAt       DateTime                │
└─────────────────────────────────────────┘
```

### Schema Details

#### User Model

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PRIMARY KEY | CUID identifier |
| `email` | String | UNIQUE, INDEXED | User email address |
| `passwordHash` | String | NOT NULL | bcrypt hash of password |
| `role` | Enum | DEFAULT 'USER' | User role (USER/ADMIN) |
| `refreshTokenHash` | String | NULLABLE | Hashed refresh token |
| `createdAt` | DateTime | AUTO | Account creation timestamp |
| `updatedAt` | DateTime | AUTO | Last modification timestamp |

#### Task Model

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PRIMARY KEY | CUID identifier |
| `title` | String | NOT NULL, MAX 255 | Task title |
| `description` | String | NULLABLE, MAX 5000 | Task description |
| `isCompleted` | Boolean | DEFAULT false | Completion status |
| `userId` | String | FOREIGN KEY, INDEXED | Owner user ID |
| `createdAt` | DateTime | AUTO | Task creation timestamp |
| `updatedAt` | DateTime | AUTO | Last modification timestamp |

**Relationships**:
- `User` → `Task`: One-to-Many with CASCADE DELETE
- Foreign key index on `Task.userId` for query optimization

---

## Authentication & Security

### Token Management

#### Access Token

- **Purpose**: API authentication for protected routes
- **Lifetime**: 15 minutes
- **Storage**: Client-side (localStorage or memory)
- **Transmission**: `Authorization: Bearer <token>` header
- **Payload**: `{ userId: string, role: string, iat: number, exp: number }`

#### Refresh Token

- **Purpose**: Access token renewal without re-authentication
- **Lifetime**: 7 days
- **Storage**: httpOnly, secure, sameSite cookie
- **Transmission**: Automatic cookie transmission
- **Security**: Hashed in database (bcrypt) for theft detection

### Security Features

| Feature | Implementation |
|---------|---------------|
| **Password Requirements** | Min 8 chars, 1 uppercase, 1 lowercase, 1 number |
| **Password Storage** | bcrypt with 12 salt rounds |
| **Token Signing** | HMAC-SHA256 algorithm |
| **Token Rotation** | Refresh tokens rotated on each use |
| **Theft Detection** | Invalid token hash triggers invalidation |
| **XSS Protection** | httpOnly cookies prevent JavaScript access |
| **CSRF Protection** | sameSite: strict cookie policy |
| **Input Validation** | Zod schema validation on all endpoints |
| **SQL Injection** | Parameterized queries via Prisma ORM |

### Password Validation Rules

```typescript
- Minimum length: 8 characters
- Must contain: At least 1 uppercase letter (A-Z)
- Must contain: At least 1 lowercase letter (a-z)
- Must contain: At least 1 number (0-9)
```

### Middleware Protection

All protected routes pass through `proxy.ts` middleware which:

1. Extracts JWT from `Authorization` header
2. Verifies token signature and expiration
3. Validates user exists and is active
4. Enforces role-based access control
5. Injects `x-user-id` and `x-user-role` headers
6. Rejects invalid/expired tokens with 401 status

---

## Project Structure

```
task-manager/
│
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout with fonts and metadata
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # Global styles and Tailwind imports
│   │
│   ├── (auth)/                       # Authentication route group
│   │   ├── login/
│   │   │   └── page.tsx              # Login page with form validation
│   │   └── register/
│   │       └── page.tsx              # Registration page with validation
│   │
│   ├── dashboard/
│   │   └── page.tsx                  # User dashboard (task management)
│   │
│   ├── admin/
│   │   └── page.tsx                  # Admin dashboard (user management)
│   │
│   └── api/v1/                       # Versioned API routes
│       ├── auth/
│       │   ├── register/route.ts     # POST - User registration
│       │   ├── login/route.ts        # POST - User authentication
│       │   ├── refresh/route.ts      # POST - Token refresh
│       │   └── logout/route.ts       # POST - User logout
│       ├── todos/
│       │   ├── route.ts              # GET - List tasks, POST - Create task
│       │   └── [id]/route.ts         # PATCH - Update task, DELETE - Delete task
│       └── users/
│           └── route.ts              # GET - List all users (admin)
│
├── components/ui/                    # Reusable UI components
│   ├── Button.tsx                    # Button component with variants
│   ├── Input.tsx                     # Form input with validation
│   └── Textarea.tsx                  # Textarea with validation
│
├── hooks/
│   └── useAuth.ts                    # Client-side authentication hook
│
├── lib/                              # Server-side utilities
│   ├── prisma.ts                     # Prisma client singleton
│   ├── jwt.ts                        # JWT sign/verify utilities
│   ├── auth.ts                       # Auth guards (requireUser, requireRole)
│   ├── api-handler.ts                # Centralized error handler
│   └── validations/
│       ├── auth.ts                   # Zod schemas for authentication
│       └── task.ts                   # Zod schemas for task operations
│
├── prisma/
│   ├── schema.prisma                 # Database schema definition
│   └── migrations/                   # Migration history
│
├── docs/                             # API documentation
│   ├── README.md                     # Documentation index
│   ├── API_DOCUMENTATION.md          # Complete API reference
│   ├── API_QUICK_REFERENCE.md        # Quick reference guide
│   └── Postman_Collection.json       # Postman collection
│
├── public/                           # Static assets
├── proxy.ts                          # Next.js middleware (JWT + RBAC)
├── SCALABILITY.md                    # Scalability strategy document
├── sample.env                        # Environment variable template
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── postcss.config.mjs                # PostCSS configuration
├── eslint.config.mjs                 # ESLint configuration
└── .gitignore                        # Git ignore rules
```

---

## Documentation

### Available Documentation

| Document | Description | Use Case |
|----------|-------------|----------|
| [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) | Complete API reference with schemas | Detailed endpoint information |
| [API_QUICK_REFERENCE.md](docs/API_QUICK_REFERENCE.md) | Quick reference card | Fast lookup of endpoints |
| [Postman_Collection.json](docs/Postman_Collection.json) | Importable Postman collection | API testing |
| [SCALABILITY.md](SCALABILITY.md) | Scalability strategy | Production deployment planning |
| [docs/README.md](docs/README.md) | Documentation index | Navigate all documentation |

### Testing the API

**Using cURL:**

```bash
# Register a new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Test1234","role":"USER"}'

# Login and get access token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Test1234","role":"USER"}'

# Create a task (replace YOUR_TOKEN)
curl -X POST http://localhost:3000/api/v1/todos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Complete documentation","description":"Write README"}'
```

**Using Postman:**

1. Import `docs/Postman_Collection.json`
2. Update the `baseUrl` variable to `http://localhost:3000/api/v1`
3. Run the "Login User" request
4. Access token is automatically saved
5. Test other endpoints

---

## Deployment

### Production Deployment (Vercel)

**Live URL**: [https://tsk-mangr.vercel.app/](https://tsk-mangr.vercel.app/)

#### Deployment Steps

1. **Push to GitHub**

```bash
git push origin main
```

2. **Connect Vercel**

- Visit [vercel.com](https://vercel.com)
- Import your GitHub repository
- Configure environment variables

3. **Environment Variables (Vercel Dashboard)**

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-production-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
```

4. **Deploy**

Vercel automatically builds and deploys on push to main branch.

### Database Hosting

Recommended PostgreSQL hosting providers:

- **Neon**: [neon.tech](https://neon.tech) - Serverless PostgreSQL
- **Supabase**: [supabase.com](https://supabase.com) - Open-source Firebase alternative
- **Railway**: [railway.app](https://railway.app) - Simple deployment platform
- **Render**: [render.com](https://render.com) - Managed PostgreSQL

---

## Scalability

The application is designed with horizontal scalability in mind. Detailed strategies are documented in [SCALABILITY.md](SCALABILITY.md).

### Scalability Strategies

#### 1. Horizontal Scaling with Stateless Auth

- JWT-based authentication eliminates server-side session storage
- Multiple instances can run behind a load balancer (Nginx, AWS ALB)
- No sticky sessions required
- Linear scalability across instances

#### 2. Distributed Caching with Redis

- Cache frequently accessed data (user profiles, task lists)
- Reduce database query latency from ~50ms to <2ms
- Implement rate limiting with Redis counters
- Prevent database bottlenecks during traffic spikes

#### 3. Database Optimization

- **Indexing**: Email and userId columns indexed for fast lookups
- **Connection Pooling**: PgBouncer or Prisma Accelerate for efficient connections
- **Query Optimization**: Reduce query complexity from O(n) to O(log n)

#### 4. Containerization & Auto-Scaling

- **Docker**: Containerized deployment for consistency
- **Kubernetes**: Auto-scaling based on CPU/memory metrics
- **Target**: Handle 10,000+ concurrent users with <100ms response time

**Full Details**: See [SCALABILITY.md](SCALABILITY.md) for implementation specifics.

---

## License

This project was created as part of a **Backend Intern Assignment** to demonstrate:

- Production-ready API architecture
- Secure authentication and authorization
- Type-safe development practices
- Scalable system design
- Comprehensive documentation

Feel free to use this project as a reference for learning or building similar applications.

---

<div align="center">

### Built With Next.js, TypeScript, Prisma & PostgreSQL

**[View Live Demo](https://tsk-mangr.vercel.app/)** • **[Read API Docs](docs/API_DOCUMENTATION.md)** • **[View Scalability](SCALABILITY.md)**


</div>