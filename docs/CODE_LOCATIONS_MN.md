# CodeTracker - Код Байршил болон Файлын Бүтэц

## 📁 Файлын Бүтэц

```
codetracker/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── api/                      # API эндпоинтууд
│   │   │   ├── auth/                 # Аутентификаци
│   │   │   │   ├── [...nextauth]/route.ts    # NextAuth тохиргоо
│   │   │   │   └── providers/         # OAuth provider-ууд
│   │   │   ├── github/               # GitHub интеграци
│   │   │   │   ├── user/[username]/route.ts  # GitHub хэрэглэгч
│   │   │   │   ├── repos/route.ts    # Repository-ууд
│   │   │   │   └── commits/route.ts  # Commit-ууд
│   │   │   ├── user/                 # Хэрэглэгчийн мэдээлэл
│   │   │   │   ├── progress/route.ts # Ахиц
│   │   │   │   ├── achievements/route.ts # Амжилтууд
│   │   │   │   └── role-request/route.ts # Эрх хүсэх
│   │   │   ├── admin/                # Админ функцууд
│   │   │   │   ├── role-requests/route.ts # Эрх хүсэлтүүд
│   │   │   │   └── users/route.ts    # Хэрэглэгч удирдлага
│   │   │   ├── assignments/          # Даалгаврууд
│   │   │   │   ├── route.ts          # Даалгаврын CRUD
│   │   │   │   ├── [id]/route.ts     # Даалгаврын дэлгэрэнгүй
│   │   │   │   └── [id]/submit/route.ts # Даалгавар илгээх
│   │   │   ├── collaboration/        # Хамтын ажиллагаа
│   │   │   │   ├── sessions/route.ts # Сессийн удирдлага
│   │   │   │   └── socket/route.ts   # Socket.io холболт
│   │   │   └── gamification/         # Гаминфикаци
│   │   │       ├── xp/route.ts       # XP удирдлага
│   │   │       ├── achievements/route.ts # Амжилтууд
│   │   │       └── leaderboard/route.ts # Leaderboard
│   │   ├── dashboard/                 # Хяналтын самбар
│   │   │   ├── overview/page.tsx     # Ерөнхий харах
│   │   │   ├── profile/page.tsx      # Профайл
│   │   │   ├── settings/page.tsx     # Тохиргоо
│   │   │   ├── assignments/page.tsx   # Даалгаврууд
│   │   │   ├── collaboration/page.tsx # Хамтын ажиллагаа
│   │   │   ├── gamification/page.tsx  # Гаминфикаци
│   │   │   ├── analytics/page.tsx     # Аналитик
│   │   │   ├── github/page.tsx        # GitHub интеграци
│   │   │   └── admin/                 # Админ панел
│   │   │       ├── role-requests/page.tsx # Эрх хүсэлтүүд
│   │   │       ├── users/page.tsx     # Хэрэглэгч удирдлага
│   │   │       └── settings/page.tsx  # Системийн тохиргоо
│   │   ├── globals.css                # Глобал CSS
│   │   ├── layout.tsx                 # Үндсэн layout
│   │   └── page.tsx                   # Нүүр хуудас
│   ├── components/                    # React компонентууд
│   │   ├── ui/                        # UI компонентууд
│   │   │   ├── button.tsx             # Товч
│   │   │   ├── card.tsx               # Карт
│   │   │   ├── input.tsx              # Оруулах талбар
│   │   │   ├── dialog.tsx             # Диалог
│   │   │   ├── tabs.tsx               # Таб
│   │   │   ├── badge.tsx              # Тэмдэг
│   │   │   ├── progress.tsx           # Ахицын баар
│   │   │   ├── avatar.tsx            # Аватар
│   │   │   ├── dropdown-menu.tsx      # Доошоо унах цэс
│   │   │   ├── select.tsx             # Сонгох талбар
│   │   │   ├── switch.tsx             # Солих товч
│   │   │   ├── textarea.tsx           # Текст талбар
│   │   │   ├── toast.tsx              # Мэдэгдэл
│   │   │   ├── alert.tsx              # Анхааруулга
│   │   │   ├── skeleton.tsx           # Скелетон
│   │   │   ├── theme-toggle.tsx       # Сэдвийн солих
│   │   │   └── command.tsx            # Команд талбар
│   │   ├── layout/                    # Layout компонентууд
│   │   │   ├── DashboardLayout.tsx    # Самбарын layout
│   │   │   ├── Sidebar.tsx            # Хажуугийн цэс
│   │   │   ├── Header.tsx             # Толгой
│   │   │   ├── Navigation.tsx         # Навигаци
│   │   │   ├── Breadcrumb.tsx         # Breadcrumb
│   │   │   └── MobileNav.tsx          # Мобайл навигаци
│   │   ├── providers/                 # Context provider-ууд
│   │   │   ├── SessionProvider.tsx   # Сессийн provider
│   │   │   ├── ThemeProvider.tsx     # Сэдвийн provider
│   │   │   ├── LanguageProvider.tsx  # Хэлний provider
│   │   │   ├── FontSizeProvider.tsx   # Үсгийн хэмжээний provider
│   │   │   └── CompactModeProvider.tsx # Компакт горимын provider
│   │   ├── auth/                      # Аутентификаци
│   │   │   ├── LoginForm.tsx          # Нэвтрэх форм
│   │   │   ├── SignupForm.tsx        # Бүртгүүлэх форм
│   │   │   ├── AuthButtons.tsx        # Аутентификацийн товчнууд
│   │   │   └── ProtectedRoute.tsx     # Хамгаалагдсан зам
│   │   ├── assignments/               # Даалгаврууд
│   │   │   ├── AssignmentCard.tsx     # Даалгаврын карт
│   │   │   ├── AssignmentList.tsx      # Даалгаврын жагсаалт
│   │   │   ├── AssignmentForm.tsx      # Даалгавар үүсгэх форм
│   │   │   ├── AssignmentDetails.tsx  # Даалгаврын дэлгэрэнгүй
│   │   │   ├── SubmissionForm.tsx    # Илгээх форм
│   │   │   ├── GradingInterface.tsx   # Үнэлэх интерфейс
│   │   │   └── TestCaseManager.tsx    # Тест кейс удирдлага
│   │   ├── editor/                    # Код бичүүлэгч
│   │   │   ├── MonacoEditor.tsx       # Monaco Editor
│   │   │   ├── CodeEditor.tsx         # Код бичүүлэгч
│   │   │   ├── FileExplorer.tsx       # Файл explorer
│   │   │   ├── Terminal.tsx           # Terminal
│   │   │   └── OutputPanel.tsx        # Гаралтын панел
│   │   ├── collaboration/             # Хамтын ажиллагаа
│   │   │   ├── CollaborativeEditor.tsx # Хамтран код бичих
│   │   │   ├── SessionManager.tsx     # Сессийн удирдлага
│   │   │   ├── ParticipantList.tsx    # Оролцогчдын жагсаалт
│   │   │   ├── ChatPanel.tsx           # Чат панел
│   │   │   ├── VoiceChat.tsx           # Дуу хоолой
│   │   │   ├── VideoCall.tsx           # Видео дуудлага
│   │   │   ├── ScreenShare.tsx        # Дэлгэц хуваалцах
│   │   │   ├── Whiteboard.tsx          # Цагаан самбар
│   │   │   └── SessionRecording.tsx   # Сессийн бичлэг
│   │   ├── gamification/              # Гаминфикаци
│   │   │   ├── XPDisplay.tsx          # XP харуулах
│   │   │   ├── LevelProgress.tsx      # Түвшин ахиц
│   │   │   ├── AchievementCard.tsx    # Амжилтын карт
│   │   │   ├── AchievementList.tsx    # Амжилтын жагсаалт
│   │   │   ├── Leaderboard.tsx        # Leaderboard
│   │   │   ├── ChallengeCard.tsx      # Сорилгын карт
│   │   │   ├── ProgressChart.tsx      # Ахицын график
│   │   │   ├── ActivityHeatmap.tsx    # Үйл ажиллагааны heatmap
│   │   │   └── StreakDisplay.tsx      # Streak харуулах
│   │   ├── github/                    # GitHub интеграци
│   │   │   ├── GitHubProfile.tsx      # GitHub профайл
│   │   │   ├── RepositoryList.tsx     # Repository жагсаалт
│   │   │   ├── CommitTracker.tsx      # Commit хянах
│   │   │   ├── PullRequestManager.tsx # Pull Request удирдлага
│   │   │   ├── CICDDashboard.tsx      # CI/CD самбар
│   │   │   ├── ContributionCalendar.tsx # Contribution календар
│   │   │   └── PortfolioShowcase.tsx  # Portfolio харуулах
│   │   ├── analytics/                 # Аналитик
│   │   │   ├── ProgressChart.tsx      # Ахицын график
│   │   │   ├── SkillRadar.tsx         # Ур чадварын radar
│   │   │   ├── ActivityHeatmap.tsx    # Үйл ажиллагааны heatmap
│   │   │   ├── PerformanceMetrics.tsx # Гүйцэтгэлийн метрик
│   │   │   ├── ClassAnalytics.tsx     # Хичээлийн аналитик
│   │   │   ├── StudentProgress.tsx    # Оюутны ахиц
│   │   │   └── ReportGenerator.tsx    # Тайлан үүсгэх
│   │   ├── admin/                     # Админ
│   │   │   ├── RoleRequestList.tsx    # Эрх хүсэлтүүдийн жагсаалт
│   │   │   ├── UserManagement.tsx     # Хэрэглэгч удирдлага
│   │   │   ├── SystemSettings.tsx     # Системийн тохиргоо
│   │   │   ├── AnalyticsDashboard.tsx # Аналитик самбар
│   │   │   └── SecurityPanel.tsx      # Аюулгүй байдлын панел
│   │   └── profile/                   # Профайл
│   │       ├── ProfileCard.tsx        # Профайлын карт
│   │       ├── AchievementShowcase.tsx # Амжилтын үзүүлэлт
│   │       ├── SkillLevels.tsx        # Ур чадварын түвшин
│   │       ├── ActivityFeed.tsx       # Үйл ажиллагааны feed
│   │       ├── RoleRequestForm.tsx    # Эрх хүсэх форм
│   │       └── CustomizationPanel.tsx # Тохиргооны панел
│   ├── lib/                           # Утилит функцууд
│   │   ├── auth.ts                    # Аутентификаци тохиргоо
│   │   ├── db.ts                      # Мэдээллийн сан холболт
│   │   ├── i18n.ts                    # Олон хэлний дэмжлэг
│   │   ├── theme-optimization.ts      # Сэдвийн оновчтой болгох
│   │   ├── navigation.ts              # Навигацийн тохиргоо
│   │   ├── gamification/               # Гаминфикацийн логик
│   │   │   ├── achievement-system.ts  # Амжилтын систем
│   │   │   ├── xp-calculator.ts       # XP тооцоолуур
│   │   │   ├── level-system.ts        # Түвшингийн систем
│   │   │   └── leaderboard.ts         # Leaderboard логик
│   │   ├── collaboration/             # Хамтын ажиллагааны логик
│   │   │   ├── session-manager.ts     # Сессийн удирдлага
│   │   │   ├── conflict-resolution.ts # Зөрчил шийдвэрлэх
│   │   │   └── real-time-sync.ts      # Бодит цагийн синхрончлох
│   │   └── analytics/                 # Аналитик логик
│   │       ├── data-aggregation.ts    # Өгөгдөл цуглуулах
│   │       ├── chart-utils.ts         # Графикийн утилит
│   │       └── report-generator.ts    # Тайлан үүсгэх
│   ├── store/                         # Zustand stores
│   │   ├── ui.ts                      # UI state
│   │   └── settings.ts                # Тохиргооны state
│   └── types/                         # TypeScript тодорхойлолт
│       ├── auth.ts                    # Аутентификацийн төрөл
│       ├── user.ts                    # Хэрэглэгчийн төрөл
│       ├── assignment.ts               # Даалгаврын төрөл
│       ├── collaboration.ts           # Хамтын ажиллагааны төрөл
│       ├── gamification.ts             # Гаминфикацийн төрөл
│       ├── github.ts                   # GitHub төрөл
│       └── analytics.ts               # Аналитик төрөл
├── prisma/                            # Prisma схем
│   ├── schema.prisma                  # Мэдээллийн сан схем
│   └── seed.ts                        # Анхны өгөгдөл
├── docs/                              # Баримт бичиг
│   ├── ARCHITECTURE_MN.md             # Архитектур (Монгол)
│   ├── ARCHITECTURE_EN.md             # Архитектур (Англи)
│   ├── FEATURES_MN.md                 # Функцууд (Монгол)
│   ├── ENVIRONMENT_SETUP.md            # Орчин тохиргоо
│   └── CODE_LOCATIONS_MN.md           # Код байршил (энэ файл)
├── scripts/                           # Скриптүүд
│   ├── promote-to-admin.ts            # Админ болгох
│   ├── list-users.ts                  # Хэрэглэгчдийн жагсаалт
│   └── create-user.ts                 # Хэрэглэгч үүсгэх
├── tests/                             # Тестүүд
│   ├── unit/                          # Unit тестүүд
│   ├── integration/                    # Integration тестүүд
│   └── e2e/                           # End-to-end тестүүд
├── .env.local                         # Локаль орчин тохиргоо
├── .env.example                       # Орчин тохиргооны жишээ
├── .gitignore                         # Git ignore
├── package.json                       # NPM тохиргоо
├── next.config.js                     # Next.js тохиргоо
├── tailwind.config.js                 # Tailwind тохиргоо
├── tsconfig.json                      # TypeScript тохиргоо
├── vercel.json                        # Vercel deployment тохиргоо
└── README.md                          # Төслийн танилцуулга
```

