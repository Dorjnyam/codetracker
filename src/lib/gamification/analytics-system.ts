import { 
  UserProgress, 
  UserAchievement, 
  Challenge, 
  UserGoal,
  SocialFeed,
  UserFollow
} from './achievement-system';

// Analytics data structures
export interface AnalyticsData {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  xpGained: number;
  achievementsUnlocked: number;
  challengesCompleted: number;
  goalsAchieved: number;
  timeSpent: number; // in minutes
  codeLinesWritten: number;
  languagesUsed: Record<string, number>;
  activityPattern: ActivityPattern[];
  performanceMetrics: PerformanceMetrics;
  socialEngagement: SocialEngagement;
}

export interface ActivityPattern {
  date: string;
  xpGained: number;
  timeSpent: number;
  achievementsUnlocked: number;
  challengesCompleted: number;
  goalsAchieved: number;
}

export interface PerformanceMetrics {
  averageScore: number;
  completionRate: number;
  improvementRate: number;
  consistencyScore: number;
  efficiencyScore: number;
}

export interface SocialEngagement {
  postsShared: number;
  likesReceived: number;
  commentsReceived: number;
  followersGained: number;
  engagementRate: number;
}

export interface ComparativeAnalytics {
  userRank: number;
  totalUsers: number;
  percentile: number;
  comparisonData: {
    averageXP: number;
    averageAchievements: number;
    averageChallenges: number;
    averageGoals: number;
  };
}

// Generate analytics data
export function generateAnalyticsData(
  userId: string,
  userProgress: UserProgress,
  achievements: UserAchievement[],
  challenges: Challenge[],
  goals: UserGoal[],
  feeds: SocialFeed[],
  follows: UserFollow[],
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'
): AnalyticsData {
  const now = new Date();
  const startDate = getPeriodStartDate(now, period);
  const endDate = getPeriodEndDate(now, period);
  
  // Filter data by period
  const periodAchievements = achievements.filter(a => 
    a.unlockedAt >= startDate && a.unlockedAt <= endDate
  );
  
  const periodChallenges = challenges.filter(c => 
    c.participants.some(p => 
      p.userId === userId && 
      p.completedAt && 
      p.completedAt >= startDate && 
      p.completedAt <= endDate
    )
  );
  
  const periodGoals = goals.filter(g => 
    g.completedAt && 
    g.completedAt >= startDate && 
    g.completedAt <= endDate
  );
  
  const periodFeeds = feeds.filter(f => 
    f.userId === userId && 
    f.createdAt >= startDate && 
    f.createdAt <= endDate
  );
  
  // Calculate metrics
  const xpGained = calculatePeriodXP(userProgress, period);
  const achievementsUnlocked = periodAchievements.length;
  const challengesCompleted = periodChallenges.length;
  const goalsAchieved = periodGoals.length;
  const timeSpent = calculateTimeSpent(userProgress, period);
  const codeLinesWritten = calculateCodeLinesWritten(userProgress, period);
  const languagesUsed = calculateLanguageUsage(userProgress, period);
  
  // Generate activity pattern
  const activityPattern = generateActivityPattern(
    startDate,
    endDate,
    periodAchievements,
    periodChallenges,
    periodGoals,
    period
  );
  
  // Calculate performance metrics
  const performanceMetrics = calculatePerformanceMetrics(
    userProgress,
    achievements,
    challenges,
    goals
  );
  
  // Calculate social engagement
  const socialEngagement = calculateSocialEngagement(
    periodFeeds,
    follows,
    userId
  );
  
  return {
    userId,
    period,
    startDate,
    endDate,
    xpGained,
    achievementsUnlocked,
    challengesCompleted,
    goalsAchieved,
    timeSpent,
    codeLinesWritten,
    languagesUsed,
    activityPattern,
    performanceMetrics,
    socialEngagement,
  };
}

// Get period start date
function getPeriodStartDate(date: Date, period: string): Date {
  const start = new Date(date);
  
  switch (period) {
    case 'daily':
      start.setHours(0, 0, 0, 0);
      break;
    case 'weekly':
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      break;
    case 'monthly':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    case 'yearly':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
  }
  
  return start;
}

// Get period end date
function getPeriodEndDate(date: Date, period: string): Date {
  const end = new Date(date);
  
  switch (period) {
    case 'daily':
      end.setHours(23, 59, 59, 999);
      break;
    case 'weekly':
      end.setDate(end.getDate() + (6 - end.getDay()));
      end.setHours(23, 59, 59, 999);
      break;
    case 'monthly':
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'yearly':
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
  }
  
  return end;
}

