# Environment Setup Guide - Орчин Тохиргооны Заавар

## 🚨 IMPORTANT: Two Environment Files - Хоёр Орчин Тохиргооны Файл

### ❌ NEVER Push These Files to GitHub - Эдгээр файлуудыг GitHub-д push хийж болохгүй:
- `.env.local` - Contains your real secrets
- `.env` - Contains sensitive data
- `dev.db` - SQLite database file

### ✅ Safe to Push - GitHub-д push хийж болох файлууд:
- `.env.example` - Example configuration only
- `docs/` - Documentation files
- `src/` - Source code
- `package.json` - Dependencies

---

## 🔧 Development Environment (.env.local)

Create this file in your project root:

```bash
# Database - Мэдээллийн сан
DATABASE_URL="file:./dev.db"

# NextAuth.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-make-it-long-and-random"

# GitHub OAuth (Get from GitHub Developer Settings)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GITHUB_TOKEN="ghp_your-personal-access-token"

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Discord OAuth (Get from Discord Developer Portal)
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"

# Email Configuration (Optional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@codetracker.com"
```

---

## 🌐 Production Environment (Vercel)

Set these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Database (PostgreSQL) - Мэдээллийн сан
DATABASE_URL="postgresql://username:password@host:port/database"
DIRECT_URL="postgresql://username:password@host:port/database"

# NextAuth.js
NEXTAUTH_URL="https://your-app-name.vercel.app"
NEXTAUTH_SECRET="production-secret-key-different-from-dev"

# GitHub OAuth (Production Apps)
GITHUB_CLIENT_ID="production-github-client-id"
GITHUB_CLIENT_SECRET="production-github-client-secret"
GITHUB_TOKEN="production-github-personal-access-token"

# Google OAuth (Production)
GOOGLE_CLIENT_ID="production-google-client-id"
GOOGLE_CLIENT_SECRET="production-google-client-secret"

# Discord OAuth (Production)
DISCORD_CLIENT_ID="production-discord-client-id"
DISCORD_CLIENT_SECRET="production-discord-client-secret"
```

---

## 🔑 How to Get OAuth Credentials

### GitHub OAuth Setup
1. Go to GitHub → Settings → Developer settings
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: CodeTracker
   - **Homepage URL**: `http://localhost:3000` (dev) / `https://your-app.vercel.app` (prod)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github` (dev) / `https://your-app.vercel.app/api/auth/callback/github` (prod)
4. Copy Client ID and Client Secret

### GitHub Personal Access Token
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Select scopes: `public_repo`, `read:user`, `user:email`
4. Copy the token (starts with `ghp_`)

### Google OAuth Setup
1. Go to Google Cloud Console
2. Create new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret

### Discord OAuth Setup
1. Go to Discord Developer Portal
2. Create new application
3. Go to OAuth2 → General
4. Add redirect URI: `http://localhost:3000/api/auth/callback/discord`
5. Copy Client ID and Client Secret

---

## 🗄️ Database Setup

### Development (SQLite)
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### Production (PostgreSQL)
```bash
# Deploy migrations
npm run db:deploy

# Generate Prisma client
npm run db:generate
```

---

## 🚀 Deployment Steps

### 1. Prepare for Production
```bash
# Build the project
npm run build

# Test locally
npm start
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set production environment variables in Vercel dashboard
```

### 3. Configure Domain (Optional)
- Go to Vercel Dashboard → Your Project → Settings → Domains
- Add your custom domain
- Update `NEXTAUTH_URL` environment variable

---

## 🔍 Environment Validation

### Check if environment is working:
```bash
# Check if .env.local exists
ls -la .env.local

# Check database connection
npm run db:studio

# Check GitHub API
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user

# Check if app starts
npm run dev
```

---

## ⚠️ Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] `.env` is in `.gitignore`
- [ ] `dev.db` is in `.gitignore`
- [ ] Production secrets are different from development
- [ ] GitHub token has minimal required permissions
- [ ] OAuth redirect URLs are correct
- [ ] Database credentials are secure

---

## 🆘 Common Issues

### "Environment variable not found"
- Check if `.env.local` exists
- Restart development server
- Check variable name spelling

### "GitHub API 403 error"
- Check if `GITHUB_TOKEN` is set
- Verify token permissions
- Check rate limit

### "Database connection failed"
- Check `DATABASE_URL` format
- Run `npm run db:generate`
- Check if database file exists

### "OAuth callback error"
- Check redirect URL in OAuth app settings
- Verify `NEXTAUTH_URL` matches your domain
- Check client ID and secret

---

## 📞 Support

If you encounter issues:
1. Check this documentation first
2. Look at the console logs
3. Check environment variables
4. Ask on GitHub Issues

Remember: **Never share your `.env.local` file or commit it to Git!**
