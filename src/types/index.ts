import { User, Role, ClassMemberRole, Difficulty, SubmissionStatus, CollaborationType, ActivityType, NotificationType } from '@prisma/client';

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: Role;
    };
  }

  interface User {
    role: Role;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role;
    id: string;
  }
}

// Custom types for the application
export interface UserWithStats extends User {
  _count: {
    submissions: number;
    assignments: number;
    activities: number;
  };
  achievements: UserAchievement[];
  recentActivity: Activity[];
}

export interface ClassWithMembers extends Class {
  members: ClassMemberWithUser[];
  _count: {
    members: number;
    assignments: number;
  };
}

export interface ClassMemberWithUser extends ClassMember {
  user: User;
}

export interface AssignmentWithDetails extends Assignment {
  class: Class;
  creator: User;
  submissions: Submission[];
  _count: {
    submissions: number;
  };
}

export interface SubmissionWithDetails extends Submission {
  assignment: Assignment;
  student: User;
  codeReviews: CodeReview[];
}

export interface CodeReviewWithUsers extends CodeReview {
  reviewer: User;
  reviewee: User;
  submission?: Submission;
  assignment?: Assignment;
}

export interface ActivityWithUser extends Activity {
  user: User;
}

export interface NotificationWithUser extends Notification {
  user: User;
}

export interface ForumPostWithDetails extends ForumPost {
  author: User;
  class: Class;
  comments: ForumCommentWithUser[];
  _count: {
    comments: number;
  };
}

export interface ForumCommentWithUser extends ForumComment {
  author: User;
  replies: ForumCommentWithUser[];
}

export interface CollaborationWithDetails extends Collaboration {
  assignment: Assignment;
  participants: User[];
}

export interface UserAchievementWithDetails extends UserAchievement {
  achievement: Achievement;
  user: User;
}

// Dashboard types
export interface DashboardStats {
  totalStudents: number;
  totalAssignments: number;
  totalSubmissions: number;
  averageScore: number;
  completionRate: number;
  activeClasses: number;
}

export interface StudentProgress {
  userId: string;
  userName: string;
  totalSubmissions: number;
  averageScore: number;
  streak: number;
  level: number;
  totalXP: number;
  recentActivity: Activity[];
}

export interface ClassAnalytics {
  classId: string;
  className: string;
  totalStudents: number;
  totalAssignments: number;
  averageScore: number;
  completionRate: number;
  topPerformers: StudentProgress[];
}

// Form types
export interface CreateAssignmentForm {
  title: string;
  description: string;
  classId: string;
  difficulty: Difficulty;
  language: string;
  maxScore: number;
  dueDate?: Date;
  testCases: TestCase[];
  starterCode?: string;
  instructions: string;
  allowLateSubmission: boolean;
  maxAttempts?: number;
  timeLimit?: number;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  description?: string;
}

export interface CreateClassForm {
  name: string;
  description?: string;
  semester?: string;
}

export interface UpdateProfileForm {
  name?: string;
  bio?: string;
  githubUsername?: string;
  preferredLanguages: string[];
  institution?: string;
}

// Real-time types
export interface SocketEvents {
  'join-room': (roomId: string) => void;
  'leave-room': (roomId: string) => void;
  'code-change': (data: { roomId: string; code: string; userId: string }) => void;
  'cursor-position': (data: { roomId: string; position: any; userId: string }) => void;
  'user-joined': (data: { roomId: string; user: User }) => void;
  'user-left': (data: { roomId: string; userId: string }) => void;
  'submission-update': (data: { submissionId: string; status: SubmissionStatus }) => void;
  'notification': (data: Notification) => void;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search and filter types
export interface AssignmentFilters {
  classId?: string;
  difficulty?: Difficulty;
  language?: string;
  status?: 'active' | 'completed' | 'overdue';
  search?: string;
}

export interface UserFilters {
  role?: Role;
  classId?: string;
  search?: string;
}

// Gamification types
export interface AchievementProgress {
  achievementId: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

export interface LeaderboardEntry {
  user: User;
  totalXP: number;
  level: number;
  streak: number;
  rank: number;
}

// Import Prisma types
export type {
  User,
  Class,
  ClassMember,
  Assignment,
  Submission,
  CodeReview,
  Collaboration,
  Achievement,
  UserAchievement,
  Activity,
  ForumPost,
  ForumComment,
  Notification,
  Role,
  ClassMemberRole,
  Difficulty,
  SubmissionStatus,
  CollaborationType,
  ActivityType,
  NotificationType,
} from '@prisma/client';