// Calculate period XP
function calculatePeriodXP(userProgress: UserProgress, period: string): number {
  switch (period) {
    case 'daily':
      return Math.floor(userProgress.weeklyXP / 7);
    case 'weekly':
      return userProgress.weeklyXP;
    case 'monthly':
      return userProgress.monthlyXP;
    case 'yearly':
      return userProgress.totalXP;
    default:
      return 0;
  }
}

// Calculate time spent
function calculateTimeSpent(userProgress: UserProgress, period: string): number {
  // Mock calculation based on XP and activities
  const baseTime = userProgress.totalXP / 10; // 10 XP per minute
  
  switch (period) {
    case 'daily':
      return Math.floor(baseTime / 365);
    case 'weekly':
      return Math.floor(baseTime / 52);
    case 'monthly':
      return Math.floor(baseTime / 12);
    case 'yearly':
      return Math.floor(baseTime);
    default:
      return 0;
  }
}

// Calculate code lines written
function calculateCodeLinesWritten(userProgress: UserProgress, period: string): number {
  // Mock calculation based on achievements and XP
  const baseLines = userProgress.achievements.length * 100;
  
  switch (period) {
    case 'daily':
      return Math.floor(baseLines / 365);
    case 'weekly':
      return Math.floor(baseLines / 52);
    case 'monthly':
      return Math.floor(baseLines / 12);
    case 'yearly':
      return baseLines;
    default:
      return 0;
  }
}

// Calculate language usage
function calculateLanguageUsage(userProgress: UserProgress, period: string): Record<string, number> {
  const usage: Record<string, number> = {};
  
  Object.entries(userProgress.languageXP).forEach(([language, xp]) => {
    switch (period) {
      case 'daily':
        usage[language] = Math.floor(xp / 365);
        break;
      case 'weekly':
        usage[language] = Math.floor(xp / 52);
        break;
      case 'monthly':
        usage[language] = Math.floor(xp / 12);
        break;
      case 'yearly':
        usage[language] = xp;
        break;
    }
  });
  
  return usage;
}

// Generate activity pattern
function generateActivityPattern(
  startDate: Date,
  endDate: Date,
  achievements: UserAchievement[],
  challenges: Challenge[],
  goals: UserGoal[],
  period: string
): ActivityPattern[] {
  const pattern: ActivityPattern[] = [];
  const days = getDaysInPeriod(startDate, endDate, period);
  
  days.forEach(day => {
    const dayAchievements = achievements.filter(a => 
      a.unlockedAt.toDateString() === day.toDateString()
    );
    
    const dayChallenges = challenges.filter(c => 
      c.participants.some(p => 
        p.userId === 'user1' && 
        p.completedAt && 
        p.completedAt.toDateString() === day.toDateString()
      )
    );
    
    const dayGoals = goals.filter(g => 
      g.completedAt && 
      g.completedAt.toDateString() === day.toDateString()
    );
    
    pattern.push({
      date: day.toISOString().split('T')[0],
      xpGained: (dayAchievements.length * 50) + (dayChallenges.length * 100) + (dayGoals.length * 75),
      timeSpent: (dayAchievements.length + dayChallenges.length + dayGoals.length) * 30,
      achievementsUnlocked: dayAchievements.length,
      challengesCompleted: dayChallenges.length,
      goalsAchieved: dayGoals.length,
    });
  });
  
  return pattern;
}

// Get days in period
function getDaysInPeriod(startDate: Date, endDate: Date, period: string): Date[] {
  const days: Date[] = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    days.push(new Date(current));
    
    switch (period) {
      case 'daily':
        current.setDate(current.getDate() + 1);
        break;
      case 'weekly':
        current.setDate(current.getDate() + 7);
        break;
      case 'monthly':
        current.setMonth(current.getMonth() + 1);
        break;
      case 'yearly':
        current.setFullYear(current.getFullYear() + 1);
        break;
    }
  }
  
  return days;
}

// Calculate performance metrics
function calculatePerformanceMetrics(
  userProgress: UserProgress,
  achievements: UserAchievement[],
  challenges: Challenge[],
  goals: UserGoal[]
): PerformanceMetrics {
  // Average score (mock calculation)
  const averageScore = Math.min(100, (userProgress.currentLevel * 10) + Math.random() * 20);
  
  // Completion rate
  const totalActivities = achievements.length + challenges.length + goals.length;
  const completedActivities = achievements.filter(a => a.isNotified).length + 
    challenges.filter(c => c.participants.some(p => p.userId === 'user1' && p.completed)).length +
    goals.filter(g => g.isCompleted).length;
  const completionRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;
  
  // Improvement rate (mock calculation)
  const improvementRate = Math.min(100, userProgress.currentLevel * 5 + Math.random() * 10);
  
  // Consistency score (based on streak)
  const consistencyScore = Math.min(100, userProgress.streak * 5);
  
  // Efficiency score (XP per hour)
  const efficiencyScore = Math.min(100, (userProgress.totalXP / Math.max(1, userProgress.streak)) * 2);
  
  return {
    averageScore,
    completionRate,
    improvementRate,
    consistencyScore,
    efficiencyScore,
  };
}