---

## 🗂️ Функц бүрийн код байршил

### 🏠 Нүүр хуудас
```
src/app/page.tsx - Нүүр хуудас
src/components/auth/ - Нэвтрэх компонентууд
```

### 📊 Хяналтын самбар
```
src/app/dashboard/overview/page.tsx - Ерөнхий харах
src/components/layout/DashboardLayout.tsx - Самбарын layout
src/components/layout/Sidebar.tsx - Хажуугийн цэс
src/components/layout/Header.tsx - Толгой
```

### 👤 Профайл
```
src/app/dashboard/profile/page.tsx - Профайл хуудас
src/components/profile/ - Профайлын компонентууд
src/app/api/user/progress/route.ts - Ахицын API
src/app/api/user/achievements/route.ts - Амжилтын API
```

### 📝 Даалгаврууд
```
src/app/dashboard/assignments/page.tsx - Даалгаврын хуудас
src/components/assignments/ - Даалгаврын компонентууд
src/components/editor/MonacoEditor.tsx - Код бичүүлэгч
src/app/api/assignments/ - Даалгаврын API
```

### 🤝 Хамтын ажиллагаа
```
src/app/dashboard/collaboration/page.tsx - Хамтын ажиллагааны хуудас
src/components/collaboration/ - Хамтын ажиллагааны компонентууд
src/types/collaboration.ts - Хамтын ажиллагааны төрөл
src/app/api/collaboration/ - Хамтын ажиллагааны API
```

