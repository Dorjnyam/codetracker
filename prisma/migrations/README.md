# Database Migrations Guide

## 🗄️ Migration Commands

### Initial Setup
```bash
# Generate Prisma client
npx prisma generate

# Create initial migration
npx prisma migrate dev --name init

# Apply migrations to database
npx prisma migrate deploy
```

### Development Workflow
```bash
# Make schema changes in schema.prisma
# Then run:
npx prisma migrate dev --name describe_your_changes

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Reset and seed with sample data
npx prisma migrate reset --force-reset && npm run seed
```

### Production Deployment
```bash
# Generate client for production
npx prisma generate

# Deploy migrations to production
npx prisma migrate deploy

# Verify database connection
npx prisma db pull
```

## 📊 Database Schema Overview

### Core Models
- **User**: Authentication and user profiles
- **Class**: Course/classroom management
- **Assignment**: Coding challenges and projects
- **Submission**: Student code submissions
- **CodeReview**: Peer review system

### Gamification Models
- **Achievement**: Badge definitions
- **UserAchievement**: User progress tracking
- **Activity**: XP and activity logging

### Collaboration Models
- **Collaboration**: Real-time coding sessions
- **ForumPost/ForumComment**: Discussion system

### System Models
- **Notification**: User notifications
- **Account/Session**: NextAuth.js integration

## 🔍 Performance Indexes

### User Table
- `email` - Fast user lookup
- `role` - Role-based queries
- `totalXP` - Leaderboard queries
- `level` - Level-based filtering
- `streak` - Streak tracking
- `lastActiveDate` - Activity queries

### Assignment Table
- `classId` - Class-specific assignments
- `creatorId` - Teacher's assignments
- `difficulty` - Difficulty filtering
- `language` - Language filtering
- `dueDate` - Deadline queries
- `isActive` - Active assignment queries

### Submission Table
- `assignmentId` - Assignment submissions
- `studentId` - Student submissions
- `status` - Status filtering
- `score` - Grade queries
- `submittedAt` - Time-based queries
- `isLate` - Late submission tracking

### Activity Table
- `userId` - User activity history
- `type` - Activity type filtering
- `createdAt` - Time-based queries
- `xpEarned` - XP calculations

## 🚀 Migration Best Practices

### 1. Always Backup Production Data
```bash
# Create database backup before migrations
pg_dump your_database > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Test Migrations Locally First
```bash
# Test on development database
npx prisma migrate dev --name test_migration

# Verify schema changes
npx prisma db pull
```

### 3. Use Descriptive Migration Names
```bash
# Good
npx prisma migrate dev --name add_user_preferences

# Bad
npx prisma migrate dev --name update1
```

### 4. Handle Data Migrations Carefully
```sql
-- Example: Migrating existing data
UPDATE users SET level = FLOOR(totalXP / 100) + 1 WHERE level = 1;
```

## 🔧 Troubleshooting

### Common Issues

#### Migration Conflicts
```bash
# Resolve migration conflicts
npx prisma migrate resolve --applied "migration_name"

# Reset and start fresh
npx prisma migrate reset
```

#### Database Connection Issues
```bash
# Check connection string
echo $DATABASE_URL

# Test connection
npx prisma db pull
```

#### Schema Drift
```bash
# Detect schema differences
npx prisma db pull

# Compare with schema.prisma
npx prisma format
```

## 📈 Performance Optimization

### Query Optimization
```typescript
// Use select to limit fields
const users = await db.user.findMany({
  select: { id: true, name: true, totalXP: true }
});

// Use include carefully
const assignments = await db.assignment.findMany({
  include: { 
    submissions: { 
      select: { id: true, score: true } 
    } 
  }
});
```

### Index Usage
- Always query on indexed fields when possible
- Use compound indexes for multi-field queries
- Monitor query performance with `EXPLAIN ANALYZE`

### Connection Pooling
```typescript
// Configure connection pool
const db = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + "?connection_limit=5&pool_timeout=20"
    }
  }
});
```
