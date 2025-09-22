# Data Validation Rules & Business Logic

## 🔒 User Data Validation

### User Model Validation
```typescript
interface UserValidation {
  // Required fields
  email: {
    required: true,
    format: 'email',
    unique: true,
    maxLength: 255
  },
  
  // Optional but validated fields
  name: {
    required: false,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s\-'\.]+$/
  },
  
  username: {
    required: false,
    unique: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    reserved: ['admin', 'api', 'www', 'mail', 'support']
  },
  
  role: {
    required: true,
    enum: ['STUDENT', 'TEACHER', 'ADMIN'],
    default: 'STUDENT'
  },
  
  // Gamification fields
  totalXP: {
    required: true,
    type: 'integer',
    min: 0,
    max: 999999,
    default: 0
  },
  
  level: {
    required: true,
    type: 'integer',
    min: 1,
    max: 100,
    default: 1,
    calculated: 'Math.floor(totalXP / 100) + 1'
  },
  
  streak: {
    required: true,
    type: 'integer',
    min: 0,
    max: 365,
    default: 0
  },
  
  // Profile fields
  bio: {
    required: false,
    maxLength: 500,
    sanitize: true
  },
  
  preferredLanguages: {
    required: false,
    type: 'array',
    maxItems: 10,
    allowedValues: [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#',
      'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Scala',
      'R', 'MATLAB', 'SQL', 'HTML', 'CSS', 'React', 'Vue', 'Angular'
    ]
  },
  
  institution: {
    required: false,
    maxLength: 100,
    sanitize: true
  },
  
  githubUsername: {
    required: false,
    pattern: /^[a-zA-Z0-9\-]+$/,
    maxLength: 39,
    unique: true
  }
}
```

### User Business Rules
```typescript
// XP and Leveling System
const calculateLevel = (totalXP: number): number => {
  return Math.floor(totalXP / 100) + 1;
};

const calculateXPForLevel = (level: number): number => {
  return (level - 1) * 100;
};

// Streak Management
const updateStreak = (user: User, lastActivity: Date): number => {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  
  if (user.lastActiveDate) {
    const lastActive = new Date(user.lastActiveDate);
    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (24 * 60 * 60 * 1000));
    
    if (daysDiff === 1) {
      return user.streak + 1; // Continue streak
    } else if (daysDiff === 0) {
      return user.streak; // Same day, no change
    } else {
      return 1; // Reset streak
    }
  }
  
  return 1; // First activity
};

// Role-based Permissions
const canCreateClass = (user: User): boolean => {
  return user.role === 'TEACHER' || user.role === 'ADMIN';
};

const canGradeSubmissions = (user: User, assignment: Assignment): boolean => {
  return user.role === 'ADMIN' || 
         assignment.creatorId === user.id ||
         user.classMembers.some(cm => 
           cm.classId === assignment.classId && cm.role === 'TEACHER'
         );
};
```

## 📚 Class Data Validation

### Class Model Validation
```typescript
interface ClassValidation {
  name: {
    required: true,
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-_]+$/,
    sanitize: true
  },
  
  description: {
    required: false,
    maxLength: 500,
    sanitize: true
  },
  
  ownerId: {
    required: true,
    exists: 'User',
    role: 'TEACHER' | 'ADMIN'
  },
  
  inviteCode: {
    required: true,
    unique: true,
    length: 12,
    pattern: /^[A-Z0-9\-]+$/,
    generated: true
  },
  
  semester: {
    required: false,
    maxLength: 50,
    pattern: /^(Spring|Summer|Fall|Winter)\s+\d{4}$/
  },
  
  isActive: {
    required: true,
    type: 'boolean',
    default: true
  },
  
  settings: {
    required: true,
    type: 'object',
    schema: {
      allowLateSubmissions: { type: 'boolean', default: true },
      maxLateDays: { type: 'integer', min: 0, max: 30, default: 3 },
      collaborationEnabled: { type: 'boolean', default: false },
      gradingPolicy: { enum: ['points', 'weighted', 'pass_fail'], default: 'points' },
      autoGrade: { type: 'boolean', default: false },
      plagiarismCheck: { type: 'boolean', default: true }
    }
  }
}
```