### 🎮 Гаминфикаци
```
src/app/dashboard/gamification/page.tsx - Гаминфикацийн хуудас
src/lib/gamification/ - Гаминфикацийн логик
src/components/gamification/ - Гаминфикацийн компонентууд
src/app/api/gamification/ - Гаминфикацийн API
```

### 🔗 GitHub
```
src/app/dashboard/github/page.tsx - GitHub хуудас
src/components/github/ - GitHub компонентууд
src/app/api/github/ - GitHub API
```

### 📈 Аналитик
```
src/app/dashboard/analytics/page.tsx - Аналитик хуудас
src/components/analytics/ - Аналитик компонентууд
src/lib/analytics/ - Аналитик логик
src/app/api/analytics/ - Аналитик API
```

### 👑 Админ
```
src/app/dashboard/admin/ - Админ хуудаснууд
src/components/admin/ - Админ компонентууд
src/app/api/admin/ - Админ API
```

### ⚙️ Тохиргоо
```
src/app/dashboard/settings/page.tsx - Тохиргооны хуудас
src/store/settings.ts - Тохиргооны state
src/components/providers/ - Тохиргооны provider-ууд
```

---

## 🔍 Хайлтын заавар

### Тодорхой функц хайх
1. **Даалгавар** - `src/app/dashboard/assignments/` эсвэл `src/components/assignments/`
2. **Хамтын ажиллагаа** - `src/app/dashboard/collaboration/` эсвэл `src/components/collaboration/`
3. **Гаминфикаци** - `src/app/dashboard/gamification/` эсвэл `src/lib/gamification/`
4. **GitHub** - `src/app/dashboard/github/` эсвэл `src/components/github/`
5. **Аналитик** - `src/app/dashboard/analytics/` эсвэл `src/components/analytics/`
6. **Админ** - `src/app/dashboard/admin/` эсвэл `src/components/admin/`

