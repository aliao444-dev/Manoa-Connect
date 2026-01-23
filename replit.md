# Manoa Connect

## Overview

Manoa Connect is a WeChat-style all-in-one campus application exclusively for University of Hawaii at Manoa students. The platform combines a student marketplace, campus micro-mobility transportation service (SWOOP), and messaging features. Built with React frontend and Express backend, it uses Replit Auth for authentication and PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state caching and synchronization
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **UI Components**: Radix UI primitives with custom theming using UH Manoa brand colors (#024731 green)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **File Uploads**: Uppy library with AWS S3-compatible presigned URL uploads

### Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful endpoints defined in shared route schemas with Zod validation
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: express-session with connect-pg-simple for PostgreSQL session storage
- **Authentication**: Replit Auth (OpenID Connect) with Passport.js integration

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` for app tables, `shared/models/auth.ts` for auth tables
- **Key Tables**: 
  - `users` and `sessions` (required for Replit Auth)
  - `profiles` (extends user data with display name, bio, trust score, driver status)
  - `listings` (marketplace items with pricing in cents)
  - `rides` (SWOOP ride requests)
  - `messages` (in-app messaging)
- **Object Storage**: Google Cloud Storage via Replit's object storage integration

### Code Organization
```
client/src/          # React frontend
  components/        # Reusable UI components
  pages/            # Route page components
  hooks/            # Custom React hooks for data fetching
  lib/              # Utilities and query client setup

server/             # Express backend
  replit_integrations/  # Auth and object storage modules
  routes.ts         # API route handlers
  storage.ts        # Database access layer
  db.ts            # Database connection

shared/             # Code shared between client and server
  schema.ts         # Drizzle database schemas
  routes.ts         # API route definitions with Zod schemas
  models/auth.ts    # Auth-related database models
```

### Authentication Flow
- Uses Replit's OpenID Connect provider for user authentication
- Sessions stored in PostgreSQL `sessions` table
- User profiles auto-created on first access after login
- Protected routes check authentication via `isAuthenticated` middleware

### Build System
- Development: `tsx` for TypeScript execution with Vite dev server
- Production: esbuild bundles server, Vite bundles client to `dist/`
- Server dependencies are selectively bundled to optimize cold start times

## External Dependencies

### Authentication
- **Replit Auth**: OpenID Connect authentication via Replit's identity provider
- Required environment variables: `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET`

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migrations via `drizzle-kit push`

### Object Storage
- **Google Cloud Storage**: File uploads via Replit's object storage sidecar
- Presigned URL upload pattern for direct client-to-storage uploads
- ACL policies for access control

### Frontend Libraries
- **shadcn/ui**: Pre-built accessible component library
- **Radix UI**: Headless UI primitives
- **TanStack Query**: Data fetching and caching
- **Uppy**: File upload management with dashboard UI

### Development Tools
- **Vite**: Frontend build and dev server with HMR
- **esbuild**: Server bundling for production
- **TypeScript**: Full type safety across client and server