// Simple gamification types for testing
export type AchievementCategory = 
  | 'STREAK'
  | 'LANGUAGE_MASTERY'
  | 'ASSIGNMENT_COMPLETION'
  | 'COLLABORATION'
  | 'CODE_QUALITY'
  | 'MENTORING'
  | 'CHALLENGE'
  | 'SPECIAL_EVENT'
  | 'HIDDEN'
  | 'SOCIAL';

export type AchievementRarity = 
  | 'COMMON'
  | 'UNCOMMON'
  | 'RARE'
  | 'EPIC'
  | 'LEGENDARY';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  xpReward: number;
  requirements: AchievementRequirement[];
  isHidden: boolean;
  isActive: boolean;
  unlockConditions: Record<string, any>;
  createdAt: Date;
}

export interface AchievementRequirement {
  type: string;
  condition: Record<string, any>;
  description: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: Record<string, any>;
  isNotified: boolean;
  achievement: Achievement;
}

export interface UserProgress {
  userId: string;
  currentLevel: number;
  currentXP: number;
  totalXP: number;
  streak: number;
  lastActiveDate: Date;
  weeklyXP: number;
  monthlyXP: number;
  languageXP: Record<string, number>;
  skillLevels: Record<string, SkillLevel>;
  achievements: UserAchievement[];
  goals: UserGoal[];
  challenges: UserChallenge[];
}

export interface SkillLevel {
  language: string;
  level: number;
  xp: number;
  proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  badges: string[];
  milestones: SkillMilestone[];
}

export interface SkillMilestone {
  id: string;
  name: string;
  description: string;
  xpRequired: number;
  achieved: boolean;
  achievedAt?: Date;
}

export interface UserGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: GoalType;
  target: number;
  current: number;
  unit: string;
  deadline?: Date;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type GoalType = 
  | 'DAILY_XP'
  | 'WEEKLY_XP'
  | 'MONTHLY_XP'
  | 'STREAK_DAYS'
  | 'ASSIGNMENTS_COMPLETED'
  | 'LANGUAGE_XP'
  | 'ACHIEVEMENTS_UNLOCKED'
  | 'CODE_LINES_WRITTEN'
  | 'HOURS_CODING'
  | 'PEER_HELP_SESSIONS';

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  joinedAt: Date;
  score: number;
  submissions: number;
  rank?: number;
  completed: boolean;
  completedAt?: Date;
  progress: Record<string, any>;
  challenge: Challenge;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  xpReward: number;
  startDate: Date;
  endDate: Date;
  maxParticipants?: number;
  requirements: ChallengeRequirement[];
  rewards: ChallengeReward[];
  isActive: boolean;
  createdBy: string;
  participants: ChallengeParticipant[];
  leaderboard?: Leaderboard;
}

export type ChallengeType = 
  | 'DAILY_CODING'
  | 'WEEKLY_THEME'
  | 'MONTHLY_HACKATHON'
  | 'PEER_TO_PEER'
  | 'TEACHER_CUSTOM'
  | 'SKILL_BUILDING'
  | 'SPEED_CODING'
  | 'ALGORITHM_CHALLENGE'
  | 'PROJECT_BUILDING';

export interface ChallengeRequirement {
  type: string;
  description: string;
  criteria: Record<string, any>;
}

export interface ChallengeReward {
  type: 'XP' | 'BADGE' | 'ACHIEVEMENT' | 'CUSTOM';
  value: any;
  description: string;
}

export interface ChallengeParticipant {
  userId: string;
  joinedAt: Date;
  score: number;
  submissions: number;
  rank?: number;
  completed: boolean;
  completedAt?: Date;
}

export interface Leaderboard {
  id: string;
  name: string;
  type: LeaderboardType;
  scope: LeaderboardScope;
  period: LeaderboardPeriod;
  entries: LeaderboardEntry[];
  totalParticipants: number;
  lastUpdated: Date;
  filters?: LeaderboardFilters;
}

export type LeaderboardType = 
  | 'TOTAL_XP'
  | 'WEEKLY_XP'
  | 'MONTHLY_XP'
  | 'STREAK'
  | 'ACHIEVEMENTS'
  | 'ASSIGNMENTS_COMPLETED'
  | 'LANGUAGE_SPECIFIC'
  | 'CLASS_RANKING'
  | 'CHALLENGE_SCORE';

export type LeaderboardScope = 
  | 'GLOBAL'
  | 'CLASS'
  | 'SCHOOL'
  | 'REGION'
  | 'CUSTOM';

export type LeaderboardPeriod = 
  | 'ALL_TIME'
  | 'MONTHLY'
  | 'WEEKLY'
  | 'DAILY';

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string;
    username: string;
    image?: string;
    level: number;
    xp: number;
    streak: number;
  };
  score: number;
  change?: number;
  metadata?: Record<string, any>;
}

export interface LeaderboardFilters {
  language?: string;
  classId?: string;
  role?: any;
  minLevel?: number;
  maxLevel?: number;
  timeRange?: {
    start: Date;
    end: Date;
  };
}

export interface ActivityHeatmapEntry {
  date: string;
  count: number;
  xp: number;
  activities: string[];
}