### API эндпоинт хайх
1. **Аутентификаци** - `src/app/api/auth/`
2. **Хэрэглэгч** - `src/app/api/user/`
3. **Даалгавар** - `src/app/api/assignments/`
4. **Хамтын ажиллагаа** - `src/app/api/collaboration/`
5. **Гаминфикаци** - `src/app/api/gamification/`
6. **GitHub** - `src/app/api/github/`
7. **Админ** - `src/app/api/admin/`

### Компонент хайх
1. **UI компонентууд** - `src/components/ui/`
2. **Layout компонентууд** - `src/components/layout/`
3. **Provider компонентууд** - `src/components/providers/`
4. **Функцийн компонентууд** - `src/components/[function-name]/`

### TypeScript төрөл хайх
1. **Аутентификаци** - `src/types/auth.ts`
2. **Хэрэглэгч** - `src/types/user.ts`
3. **Даалгавар** - `src/types/assignment.ts`
4. **Хамтын ажиллагаа** - `src/types/collaboration.ts`
5. **Гаминфикаци** - `src/types/gamification.ts`
6. **GitHub** - `src/types/github.ts`
7. **Аналитик** - `src/types/analytics.ts`

---

## 🛠️ Хөгжүүлэлтийн заавар

### Шинэ функц нэмэх
1. **API эндпоинт** - `src/app/api/[function]/route.ts`
2. **Хуудас** - `src/app/dashboard/[function]/page.tsx`
3. **Компонентууд** - `src/components/[function]/`
4. **Төрөл** - `src/types/[function].ts`
5. **Логик** - `src/lib/[function]/`

