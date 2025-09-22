# CodeTracker - System Architecture & Workflow Documentation

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [File Structure](#file-structure)
4. [Workflow](#workflow)
5. [Environment Configuration](#environment-configuration)
6. [Database](#database)
7. [Authentication System](#authentication-system)
8. [API Endpoints](#api-endpoints)
9. [Frontend Components](#frontend-components)
10. [State Management](#state-management)
11. [GitHub Integration](#github-integration)
12. [Deployment](#deployment)

---

## 🏗️ System Overview

CodeTracker is a comprehensive coding education platform designed to facilitate collaborative learning between students and teachers. It includes the following core features:

- **User Management** - Student, Teacher, Admin roles
- **Assignment Management** - Create, submit, and grade assignments
- **Real-time Collaboration** - Live coding sessions
- **Gamification** - XP, levels, achievements
- **GitHub Integration** - Version control management
- **Analytics** - Performance reporting

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework (App Router)
- **TypeScript** - Static typing
- **Tailwind CSS** - CSS framework
- **Shadcn/ui** - UI component library
- **Framer Motion** - Animations
- **Zustand** - State management
- **NextAuth.js** - Authentication

### Backend
- **Next.js API Routes** - Serverless API
- **Prisma** - ORM (Object-Relational Mapping)
- **SQLite** - Database (development)
- **PostgreSQL** - Database (production)

### External Services
- **GitHub API** - Version control
- **Vercel** - Deployment platform
- **OAuth Providers** - GitHub, Google, Discord

---

## 📁 File Structure

```
codetracker/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API endpoints
│   │   │   ├── auth/          # Authentication
│   │   │   ├── github/        # GitHub integration
│   │   │   ├── user/          # User data
│   │   │   └── admin/         # Admin functions
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── overview/      # Overview
│   │   │   ├── profile/       # Profile
│   │   │   ├── settings/      # Settings
│   │   │   ├── assignments/   # Assignments
│   │   │   ├── collaboration/ # Collaboration
│   │   │   ├── gamification/  # Gamification
│   │   │   ├── analytics/     # Analytics
│   │   │   ├── github/        # GitHub
│   │   │   └── admin/         # Admin panel
│   │   ├── globals.css        # Global CSS
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/                # UI components
│   │   ├── layout/            # Layout components
│   │   ├── providers/         # Context providers
│   │   ├── collaboration/     # Collaboration
│   │   ├── gamification/      # Gamification
│   │   ├── github/            # GitHub integration
│   │   └── profile/           # Profile
│   ├── lib/                   # Utility functions
│   │   ├── auth.ts            # Auth configuration
│   │   ├── db.ts              # Database connection
│   │   ├── i18n.ts            # Internationalization
│   │   └── gamification/      # Gamification logic
│   ├── store/                 # Zustand stores
│   │   ├── ui.ts              # UI state
│   │   └── settings.ts        # Settings state
│   └── types/                 # TypeScript definitions
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── docs/                      # Documentation
├── scripts/                   # Scripts
├── tests/                     # Tests
├── .env.local                 # Local environment config
├── .env.example               # Environment config example
├── package.json               # NPM configuration
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind configuration
└── vercel.json                # Vercel deployment config
```

---

## 🔄 Workflow

### 1. User Authentication Flow
```
User → OAuth Provider (GitHub/Google/Discord) → NextAuth.js → Session
```

### 2. Assignment Creation Process
```
Teacher → Create Assignment → Prisma → SQLite → Visible to Students
```

### 3. Code Submission Process
```
Student → Monaco Editor → API → Prisma → Database → Visible to Teacher
```

### 4. GitHub Integration Flow
```
User → GitHub OAuth → GitHub API → Fetch Data → Display in Profile
```

---

## 🌍 Environment Configuration

### Development Environment (.env.local)
```bash
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GITHUB_TOKEN="your-github-personal-access-token"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"

# Email
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@codetracker.com"
```

### Production Environment (Vercel)
```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/database"
DIRECT_URL="postgresql://username:password@host:port/database"

# NextAuth.js
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="production-secret-key"

# OAuth Providers (Production)
GITHUB_CLIENT_ID="production-github-client-id"
GITHUB_CLIENT_SECRET="production-github-client-secret"
GITHUB_TOKEN="production-github-token"

# Other configurations...
```

### ⚠️ Important Notes
- **Never push `.env.local` file to Git!**
- **`.env.example` is only an example configuration**
- **Use real values in production**

---

## 🗄️ Database

### Prisma Schema
```prisma
model User {
  id                  String    @id @default(cuid())
  name                String?
  email               String    @unique
  role                Role      @default(STUDENT)
  githubUsername      String?
  // ... other fields
}

model Assignment {
  id          String    @id @default(cuid())
  title       String
  description String
  teacherId   String
  teacher     User      @relation(fields: [teacherId], references: [id])
  // ... other fields
}

enum Role {
  STUDENT
  TEACHER
  ADMIN
}
```

### Database Connection
```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()
```

---

## 🔐 Authentication System

### NextAuth.js Configuration
```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import DiscordProvider from 'next-auth/providers/discord'

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  // ... other configurations
}
```

### Middleware (Authorization)
```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Authorization logic
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Token validation
      },
    },
  }
)
```

---

## 🌐 API Endpoints

### Authentication
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### User Data
- `GET /api/user/progress` - User progress
- `GET /api/user/achievements` - Achievements
- `POST /api/user/role-request` - Request role change

### GitHub Integration
- `GET /api/github/user/[username]` - GitHub user data
- `GET /api/github/repos` - Repositories
- `GET /api/github/commits` - Commits

### Admin Functions
- `GET /api/admin/role-requests` - Role requests
- `PUT /api/admin/role-requests` - Approve role requests

---

## 🎨 Frontend Components

### Layout System
```typescript
// src/components/layout/DashboardLayout.tsx
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  )
}
```

### State Management (Zustand)
```typescript
// src/store/settings.ts
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      appearance: defaultAppearance,
      updateAppearance: (settings) =>
        set((state) => ({
          appearance: { ...state.appearance, ...settings },
        })),
    }),
    { name: 'settings-storage' }
  )
)
```

### Provider System
```typescript
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <FontSizeProvider>
              <CompactModeProvider>
                <SessionProvider>
                  {children}
                </SessionProvider>
              </CompactModeProvider>
            </FontSizeProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

## 📊 State Management

### UI State (Zustand)
```typescript
interface UIState {
  sidebarCollapsed: boolean
  theme: 'light' | 'dark' | 'system'
  setSidebarCollapsed: (collapsed: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}
```

### Settings State
```typescript
interface SettingsState {
  appearance: AppearanceSettings
  notifications: NotificationSettings
  privacy: PrivacySettings
  profile: ProfileSettings
  updateAppearance: (settings: Partial<AppearanceSettings>) => void
  // ... other functions
}
```

---

## 🔗 GitHub Integration

### OAuth Process
1. User clicks "Sign in with GitHub"
2. Redirect to GitHub OAuth page
3. Grant permission on GitHub
4. Return to callback URL
5. NextAuth.js creates session

### API Connection
```typescript
// src/app/api/github/user/[username]/route.ts
export async function GET(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  
  const githubResponse = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'User-Agent': 'CodeTracker-App',
    },
  })
  
  return NextResponse.json(await githubResponse.json())
}
```

---

## 🚀 Deployment

### Vercel Deployment
1. **Sign up on Vercel** - https://vercel.com
2. **Connect GitHub repository**
3. **Configure environment variables**
4. **Deploy**

### Environment Variables (Vercel)
```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
```

### Database Migration
```bash
# Migrate to production database
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

---

## 🔧 Development Commands

### Development
```bash
# Start development server
npm run dev

# Build project
npm run build

# Start production server
npm start
```

### Database
```bash
# Generate Prisma client
npm run db:generate

# Push database changes
npm run db:push

# Create migration
npm run db:migrate

# Seed database
npm run db:seed
```

### Testing
```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# View coverage
npm run test:coverage
```

### Admin Commands
```bash
# Create user
npm run admin:create-user email@example.com "Name" ADMIN

# List users
npm run admin:list-users

# Promote to admin
npm run admin:promote email@example.com
```

---

## 📝 Important Notes

### Files NOT to push to Git
- `.env.local` - Local environment configuration
- `.env` - Environment configuration
- `node_modules/` - Dependencies
- `.next/` - Next.js build files
- `dev.db` - SQLite database

### Security
- **Environment variables** - Never hardcode in code
- **API keys** - Only use server-side
- **Database credentials** - Use in production
- **CORS** - Configure properly

### Performance
- **Image optimization** - Use Next.js Image component
- **Code splitting** - Use dynamic imports
- **Caching** - Cache API responses
- **Database queries** - Optimize Prisma queries

---

## 🆘 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```bash
# Regenerate Prisma client
npx prisma generate

# Check database URL
echo $DATABASE_URL
```

#### 2. GitHub API 403 Error
```bash
# Set GitHub token
export GITHUB_TOKEN=your-token

# Check rate limit
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/rate_limit
```

#### 3. NextAuth Session Error
```bash
# Set NEXTAUTH_SECRET
export NEXTAUTH_SECRET=your-secret

# Set NEXTAUTH_URL
export NEXTAUTH_URL=http://localhost:3000
```

#### 4. Build Error
```bash
# Check TypeScript errors
npm run type-check

# Fix lint errors
npm run lint:fix

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Vercel Deployment Guide](https://vercel.com/docs)

---

## 👥 Contributors

People involved in developing this project:
- **Frontend Development** - React, Next.js, TypeScript
- **Backend Development** - API Routes, Prisma, Database
- **UI/UX Design** - Tailwind CSS, Shadcn/ui
- **DevOps** - Vercel, GitHub Actions

---

*This documentation provides a complete overview of CodeTracker's architecture and workflow. If you have questions, please ask on GitHub Issues.*