### Class Business Rules
```typescript
// Invite Code Generation
const generateInviteCode = (className: string, semester: string): string => {
  const prefix = className.replace(/[^A-Z0-9]/g, '').substring(0, 6);
  const suffix = semester.replace(/[^A-Z0-9]/g, '').substring(0, 6);
  return `${prefix}-${suffix}`.toUpperCase();
};

// Class Capacity Limits
const MAX_CLASS_SIZE = 100;
const MAX_CLASSES_PER_TEACHER = 20;

const canAddStudentToClass = (classId: string, currentSize: number): boolean => {
  return currentSize < MAX_CLASS_SIZE;
};

const canTeacherCreateClass = (teacherId: string, currentClasses: number): boolean => {
  return currentClasses < MAX_CLASSES_PER_TEACHER;
};

// Class Membership Validation
const validateClassMembership = (userId: string, classId: string, role: string): boolean => {
  // Students can only join as students
  // Teachers can join as teachers or assistants
  // Admins can join with any role
  return true; // Additional validation logic here
};
```

## 📝 Assignment Data Validation

### Assignment Model Validation
```typescript
interface AssignmentValidation {
  title: {
    required: true,
    minLength: 1,
    maxLength: 100,
    sanitize: true
  },
  
  description: {
    required: true,
    minLength: 10,
    maxLength: 1000,
    sanitize: true
  },
  
  classId: {
    required: true,
    exists: 'Class',
    active: true
  },
  
  creatorId: {
    required: true,
    exists: 'User',
    role: 'TEACHER' | 'ADMIN',
    classMember: true // Must be member of the class
  },
  
  difficulty: {
    required: true,
    enum: ['EASY', 'MEDIUM', 'HARD', 'EXPERT'],
    default: 'MEDIUM'
  },
  
  language: {
    required: true,
    enum: [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#',
      'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Scala',
      'R', 'MATLAB', 'SQL', 'HTML', 'CSS'
    ]
  },
  
  maxScore: {
    required: true,
    type: 'integer',
    min: 1,
    max: 1000,
    default: 100
  },
  
  dueDate: {
    required: false,
    type: 'datetime',
    future: true, // Must be in the future
    maxDaysFromNow: 365
  },
  
  testCases: {
    required: true,
    type: 'array',
    minItems: 1,
    maxItems: 50,
    schema: {
      input: { required: true, maxLength: 10000 },
      expectedOutput: { required: true, maxLength: 10000 },
      isHidden: { type: 'boolean', default: false },
      description: { maxLength: 200 }
    }
  },
  
  starterCode: {
    required: false,
    maxLength: 50000,
    language: 'match' // Must match assignment language
  },
  
  instructions: {
    required: true,
    minLength: 10,
    maxLength: 2000,
    sanitize: true
  },
  
  allowLateSubmission: {
    required: true,
    type: 'boolean',
    default: false
  },
  
  maxAttempts: {
    required: false,
    type: 'integer',
    min: 1,
    max: 10
  },
  
  timeLimit: {
    required: false,
    type: 'integer',
    min: 1,
    max: 300, // 5 hours max
    unit: 'minutes'
  }
}
```

### Assignment Business Rules
```typescript
// Assignment Creation Rules
const canCreateAssignment = (user: User, classId: string): boolean => {
  return user.role === 'ADMIN' || 
         user.role === 'TEACHER' && 
         user.classMembers.some(cm => 
           cm.classId === classId && 
           (cm.role === 'TEACHER' || cm.role === 'ASSISTANT')
         );
};

// Due Date Validation
const validateDueDate = (dueDate: Date, assignmentCreatedAt: Date): boolean => {
  const now = new Date();
  const maxDueDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
  
  return dueDate > now && dueDate <= maxDueDate;
};

// Test Case Validation
const validateTestCases = (testCases: TestCase[], language: string): boolean => {
  // At least one visible test case
  const visibleTests = testCases.filter(tc => !tc.isHidden);
  if (visibleTests.length === 0) {
    throw new Error('At least one test case must be visible to students');
  }
  
  // Test case input/output validation based on language
  return testCases.every(tc => validateTestCaseForLanguage(tc, language));
};

// Assignment Access Control
const canAccessAssignment = (user: User, assignment: Assignment): boolean => {
  return user.role === 'ADMIN' ||
         assignment.creatorId === user.id ||
         user.classMembers.some(cm => cm.classId === assignment.classId);
};
```