// Calculate social engagement
function calculateSocialEngagement(
  feeds: SocialFeed[],
  follows: UserFollow[],
  userId: string
): SocialEngagement {
  const postsShared = feeds.length;
  const likesReceived = feeds.reduce((sum, feed) => sum + feed.likes, 0);
  const commentsReceived = feeds.reduce((sum, feed) => sum + feed.comments.length, 0);
  const followersGained = follows.filter(f => f.followingId === userId).length;
  const engagementRate = postsShared > 0 ? (likesReceived + commentsReceived) / postsShared : 0;
  
  return {
    postsShared,
    likesReceived,
    commentsReceived,
    followersGained,
    engagementRate: Math.round(engagementRate * 100) / 100,
  };
}

// Generate comparative analytics
export function generateComparativeAnalytics(
  userAnalytics: AnalyticsData,
  allUsersAnalytics: AnalyticsData[]
): ComparativeAnalytics {
  const userRank = allUsersAnalytics
    .sort((a, b) => b.xpGained - a.xpGained)
    .findIndex(analytics => analytics.userId === userAnalytics.userId) + 1;
  
  const totalUsers = allUsersAnalytics.length;
  const percentile = Math.round(((totalUsers - userRank + 1) / totalUsers) * 100);
  
  const comparisonData = {
    averageXP: allUsersAnalytics.reduce((sum, a) => sum + a.xpGained, 0) / totalUsers,
    averageAchievements: allUsersAnalytics.reduce((sum, a) => sum + a.achievementsUnlocked, 0) / totalUsers,
    averageChallenges: allUsersAnalytics.reduce((sum, a) => sum + a.challengesCompleted, 0) / totalUsers,
    averageGoals: allUsersAnalytics.reduce((sum, a) => sum + a.goalsAchieved, 0) / totalUsers,
  };
  
  return {
    userRank,
    totalUsers,
    percentile,
    comparisonData,
  };
}

// Get analytics insights
export function getAnalyticsInsights(analytics: AnalyticsData): string[] {
  const insights: string[] = [];
  
  // XP insights
  if (analytics.xpGained > analytics.performanceMetrics.averageScore * 2) {
    insights.push('Great job! You\'re earning XP at an excellent rate.');
  } else if (analytics.xpGained < analytics.performanceMetrics.averageScore * 0.5) {
    insights.push('Consider increasing your coding activity to boost XP gains.');
  }
  
  // Achievement insights
  if (analytics.achievementsUnlocked > 0) {
    insights.push(`You unlocked ${analytics.achievementsUnlocked} achievement${analytics.achievementsUnlocked > 1 ? 's' : ''} this period!`);
  }
  
  // Challenge insights
  if (analytics.challengesCompleted > 0) {
    insights.push(`You completed ${analytics.challengesCompleted} challenge${analytics.challengesCompleted > 1 ? 's' : ''} this period!`);
  }
  
  // Goal insights
  if (analytics.goalsAchieved > 0) {
    insights.push(`You achieved ${analytics.goalsAchieved} goal${analytics.goalsAchieved > 1 ? 's' : ''} this period!`);
  }
  
  // Consistency insights
  if (analytics.performanceMetrics.consistencyScore > 80) {
    insights.push('Your consistency is excellent! Keep up the great work.');
  } else if (analytics.performanceMetrics.consistencyScore < 40) {
    insights.push('Try to maintain a more consistent coding schedule.');
  }
  
  // Social insights
  if (analytics.socialEngagement.engagementRate > 5) {
    insights.push('Your social engagement is high! You\'re inspiring others.');
  }
  
  return insights;
}

// Export analytics data
export function exportAnalyticsData(analytics: AnalyticsData): string {
  const data = {
    period: analytics.period,
    startDate: analytics.startDate.toISOString(),
    endDate: analytics.endDate.toISOString(),
    summary: {
      xpGained: analytics.xpGained,
      achievementsUnlocked: analytics.achievementsUnlocked,
      challengesCompleted: analytics.challengesCompleted,
      goalsAchieved: analytics.goalsAchieved,
      timeSpent: analytics.timeSpent,
      codeLinesWritten: analytics.codeLinesWritten,
    },
    performance: analytics.performanceMetrics,
    social: analytics.socialEngagement,
    activityPattern: analytics.activityPattern,
    languagesUsed: analytics.languagesUsed,
  };
  
  return JSON.stringify(data, null, 2);
}
