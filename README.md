# CodeTracker - Coding Education Platform

A comprehensive coding education platform built with Next.js 14, featuring real-time collaboration, gamification, analytics, and GitHub integration.

## 🚀 Features

### Core Features
- **Authentication & Authorization** - Secure OAuth and email-based authentication
- **Assignment Management** - Create, distribute, and grade coding assignments
- **Real-time Collaboration** - Live coding sessions with multiple participants
- **Gamification System** - XP, achievements, leaderboards, and progress tracking
- **Analytics Dashboard** - Comprehensive insights for students, teachers, and admins
- **GitHub Integration** - Repository management, commit tracking, and CI/CD
- **Forum System** - Discussion boards and Q&A functionality

### Technical Features
- **Modern Tech Stack** - Next.js 14, TypeScript, Prisma, Tailwind CSS
- **Real-time Communication** - Socket.io for live collaboration
- **Performance Monitoring** - Built-in performance tracking and optimization
- **Security Hardening** - Rate limiting, input validation, and security headers
- **Comprehensive Testing** - Unit, integration, and E2E tests
- **Production Ready** - Optimized for deployment with monitoring and backup

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Redis (optional, for caching)
- Git

## 🛠️ Installation

### 1. Clone Repository
```bash
git clone https://github.com/your-username/codetracker.git
cd codetracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp env.example .env.local
```

Configure your environment variables in `.env.local`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/codetracker"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers (at least one required)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Email (optional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@codetracker.com"
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:coverage
```

### End-to-End Tests
```bash
npm run test:e2e
```

### Watch Mode
```bash
npm run test:watch
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy to Preview**
```bash
npm run deploy:preview
```

3. **Deploy to Production**
```bash
npm run deploy:production
```

4. **Configure Environment Variables**
   - Go to your Vercel dashboard
   - Select your project
   - Add environment variables from your `.env.local`

### Manual Deployment

1. **Build Application**
```bash
npm run build
```

2. **Start Production Server**
```bash
npm start
```

For detailed deployment instructions, see [DEPLOYMENT.md](docs/DEPLOYMENT.md).

## 📊 Monitoring & Analytics

### Health Checks
- `/api/health` - Application health status
- `/api/metrics` - Performance metrics
- `/api/system` - System information

### Performance Monitoring
```bash
# Analyze bundle size
npm run analyze

# Run Lighthouse audit
npm run performance:lighthouse
```

### Database Optimization
```bash
# Run full database optimization
npm run db:optimize:full

# Check database health
npm run db:optimize:health

# Clean up old data
npm run db:optimize:cleanup
```

## 🔧 Maintenance

### Backup & Recovery
```bash
# Create backup
npm run maintenance:backup create

# List backups
npm run maintenance:backup list

# Restore from backup
npm run maintenance:backup restore backup-file.json
```

### Security Audits
```bash
# Run security audit
npm run security:audit

# Fix security issues
npm run security:fix
```

### Database Maintenance
```bash
# Run database optimization
npm run db:optimize:full

# Check database health
npm run db:optimize:health
```

## 📚 Documentation

- [Deployment Guide](docs/DEPLOYMENT.md) - Complete deployment instructions
- [API Documentation](docs/API.md) - API endpoints and usage
- [Database Schema](docs/DATABASE.md) - Database structure and relationships
- [Security Guide](docs/SECURITY.md) - Security best practices
- [Contributing Guide](docs/CONTRIBUTING.md) - How to contribute to the project

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Real-time**: Socket.io
- **State Management**: Zustand
- **UI Components**: Radix UI, Shadcn/ui
- **Testing**: Jest, Playwright
- **Deployment**: Vercel

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── (auth)/           # Authentication pages
├── components/            # React components
│   ├── ui/               # UI components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   ├── gamification/     # Gamification components
│   ├── collaboration/    # Collaboration components
│   ├── analytics/        # Analytics components
│   └── github/           # GitHub integration components
├── lib/                  # Utility libraries
│   ├── auth.ts          # Authentication configuration
│   ├── db.ts            # Database connection
│   ├── config.ts        # Environment configuration
│   ├── logger.ts        # Logging system
│   ├── errors.ts        # Error handling
│   ├── security.ts      # Security utilities
│   ├── monitoring.ts    # Performance monitoring
│   └── testing.ts       # Testing utilities
├── types/               # TypeScript type definitions
└── hooks/              # Custom React hooks
```

## 🔐 Security Features

- **Authentication**: OAuth 2.0, JWT tokens, secure sessions
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Zod schemas for all inputs
- **Rate Limiting**: Configurable rate limits for API endpoints
- **Security Headers**: CSP, HSTS, XSS protection
- **Data Encryption**: Encryption at rest and in transit
- **Audit Logging**: Comprehensive security event logging

## 🎯 Performance Features

- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js Image component
- **Caching**: Redis caching for sessions and data
- **Database Optimization**: Indexes, query optimization
- **CDN**: Vercel CDN for static assets
- **Monitoring**: Real-time performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [docs](docs/) folder
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the development team

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core authentication system
- ✅ Assignment management
- ✅ Real-time collaboration
- ✅ Gamification system
- ✅ Analytics dashboard
- ✅ GitHub integration

### Phase 2 (Planned)
- 🔄 Mobile app (React Native)
- 🔄 Advanced AI features
- 🔄 Video conferencing integration
- 🔄 Advanced analytics
- 🔄 Multi-language support

### Phase 3 (Future)
- 🔄 Enterprise features
- 🔄 Advanced security
- 🔄 Scalability improvements
- 🔄 International expansion

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Vercel team for the deployment platform
- All contributors and users

---

**Built with ❤️ for the coding education community**