# CodeTracker - Системийн Архитектур ба Ажлын Урсгал

## 📋 Агуулга
1. [Системийн Ерөнхий Тойм](#системийн-ерөнхий-тойм)
2. [Технологийн Стек](#технологийн-стек)
3. [Файлын Бүтэц](#файлын-бүтэц)
4. [Ажлын Урсгал](#ажлын-урсгал)
5. [Орчин тохиргоо](#орчин-тохиргоо)
6. [Мэдээллийн Санд](#мэдээллийн-санд)
7. [Аутентификацийн Систем](#аутентификацийн-систем)
8. [API Эндпоинтууд](#api-эндпоинтууд)
9. [Frontend Компонентууд](#frontend-компонентууд)
10. [State Management](#state-management)
11. [GitHub Интеграци](#github-интеграци)
12. [Deployment](#deployment)

---

## 🏗️ Системийн Ерөнхий Тойм

CodeTracker бол програмчлалын боловсролын платформ бөгөөд оюутнууд болон багш нар хоорондын хамтын ажиллагааг дэмжих зорилготой. Энэ нь дараах үндсэн функцуудыг агуулна:

- **Хэрэглэгчийн удирдлага** - Оюутан, багш, админ эрх
- **Даалгаврын удирдлага** - Даалгавар үүсгэх, илгээх, үнэлэх
- **Хамтын ажиллагаа** - Бодит цагийн код бичих
- **Гаминфикаци** - XP, түвшин, амжилт
- **GitHub интеграци** - Версийн удирдлага
- **Аналитик** - Гүйцэтгэлийн тайлан

---

## 🛠️ Технологийн Стек

### Frontend
- **Next.js 15** - React фреймворк (App Router)
- **TypeScript** - Статик типинг
- **Tailwind CSS** - CSS фреймворк
- **Shadcn/ui** - UI компонент сан
- **Framer Motion** - Анимаци
- **Zustand** - State management
- **NextAuth.js** - Аутентификаци

### Backend
- **Next.js API Routes** - Serverless API
- **Prisma** - ORM (Object-Relational Mapping)
- **SQLite** - Мэдээллийн сан (хөгжүүлэлт)
- **PostgreSQL** - Мэдээллийн сан (production)

### External Services
- **GitHub API** - Версийн удирдлага
- **Vercel** - Deployment платформ
- **OAuth Providers** - GitHub, Google, Discord

---

## 📁 Файлын Бүтэц

```
codetracker/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API эндпоинтууд
│   │   │   ├── auth/          # Аутентификаци
│   │   │   ├── github/        # GitHub интеграци
│   │   │   ├── user/          # Хэрэглэгчийн мэдээлэл
│   │   │   └── admin/         # Админ функцууд
│   │   ├── dashboard/         # Хяналтын самбар
│   │   │   ├── overview/      # Ерөнхий харах
│   │   │   ├── profile/       # Профайл
│   │   │   ├── settings/      # Тохиргоо
│   │   │   ├── assignments/   # Даалгавар
│   │   │   ├── collaboration/ # Хамтын ажиллагаа
│   │   │   ├── gamification/  # Гаминфикаци
│   │   │   ├── analytics/     # Аналитик
│   │   │   ├── github/        # GitHub
│   │   │   └── admin/         # Админ панел
│   │   ├── globals.css        # Глобал CSS
│   │   ├── layout.tsx         # Үндсэн layout
│   │   └── page.tsx           # Нүүр хуудас
│   ├── components/            # React компонентууд
│   │   ├── ui/                # UI компонентууд
│   │   ├── layout/            # Layout компонентууд
│   │   ├── providers/         # Context providers
│   │   ├── collaboration/     # Хамтын ажиллагаа
│   │   ├── gamification/      # Гаминфикаци
│   │   ├── github/            # GitHub интеграци
│   │   └── profile/           # Профайл
│   ├── lib/                   # Утилит функцууд
│   │   ├── auth.ts            # Аутентификаци тохиргоо
│   │   ├── db.ts              # Мэдээллийн сан холболт
│   │   ├── i18n.ts            # Олон хэлний дэмжлэг
│   │   └── gamification/      # Гаминфикаци логик
│   ├── store/                 # Zustand stores
│   │   ├── ui.ts              # UI state
│   │   └── settings.ts        # Тохиргооны state
│   └── types/                 # TypeScript тодорхойлолт
├── prisma/
│   ├── schema.prisma          # Мэдээллийн сан схем
│   └── seed.ts                # Анхны өгөгдөл
├── docs/                      # Баримт бичиг
├── scripts/                   # Скриптүүд
├── tests/                     # Тестүүд
├── .env.local                 # Локаль орчин тохиргоо
├── .env.example               # Орчин тохиргооны жишээ
├── package.json               # NPM тохиргоо
├── next.config.js             # Next.js тохиргоо
├── tailwind.config.js         # Tailwind тохиргоо
└── vercel.json                # Vercel deployment тохиргоо
```

---

## 🔄 Ажлын Урсгал

### 1. Хэрэглэгчийн Аутентификаци
```
Хэрэглэгч → OAuth Provider (GitHub/Google/Discord) → NextAuth.js → Session
```

### 2. Даалгаврын Үүсгэх Процесс
```
Багш → Даалгавар үүсгэх → Prisma → SQLite → Оюутанд харагдах
```

### 3. Код Илгээх Процесс
```
Оюутан → Monaco Editor → API → Prisma → Мэдээллийн сан → Багшдаа харагдах
```

### 4. GitHub Интеграци
```
Хэрэглэгч → GitHub OAuth → GitHub API → Мэдээлэл татах → Профайлд харуулах
```

---

## 🌍 Орчин Тохиргоо

### Хөгжүүлэлтийн Орчин (.env.local)
```bash
# Мэдээллийн сан
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

### Production Орчин (Vercel)
```bash
# Мэдээллийн сан (PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/database"
DIRECT_URL="postgresql://username:password@host:port/database"

# NextAuth.js
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="production-secret-key"

# OAuth Providers (Production)
GITHUB_CLIENT_ID="production-github-client-id"
GITHUB_CLIENT_SECRET="production-github-client-secret"
GITHUB_TOKEN="production-github-token"

# Бусад тохиргоонууд...
```

### ⚠️ Чухал Анхааруулга
- **`.env.local` файлыг Git-д push хийж болохгүй!**
- **`.env.example` файл нь зөвхөн жишээ тохиргоо**
- **Production-д бодит утгуудыг ашиглах**

---

## 🗄️ Мэдээллийн Санд

### Prisma Schema
```prisma
model User {
  id                  String    @id @default(cuid())
  name                String?
  email               String    @unique
  role                Role      @default(STUDENT)
  githubUsername      String?
  // ... бусад талбарууд
}

model Assignment {
  id          String    @id @default(cuid())
  title       String
  description String
  teacherId   String
  teacher     User      @relation(fields: [teacherId], references: [id])
  // ... бусад талбарууд
}

enum Role {
  STUDENT
  TEACHER
  ADMIN
}
```

### Мэдээллийн сан холболт
```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()
```

---

## 🔐 Аутентификацийн Систем

### NextAuth.js Тохиргоо
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
  // ... бусад тохиргоонууд
}
```

### Middleware (Эрх шалгах)
```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Эрх шалгах логик
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Токен шалгах
      },
    },
  }
)
```

---

## 🌐 API Эндпоинтууд

### Аутентификаци
- `GET /api/auth/session` - Одоогийн сессийг авах
- `POST /api/auth/signin` - Нэвтрэх
- `POST /api/auth/signout` - Гарах

### Хэрэглэгчийн мэдээлэл
- `GET /api/user/progress` - Хэрэглэгчийн ахиц
- `GET /api/user/achievements` - Амжилтууд
- `POST /api/user/role-request` - Эрх хүсэх

### GitHub интеграци
- `GET /api/github/user/[username]` - GitHub хэрэглэгчийн мэдээлэл
- `GET /api/github/repos` - Repository-ууд
- `GET /api/github/commits` - Commit-ууд

### Админ функцууд
- `GET /api/admin/role-requests` - Эрх хүсэлтүүд
- `PUT /api/admin/role-requests` - Эрх хүсэлт баталгаажуулах

---

## 🎨 Frontend Компонентууд

### Layout Систем
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

### Provider Систем
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
  // ... бусад функцууд
}
```

---

## 🔗 GitHub Интеграци

### OAuth Процесс
1. Хэрэглэгч "GitHub-ээр нэвтрэх" товчийг дарах
2. GitHub OAuth хуудас руу шилжих
3. GitHub-д зөвшөөрөл өгөх
4. Callback URL-д буцах
5. NextAuth.js сессийг үүсгэх

### API Холболт
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
1. **Vercel-д бүртгүүлэх** - https://vercel.com
2. **GitHub repository холбох**
3. **Environment variables тохируулах**
4. **Deploy хийх**

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
# Production мэдээллийн санд migrate хийх
npx prisma migrate deploy

# Prisma client generate хийх
npx prisma generate
```

---

## 🔧 Development Commands

### Хөгжүүлэлт
```bash
# Development server эхлүүлэх
npm run dev

# Build хийх
npm run build

# Production server эхлүүлэх
npm start
```

### Database
```bash
# Prisma client generate хийх
npm run db:generate

# Database push хийх
npm run db:push

# Migration үүсгэх
npm run db:migrate

# Seed data оруулах
npm run db:seed
```

### Testing
```bash
# Unit tests ажиллуулах
npm run test

# E2E tests ажиллуулах
npm run test:e2e

# Coverage харах
npm run test:coverage
```

### Admin Commands
```bash
# Хэрэглэгч үүсгэх
npm run admin:create-user email@example.com "Name" ADMIN

# Хэрэглэгчдийн жагсаалт харах
npm run admin:list-users

# Админ эрх өгөх
npm run admin:promote email@example.com
```

---

## 📝 Чухал Тэмдэглэл

### Git-д Push хийхгүй файлууд
- `.env.local` - Локаль орчин тохиргоо
- `.env` - Орчин тохиргоо
- `node_modules/` - Dependencies
- `.next/` - Next.js build файлууд
- `dev.db` - SQLite мэдээллийн сан

### Security
- **Environment variables** - Хэзээ ч кодонд hardcode хийхгүй
- **API keys** - Зөвхөн server-side ашиглах
- **Database credentials** - Production-д хэрэглэх
- **CORS** - Зөв тохируулах

### Performance
- **Image optimization** - Next.js Image component ашиглах
- **Code splitting** - Dynamic imports ашиглах
- **Caching** - API responses cache хийх
- **Database queries** - Prisma optimize хийх

---

## 🆘 Troubleshooting

### Нийтлэг асуудлууд

#### 1. Database холболт алдаа
```bash
# Prisma client дахин generate хийх
npx prisma generate

# Database URL шалгах
echo $DATABASE_URL
```

#### 2. GitHub API 403 алдаа
```bash
# GitHub token тохируулах
export GITHUB_TOKEN=your-token

# Rate limit шалгах
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/rate_limit
```

#### 3. NextAuth session алдаа
```bash
# NEXTAUTH_SECRET тохируулах
export NEXTAUTH_SECRET=your-secret

# NEXTAUTH_URL тохируулах
export NEXTAUTH_URL=http://localhost:3000
```

#### 4. Build алдаа
```bash
# TypeScript алдаа шалгах
npm run type-check

# Lint алдаа засах
npm run lint:fix

# Dependencies дахин суулгах
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Нэмэлт Ном

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Vercel Deployment Guide](https://vercel.com/docs)

---

## 👥 Хөгжүүлэгчид

Энэ төслийг хөгжүүлэхэд оролцсон хүмүүс:
- **Frontend Development** - React, Next.js, TypeScript
- **Backend Development** - API Routes, Prisma, Database
- **UI/UX Design** - Tailwind CSS, Shadcn/ui
- **DevOps** - Vercel, GitHub Actions

---

*Энэ баримт бичиг нь CodeTracker төслийн бүрэн архитектур болон ажлын урсгалыг тайлбарлаж байна. Асуулт байвал GitHub Issues дээр асуугаарай.*
