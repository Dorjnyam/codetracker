# CodeTracker Deployment Guide

This guide covers the complete deployment process for the CodeTracker coding education platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Vercel Deployment](#vercel-deployment)
5. [Production Configuration](#production-configuration)
6. [Monitoring Setup](#monitoring-setup)
7. [Security Configuration](#security-configuration)
8. [Performance Optimization](#performance-optimization)
9. [Backup and Recovery](#backup-and-recovery)
10. [Maintenance Procedures](#maintenance-procedures)
11. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Accounts
- [Vercel](https://vercel.com) account for hosting
- [GitHub](https://github.com) account for repository
- [PostgreSQL](https://www.postgresql.org) database (Vercel Postgres, Supabase, or Railway)
- [Redis](https://redis.io) for caching (Upstash Redis recommended)
- [Sentry](https://sentry.io) for error tracking (optional)
- [Google Analytics](https://analytics.google.com) for analytics (optional)

### Required Tools
- Node.js 18+ installed locally
- Git installed locally
- Vercel CLI installed globally: `npm install -g vercel`

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/codetracker.git
cd codetracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy the example environment file:
```bash
cp env.example .env.local
```

Configure the following required variables in `.env.local`:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"
DIRECT_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-32-character-secret-key"

# OAuth Providers (at least one required)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Email (optional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@your-domain.com"

# Redis (optional but recommended)
REDIS_URL="redis://username:password@host:port"

# Security
ENCRYPTION_KEY="your-32-character-encryption-key"
JWT_SECRET="your-jwt-secret-key"

# Monitoring (optional)
SENTRY_DSN="your-sentry-dsn"
GOOGLE_ANALYTICS_ID="your-ga-id"
```

### 4. Generate Secrets
Generate secure secrets for production:
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate ENCRYPTION_KEY
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32
```

## Database Setup

### 1. Choose Database Provider

#### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Navigate to Storage tab
3. Create a new Postgres database
4. Copy the connection string to `DATABASE_URL`

#### Option B: Supabase
1. Create account at [Supabase](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy connection string to `DATABASE_URL`

#### Option C: Railway
1. Create account at [Railway](https://railway.app)
2. Create new PostgreSQL service
3. Copy connection string to `DATABASE_URL`

### 2. Run Database Migrations
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with initial data
npx prisma db seed
```

### 3. Optimize Database
```bash
# Run database optimization
npm run db:optimize full
```

## Vercel Deployment

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy to Vercel
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 4. Configure Environment Variables in Vercel
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add all environment variables from your `.env.local`

### 5. Configure Custom Domain (Optional)
1. Go to Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Enable SSL certificate

## Production Configuration

### 1. Update Configuration
Ensure production settings in your environment variables:

```env
NODE_ENV="production"
DEBUG="false"
LOG_LEVEL="info"
ENABLE_PERFORMANCE_MONITORING="true"
SECURITY_HEADERS_ENABLED="true"
MAINTENANCE_MODE="false"
```

### 2. Configure OAuth Providers

#### GitHub OAuth Setup
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL: `https://your-domain.vercel.app/api/auth/callback/github`
4. Copy Client ID and Client Secret to environment variables

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set authorized redirect URI: `https://your-domain.vercel.app/api/auth/callback/google`
6. Copy Client ID and Client Secret to environment variables

### 3. Email Configuration
For Gmail SMTP:
1. Enable 2-factor authentication
2. Generate App Password
3. Use App Password in `EMAIL_SERVER_PASSWORD`

## Monitoring Setup

### 1. Sentry Error Tracking
1. Create account at [Sentry](https://sentry.io)
2. Create new project for Node.js
3. Copy DSN to `SENTRY_DSN` environment variable
4. Install Sentry SDK: `npm install @sentry/nextjs`

### 2. Google Analytics
1. Create account at [Google Analytics](https://analytics.google.com)
2. Create new property
3. Copy Measurement ID to `GOOGLE_ANALYTICS_ID`

### 3. Uptime Monitoring
Set up uptime monitoring with services like:
- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://pingdom.com)
- [StatusCake](https://statuscake.com)

Configure monitoring for:
- Main application URL
- Health check endpoint: `/api/health`
- Database connectivity

## Security Configuration

### 1. Security Headers
The application automatically sets security headers. Verify they're working:
```bash
curl -I https://your-domain.vercel.app
```

### 2. Content Security Policy
Review and customize CSP in `src/lib/security.ts` if needed.

### 3. Rate Limiting
Configure rate limiting in `src/lib/security.ts`:
```typescript
export const rateLimitMiddleware = (maxRequests: number = 100, windowMs: number = 900000)
```

### 4. Input Validation
All API endpoints use Zod validation schemas for input sanitization.

### 5. Authentication Security
- JWT tokens are used for authentication
- Sessions have configurable expiration
- Password strength validation is enforced

## Performance Optimization

### 1. Database Optimization
Run database optimization regularly:
```bash
npm run db:optimize full
```

### 2. Caching Strategy
- Redis is used for session storage and caching
- API responses are cached where appropriate
- Static assets are cached by Vercel CDN

### 3. Image Optimization
- Next.js Image component is used for automatic optimization
- Images are served through Vercel's CDN

### 4. Code Splitting
- Next.js automatically handles code splitting
- Dynamic imports are used for heavy components

### 5. Bundle Analysis
Analyze bundle size:
```bash
npm run build
npm run analyze
```

## Backup and Recovery

### 1. Database Backups
Set up automated database backups:

#### Vercel Postgres
- Automatic backups are enabled by default
- Manual backups can be created from dashboard

#### Supabase
- Automatic backups are enabled
- Point-in-time recovery available

#### Railway
- Set up automated backups in dashboard
- Configure backup retention period

### 2. Application Backups
- Code is backed up in Git repository
- Environment variables are stored in Vercel dashboard
- Database schema is versioned in Prisma migrations

### 3. Recovery Procedures
1. **Database Recovery**: Restore from latest backup
2. **Application Recovery**: Redeploy from Git repository
3. **Environment Recovery**: Restore environment variables from Vercel dashboard

## Maintenance Procedures

### 1. Regular Maintenance Tasks

#### Daily
- Monitor error logs in Sentry
- Check application health endpoint
- Review performance metrics

#### Weekly
- Review security logs
- Check database performance
- Update dependencies if needed

#### Monthly
- Run database optimization
- Review and update security patches
- Analyze usage metrics

### 2. Dependency Updates
```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Update Prisma client
npx prisma generate
```

### 3. Database Maintenance
```bash
# Run database optimization
npm run db:optimize full

# Check database health
npm run db:optimize health

# Clean up old data
npm run db:optimize cleanup
```

### 4. Security Updates
- Monitor security advisories
- Update dependencies regularly
- Review and update security configurations

## Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
npm install

# Regenerate Prisma client
npx prisma generate
```

#### 2. Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database provider status
- Ensure database is accessible from Vercel

#### 3. Authentication Issues
- Verify OAuth provider configurations
- Check `NEXTAUTH_URL` matches your domain
- Ensure `NEXTAUTH_SECRET` is set

#### 4. Performance Issues
- Check database query performance
- Monitor memory usage
- Review error logs for bottlenecks

### Debug Mode
Enable debug mode for troubleshooting:
```env
DEBUG="true"
LOG_LEVEL="debug"
NODE_ENV="development"
```

### Health Checks
Monitor application health:
- `/api/health` - Application health
- `/api/metrics` - Performance metrics
- `/api/system` - System information

### Logs
- Application logs are available in Vercel dashboard
- Error tracking is available in Sentry
- Database logs are available in database provider dashboard

## Support

For additional support:
1. Check the troubleshooting section above
2. Review application logs
3. Check Sentry for error details
4. Contact the development team

## Security Considerations

### Production Security Checklist
- [ ] All environment variables are set securely
- [ ] OAuth providers are configured correctly
- [ ] Security headers are enabled
- [ ] Rate limiting is configured
- [ ] Input validation is working
- [ ] Authentication is secure
- [ ] Database access is restricted
- [ ] Error tracking is configured
- [ ] Monitoring is set up
- [ ] Backup procedures are in place

### Regular Security Reviews
- Review access logs monthly
- Update dependencies regularly
- Monitor security advisories
- Conduct penetration testing annually
- Review and update security policies

This deployment guide ensures a secure, performant, and maintainable production environment for the CodeTracker platform.
