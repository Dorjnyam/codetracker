# Database Relationships & Architecture

## 🏗️ Entity Relationship Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    User     │    │    Class    │    │ Assignment │
│             │    │             │    │             │
│ - id        │    │ - id        │    │ - id        │
│ - email     │    │ - name      │    │ - title     │
│ - role      │    │ - ownerId   │    │ - classId   │
│ - totalXP   │    │ - inviteCode│    │ - creatorId │
│ - level     │    │ - isActive  │    │ - difficulty│
│ - streak    │    │             │    │ - language  │
└─────────────┘    └─────────────┘    └─────────────┘
       │                  │                  │
       │                  │                  │
       │ 1:N             │ 1:N              │ 1:N
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ClassMember  │    │ Assignment │    │ Submission │
│             │    │            │    │            │
│ - classId   │    │ - classId  │    │ - assignmentId│
│ - userId    │    │ - creatorId │    │ - studentId │
│ - role      │    │ - title    │    │ - code      │
│ - joinedAt  │    │ - dueDate  │    │ - status    │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 🔗 Core Relationships

### 1. User Management
```typescript
User {
  // Self-referencing relationships
  ownedClasses: Class[]           // 1:N - Teacher owns classes
  classMembers: ClassMember[]     // 1:N - User can be in multiple classes
  
  // Assignment relationships
  assignments: Assignment[]        // 1:N - Teacher creates assignments
  submissions: Submission[]       // 1:N - Student submits assignments
  
  // Gamification
  achievements: UserAchievement[] // 1:N - User earns achievements
  activities: Activity[]          // 1:N - User activity history
  
  // Social features
  givenReviews: CodeReview[]      // 1:N - User reviews others' code
  receivedReviews: CodeReview[]   // 1:N - User receives reviews
  forumPosts: ForumPost[]         // 1:N - User creates forum posts
  forumComments: ForumComment[]  // 1:N - User comments on posts
  
  // System
  notifications: Notification[]   // 1:N - User receives notifications
  accounts: Account[]            // 1:N - OAuth accounts
  sessions: Session[]            // 1:N - User sessions
}
```

### 2. Class Management
```typescript
Class {
  owner: User                    // N:1 - Class has one owner (teacher)
  members: ClassMember[]          // 1:N - Class has multiple members
  assignments: Assignment[]       // 1:N - Class has multiple assignments
  forums: ForumPost[]            // 1:N - Class has forum discussions
}

ClassMember {
  class: Class                   // N:1 - Member belongs to one class
  user: User                      // N:1 - Member is one user
  // Composite unique constraint: (classId, userId)
}
```

### 3. Assignment System
```typescript
Assignment {
  class: Class                   // N:1 - Assignment belongs to one class
  creator: User                  // N:1 - Assignment created by one teacher
  submissions: Submission[]       // 1:N - Assignment has multiple submissions
  collaborations: Collaboration[] // 1:N - Assignment can have collaborations
  codeReviews: CodeReview[]      // 1:N - Assignment can have reviews
}

Submission {
  assignment: Assignment          // N:1 - Submission belongs to one assignment
  student: User                  // N:1 - Submission made by one student
  codeReviews: CodeReview[]      // 1:N - Submission can have multiple reviews
}
```

### 4. Gamification System
```typescript
Achievement {
  userAchievements: UserAchievement[] // 1:N - Achievement can be earned by many users
}

UserAchievement {
  user: User                     // N:1 - Achievement earned by one user
  achievement: Achievement        // N:1 - Achievement is one type
  // Composite unique constraint: (userId, achievementId)
}

Activity {
  user: User                     // N:1 - Activity belongs to one user
}
```

### 5. Collaboration & Social Features
```typescript
Collaboration {
  assignment: Assignment         // N:1 - Collaboration for one assignment
  participants: User[]           // N:N - Multiple users can collaborate
}

CodeReview {
  submission?: Submission        // N:1 - Review can be for one submission
  assignment?: Assignment        // N:1 - Review can be for one assignment
  reviewer: User                 // N:1 - Review made by one user
  reviewee: User                 // N:1 - Review received by one user
}

ForumPost {
  class: Class                   // N:1 - Post belongs to one class
  author: User                   // N:1 - Post created by one user
  comments: ForumComment[]        // 1:N - Post has multiple comments
}

ForumComment {
  post: ForumPost                // N:1 - Comment belongs to one post
  author: User                  // N:1 - Comment made by one user
  parent?: ForumComment          // N:1 - Comment can reply to another comment
  replies: ForumComment[]        // 1:N - Comment can have multiple replies
}
```

## 🔄 Cascade Delete Rules

### Safe Cascades (Recommended)
```typescript
// When user is deleted, delete their:
- accounts (OAuth data)
- sessions (login sessions)
- activities (activity history)
- notifications (user notifications)
- forumComments (comments they made)
- givenReviews (reviews they gave)

// When class is deleted, delete:
- classMembers (memberships)
- assignments (class assignments)
- forums (class discussions)

// When assignment is deleted, delete:
- submissions (student submissions)
- collaborations (assignment collaborations)
- codeReviews (assignment reviews)
```

