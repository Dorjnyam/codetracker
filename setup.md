# CodeTracker Setup Guide

## 🚀 Quick Start Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your actual values
# Required: DATABASE_URL, NEXTAUTH_SECRET
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```

## 📋 Required Environment Variables

### Essential (Required)
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret for NextAuth.js

### OAuth Providers (Optional)
- `GITHUB_ID` & `GITHUB_SECRET` - GitHub OAuth
- `GOOGLE_ID` & `GOOGLE_SECRET` - Google OAuth  
- `DISCORD_ID` & `DISCORD_SECRET` - Discord OAuth

### Additional Services (Optional)
- `REDIS_URL` & `REDIS_TOKEN` - Upstash Redis
- `RESEND_API_KEY` - Email notifications
- `CLOUDINARY_*` - File uploads

## 🗄️ Database Providers (Free Tiers)

### Vercel Postgres (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new Postgres database
3. Copy the connection string to `DATABASE_URL`

### Supabase (Alternative)
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Get the connection string from Settings > Database

### Neon (Alternative)
1. Go to [Neon](https://neon.tech)
2. Create a new database
3. Copy the connection string

## 🔐 OAuth Setup

### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### Discord OAuth
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create new application
3. Go to OAuth2 section
4. Add redirect URI: `http://localhost:3000/api/auth/callback/discord`

## 🚀 Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial CodeTracker setup"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repository
3. Add environment variables in Vercel dashboard
4. Deploy!

### 3. Connect Database
1. In Vercel dashboard, go to Storage tab
2. Create new Postgres database
3. Update `DATABASE_URL` in environment variables
4. Redeploy

## 🧪 Testing the Setup

### 1. Check Database Connection
```bash
npx prisma studio
```

### 2. Test Authentication
- Visit `http://localhost:3000/auth/signin`
- Try signing in with OAuth providers

### 3. Test API Routes
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test database connection
curl http://localhost:3000/api/test/db
```

## 🔧 Development Tools

### Prisma Studio
```bash
npx prisma studio
```
- Visual database browser
- Edit data directly
- View relationships

### Database Reset
```bash
# Reset database (WARNING: Deletes all data)
npx prisma db push --force-reset

# Reset and seed
npx prisma db push --force-reset && npx prisma db seed
```

### Type Generation
```bash
# Generate Prisma client after schema changes
npx prisma generate

# Check for type errors
npm run type-check
```

## 📁 Project Structure

```
codetracker/
├── src/
│   ├── app/                 # Next.js 14 App Router
│   │   ├── (auth)/         # Authentication routes
│   │   ├── (dashboard)/    # Protected dashboard routes
│   │   ├── api/            # API routes
│   │   └── globals.css     # Global styles
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn/ui components
│   │   ├── forms/          # Form components
│   │   ├── dashboard/      # Dashboard components
│   │   └── coding/         # Code editor components
│   ├── lib/                # Utility libraries
│   │   ├── auth.ts         # NextAuth configuration
│   │   ├── db.ts           # Database connection
│   │   ├── utils.ts        # Utility functions
│   │   └── validations/    # Zod schemas
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand stores
│   ├── types/              # TypeScript definitions
│   └── server/             # Server-side utilities
├── prisma/
│   └── schema.prisma       # Database schema
├── public/                 # Static assets
└── package.json            # Dependencies
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```bash
# Check if DATABASE_URL is set
echo $DATABASE_URL

# Test connection
npx prisma db push
```

#### 2. OAuth Provider Issues
- Check callback URLs match exactly
- Verify client ID and secret
- Ensure OAuth app is not in development mode

#### 3. Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 4. TypeScript Errors
```bash
# Regenerate Prisma client
npx prisma generate

# Check types
npm run type-check
```

## 📚 Next Steps

After successful setup:

1. **Create your first class** - Set up a classroom
2. **Add students** - Invite students with invite codes
3. **Create assignments** - Build coding challenges
4. **Test submissions** - Verify the grading system
5. **Explore features** - Try real-time collaboration

## 🆘 Need Help?

- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Prisma documentation](https://www.prisma.io/docs)
- Read [NextAuth.js docs](https://next-auth.js.org/getting-started/introduction)
- Join our Discord community for support

---

**Happy Coding! 🎉**