## 📤 Submission Data Validation

### Submission Model Validation
```typescript
interface SubmissionValidation {
  assignmentId: {
    required: true,
    exists: 'Assignment',
    active: true,
    notExpired: true // Assignment not past due date
  },
  
  studentId: {
    required: true,
    exists: 'User',
    role: 'STUDENT',
    classMember: true // Must be member of assignment's class
  },
  
  code: {
    required: true,
    minLength: 1,
    maxLength: 1000000, // 1MB max
    language: 'match' // Must match assignment language
  },
  
  language: {
    required: true,
    match: 'assignment.language'
  },
  
  status: {
    required: true,
    enum: ['PENDING', 'RUNNING', 'PASSED', 'FAILED', 'PARTIAL', 'ERROR', 'TIMEOUT'],
    default: 'PENDING'
  },
  
  score: {
    required: false,
    type: 'integer',
    min: 0,
    max: 'assignment.maxScore'
  },
  
  maxScore: {
    required: true,
    type: 'integer',
    match: 'assignment.maxScore'
  },
  
  testResults: {
    required: true,
    type: 'object',
    schema: {
      passed: { type: 'integer', min: 0 },
      total: { type: 'integer', min: 1 },
      details: { type: 'array' },
      executionTime: { type: 'number', min: 0 },
      memoryUsage: { type: 'number', min: 0 }
    }
  },
  
  attemptNumber: {
    required: true,
    type: 'integer',
    min: 1,
    max: 'assignment.maxAttempts'
  },
  
  isLate: {
    required: true,
    type: 'boolean',
    calculated: 'submittedAt > assignment.dueDate'
  }
}
```

### Submission Business Rules
```typescript
// Submission Limits
const canSubmitAssignment = (user: User, assignment: Assignment, currentAttempts: number): boolean => {
  // Check if user is student in the class
  const isClassMember = user.classMembers.some(cm => cm.classId === assignment.classId);
  if (!isClassMember) return false;
  
  // Check attempt limits
  if (assignment.maxAttempts && currentAttempts >= assignment.maxAttempts) {
    return false;
  }
  
  // Check due date
  if (assignment.dueDate && new Date() > assignment.dueDate && !assignment.allowLateSubmission) {
    return false;
  }
  
  return true;
};

// Late Submission Handling
const calculateLatePenalty = (assignment: Assignment, submittedAt: Date): number => {
  if (!assignment.dueDate || submittedAt <= assignment.dueDate) {
    return 0; // Not late
  }
  
  const daysLate = Math.ceil((submittedAt.getTime() - assignment.dueDate.getTime()) / (24 * 60 * 60 * 1000));
  
  // 10% penalty per day, max 50%
  return Math.min(daysLate * 10, 50);
};

// Code Validation
const validateCodeSubmission = (code: string, language: string): boolean => {
  // Check for malicious patterns
  const maliciousPatterns = [
    /import\s+os/,
    /import\s+subprocess/,
    /exec\s*\(/,
    /eval\s*\(/,
    /system\s*\(/,
    /rm\s+-rf/,
    /del\s+\/s/,
    /format\s+c:/
  ];
  
  if (maliciousPatterns.some(pattern => pattern.test(code))) {
    throw new Error('Code contains potentially malicious patterns');
  }
  
  // Language-specific validation
  return validateCodeForLanguage(code, language);
};
```

## 🏆 Achievement Data Validation

