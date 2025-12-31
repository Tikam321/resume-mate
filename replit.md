# ResumeMatch - AI Resume Analyzer

## Overview

ResumeMatch is a full-stack web application that analyzes resumes against job descriptions using AI. Users upload a PDF resume and paste a job description, then receive a match score, strength analysis, missing skills identification, improvement suggestions, and a personalized cold email draft.

The application uses a React frontend with a Node.js/Express backend, leveraging Google's Gemini AI through Replit's AI Integrations for intelligent resume analysis.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for smooth UI transitions
- **Build Tool**: Vite with hot module replacement

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/`
- Reusable UI components in `client/src/components/ui/`
- Custom hooks in `client/src/hooks/`
- Shared utilities in `client/src/lib/`

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **File Uploads**: Multer for multipart/form-data handling
- **PDF Processing**: pdf-parse for extracting text from uploaded resumes
- **AI Integration**: Google Gemini via Replit AI Integrations

The backend exposes a REST API with the primary endpoint:
- `POST /api/analyze` - Accepts resume PDF and job description, returns AI analysis

### Data Flow
1. User uploads PDF resume and enters job description
2. Frontend sends multipart form data to `/api/analyze`
3. Backend extracts text from PDF using pdf-parse
4. Text is sent to Gemini AI with structured prompt
5. AI returns analysis with match score, strengths, gaps, suggestions, and cold email
6. Response is validated with Zod schemas and returned to frontend

### Shared Code
- `shared/schema.ts` - Zod validation schemas for API responses
- `shared/routes.ts` - API route definitions and response types
- `shared/models/chat.ts` - Database models for chat feature (Drizzle ORM)

### Database Layer
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Location**: `shared/schema.ts` and `shared/models/chat.ts`
- **Migrations**: Generated via `drizzle-kit push`

Note: The database connection requires `DATABASE_URL` environment variable.

## External Dependencies

### AI Services
- **Replit AI Integrations**: Provides access to Google Gemini models
  - Environment variables: `AI_INTEGRATIONS_GEMINI_API_KEY`, `AI_INTEGRATIONS_GEMINI_BASE_URL`
  - Supported models: `gemini-2.5-flash` (fast), `gemini-2.5-pro` (advanced), `gemini-2.5-flash-image` (image generation)

### Database
- **PostgreSQL**: Primary database via Drizzle ORM
  - Environment variable: `DATABASE_URL`
  - Session storage: connect-pg-simple for Express sessions

### Key NPM Packages
- **UI**: @radix-ui primitives, shadcn/ui components, lucide-react icons
- **Forms**: react-hook-form with @hookform/resolvers
- **Validation**: Zod for runtime type checking
- **PDF**: pdf-parse for document text extraction
- **HTTP**: Express with multer for file uploads

### Development Tools
- **Vite**: Frontend build and dev server
- **esbuild**: Production server bundling
- **TypeScript**: Full type coverage across client/server/shared