### Preserve Data (No Cascade)
```typescript
// When user is deleted, preserve:
- ownedClasses (transfer ownership)
- assignments (keep for grading)
- submissions (keep for records)
- receivedReviews (keep feedback)
- forumPosts (keep discussions)
- achievements (keep earned badges)
```

## 📊 Data Integrity Constraints

### Unique Constraints
```sql
-- User uniqueness
UNIQUE(email)
UNIQUE(username)

-- Class membership uniqueness
UNIQUE(classId, userId)

-- Achievement uniqueness per user
UNIQUE(userId, achievementId)

-- Class invite code uniqueness
UNIQUE(inviteCode)

-- Collaboration room uniqueness
UNIQUE(roomId)
```

### Foreign Key Constraints
```sql
-- All foreign keys have proper constraints
-- Cascade deletes are carefully applied
-- Referential integrity is maintained
```

## 🚀 Performance Optimizations

### Indexing Strategy
```sql
-- User table indexes
INDEX(email)           -- Fast user lookup
INDEX(role)            -- Role-based queries
INDEX(totalXP)         -- Leaderboard queries
INDEX(level)           -- Level-based filtering
INDEX(streak)          -- Streak tracking
INDEX(lastActiveDate)  -- Activity queries

-- Assignment table indexes
INDEX(classId)         -- Class-specific assignments
INDEX(creatorId)       -- Teacher's assignments
INDEX(difficulty)       -- Difficulty filtering
INDEX(language)        -- Language filtering
INDEX(dueDate)         -- Deadline queries
INDEX(isActive)        -- Active assignment queries

-- Submission table indexes
INDEX(assignmentId)    -- Assignment submissions
INDEX(studentId)      -- Student submissions
INDEX(status)          -- Status filtering
INDEX(score)           -- Grade queries
INDEX(submittedAt)     -- Time-based queries
INDEX(isLate)          -- Late submission tracking

-- Activity table indexes
INDEX(userId)          -- User activity history
INDEX(type)            -- Activity type filtering
INDEX(createdAt)        -- Time-based queries
INDEX(xpEarned)        -- XP calculations

-- Notification table indexes
INDEX(userId)          -- User notifications
INDEX(isRead)          -- Unread notifications
INDEX(type)            -- Notification type filtering
INDEX(createdAt)       -- Recent notifications
```

### Query Optimization Patterns
```typescript
// Efficient user queries
const userWithStats = await db.user.findUnique({
  where: { email },
  include: {
    _count: {
      select: {
        submissions: true,
        assignments: true,
        activities: true,
      }
    }
  }
});

// Efficient assignment queries with submissions
const assignmentWithSubmissions = await db.assignment.findMany({
  where: { classId },
  include: {
    submissions: {
      select: { id: true, score: true, status: true },
      take: 10
    },
    _count: {
      select: { submissions: true }
    }
  }
});

// Efficient leaderboard queries
const leaderboard = await db.user.findMany({
  where: { role: 'STUDENT' },
  orderBy: { totalXP: 'desc' },
  select: { id: true, name: true, totalXP: true, level: true },
  take: 50
});
```

## 🔒 Security Considerations

### Data Access Patterns
```typescript
// Role-based access control
const userCanAccessClass = (user: User, classId: string) => {
  return user.role === 'ADMIN' || 
         user.ownedClasses.some(c => c.id === classId) ||
         user.classMembers.some(cm => cm.classId === classId);
};

// Assignment access control
const userCanAccessAssignment = (user: User, assignment: Assignment) => {
  return user.role === 'ADMIN' ||
         assignment.creatorId === user.id ||
         user.classMembers.some(cm => cm.classId === assignment.classId);
};
```

### Data Validation Rules
```typescript
// User validation
- email: Must be unique and valid format
- username: Must be unique, 3-20 characters
- role: Must be STUDENT, TEACHER, or ADMIN
- totalXP: Must be non-negative
- level: Must be positive integer
- streak: Must be non-negative

// Assignment validation
- title: Required, max 100 characters
- maxScore: Must be 1-1000
- dueDate: Must be in the future when created
- maxAttempts: Must be 1-10 if specified
- timeLimit: Must be 1-300 minutes if specified

// Submission validation
- code: Required, max 1MB
- score: Must be 0-maxScore if graded
- attemptNumber: Must be positive
```

## 📈 Scalability Considerations

### Database Sharding Strategy
```typescript
// Shard by user ID for user-related data
const getUserShard = (userId: string) => {
  return `shard_${parseInt(userId.slice(-2), 16) % 4}`;
};

// Shard by class ID for class-related data
const getClassShard = (classId: string) => {
  return `shard_${parseInt(classId.slice(-2), 16) % 4}`;
};
```

### Caching Strategy
```typescript
// Cache frequently accessed data
const cacheKeys = {
  user: (id: string) => `user:${id}`,
  class: (id: string) => `class:${id}`,
  assignment: (id: string) => `assignment:${id}`,
  leaderboard: () => 'leaderboard:global',
  userStats: (id: string) => `user:${id}:stats`,
};
```

This comprehensive relationship documentation ensures proper data modeling, performance optimization, and maintainability of the CodeTracker database architecture.