### Achievement Model Validation
```typescript
interface AchievementValidation {
  name: {
    required: true,
    unique: true,
    minLength: 1,
    maxLength: 100,
    sanitize: true
  },
  
  description: {
    required: true,
    minLength: 10,
    maxLength: 500,
    sanitize: true
  },
  
  icon: {
    required: true,
    maxLength: 10,
    pattern: /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]$/u
  },
  
  category: {
    required: true,
    enum: ['milestone', 'streak', 'language', 'performance', 'collaboration', 'special']
  },
  
  xpReward: {
    required: true,
    type: 'integer',
    min: 0,
    max: 1000
  },
  
  requirement: {
    required: true,
    type: 'object',
    schema: {
      type: { 
        enum: ['submissions', 'streak', 'language_mastery', 'perfect_score', 'collaboration', 'custom'] 
      },
      count: { type: 'integer', min: 1 },
      days: { type: 'integer', min: 1 },
      language: { type: 'string' },
      score: { type: 'integer', min: 0 }
    }
  },
  
  isActive: {
    required: true,
    type: 'boolean',
    default: true
  }
}
```

### Achievement Business Rules
```typescript
// Achievement Unlocking Logic
const checkAchievementEligibility = (user: User, achievement: Achievement): boolean => {
  const { type, count, days, language, score } = achievement.requirement;
  
  switch (type) {
    case 'submissions':
      return user.submissions.length >= count;
    
    case 'streak':
      return user.streak >= days;
    
    case 'language_mastery':
      const languageXP = calculateLanguageXP(user, language);
      return languageXP >= score;
    
    case 'perfect_score':
      const perfectSubmissions = user.submissions.filter(s => s.score === s.maxScore);
      return perfectSubmissions.length >= count;
    
    case 'collaboration':
      const collaborations = user.collaborations.length;
      return collaborations >= count;
    
    default:
      return false;
  }
};

// XP Award System
const calculateXPAward = (achievement: Achievement, context: any): number => {
  let baseXP = achievement.xpReward;
  
  // Bonus for early completion
  if (context.isEarly) {
    baseXP *= 1.2;
  }
  
  // Bonus for perfect score
  if (context.isPerfect) {
    baseXP *= 1.5;
  }
  
  return Math.floor(baseXP);
};
```

## 🔔 Notification Data Validation

### Notification Model Validation
```typescript
interface NotificationValidation {
  userId: {
    required: true,
    exists: 'User'
  },
  
  title: {
    required: true,
    minLength: 1,
    maxLength: 100,
    sanitize: true
  },
  
  message: {
    required: true,
    minLength: 1,
    maxLength: 500,
    sanitize: true
  },
  
  type: {
    required: true,
    enum: [
      'ASSIGNMENT_DUE', 'SUBMISSION_GRADED', 'CODE_REVIEW_RECEIVED',
      'ACHIEVEMENT_UNLOCKED', 'COLLABORATION_INVITE', 'FORUM_REPLY',
      'SYSTEM_UPDATE'
    ]
  },
  
  isRead: {
    required: true,
    type: 'boolean',
    default: false
  },
  
  metadata: {
    required: true,
    type: 'object',
    maxSize: 1000 // bytes
  }
}
```

### Notification Business Rules
```typescript
// Notification Rate Limiting
const MAX_NOTIFICATIONS_PER_USER = 100;
const MAX_NOTIFICATIONS_PER_DAY = 50;

const canSendNotification = (userId: string, recentCount: number): boolean => {
  return recentCount < MAX_NOTIFICATIONS_PER_DAY;
};

// Notification Cleanup
const cleanupOldNotifications = async (userId: string): Promise<void> => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  await db.notification.deleteMany({
    where: {
      userId,
      createdAt: { lt: thirtyDaysAgo },
      isRead: true
    }
  });
};

// Priority-based Notification Ordering
const getNotificationPriority = (type: NotificationType): number => {
  const priorities = {
    'SYSTEM_UPDATE': 1,
    'ASSIGNMENT_DUE': 2,
    'SUBMISSION_GRADED': 3,
    'ACHIEVEMENT_UNLOCKED': 4,
    'CODE_REVIEW_RECEIVED': 5,
    'COLLABORATION_INVITE': 6,
    'FORUM_REPLY': 7
  };
  
  return priorities[type] || 8;
};
```

This comprehensive validation system ensures data integrity, security, and proper business logic enforcement throughout the CodeTracker platform.