### Шинэ компонент үүсгэх
1. **UI компонент** - `src/components/ui/[component].tsx`
2. **Функцийн компонент** - `src/components/[function]/[component].tsx`
3. **Layout компонент** - `src/components/layout/[component].tsx`

### Шинэ API эндпоинт үүсгэх
1. **API файл** - `src/app/api/[endpoint]/route.ts`
2. **Төрөл** - `src/types/[endpoint].ts`
3. **Тест** - `tests/integration/[endpoint].test.ts`

---

## 📝 Код бичих дүрэм

### Файлын нэрлэх
- **Компонент** - PascalCase (жишээ: `UserProfile.tsx`)
- **API эндпоинт** - kebab-case (жишээ: `user-profile/route.ts`)
- **Төрөл** - camelCase (жишээ: `userProfile.ts`)
- **Констант** - UPPER_SNAKE_CASE (жишээ: `API_ENDPOINTS`)

### Фолдер бүтэц
- **Хуудас** - `src/app/[route]/page.tsx`
- **API** - `src/app/api/[endpoint]/route.ts`
- **Компонент** - `src/components/[category]/[component].tsx`
- **Төрөл** - `src/types/[type].ts`
- **Логик** - `src/lib/[function]/[utility].ts`

### Import дүрэм
```typescript
// 1. React болон Next.js
import React from 'react'
import { NextRequest, NextResponse } from 'next/server'

// 2. Гуравдагч сангууд
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

// 3. Локаль import-ууд
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { User } from '@/types/user'
```

---

## 🚀 Deployment файлууд

### Vercel тохиргоо
```
vercel.json - Vercel deployment тохиргоо
.env.example - Орчин тохиргооны жишээ
```

### Build тохиргоо
```
next.config.js - Next.js тохиргоо
tailwind.config.js - Tailwind CSS тохиргоо
tsconfig.json - TypeScript тохиргоо
```

### Database тохиргоо
```
prisma/schema.prisma - Мэдээллийн сан схем
prisma/seed.ts - Анхны өгөгдөл
```

---

*Энэ баримт бичиг нь CodeTracker төслийн бүх код байршил болон файлын бүтцийг тайлбарлаж байна. Шинэ функц нэмэх эсвэл код засахдаа энэ зааварчилгааг ашиглаарай.*
