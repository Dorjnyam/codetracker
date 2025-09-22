import { 
  GamificationNotification, 
  NotificationType, 
  UserAchievement,
  UserProgress,
  Challenge,
  LeaderboardEntry
} from './achievement-system';

// Notification templates
export const NOTIFICATION_TEMPLATES = {
  ACHIEVEMENT_UNLOCKED: {
    title: 'Achievement Unlocked!',
    message: (achievement: any) => `Congratulations! You've unlocked "${achievement.name}"`,
    icon: '🏆',
    priority: 'high',
  },
  LEVEL_UP: {
    title: 'Level Up!',
    message: (level: number) => `You've reached level ${level}! Keep up the great work!`,
    icon: '⬆️',
    priority: 'high',
  },
  STREAK_MILESTONE: {
    title: 'Streak Milestone!',
    message: (days: number) => `Amazing! You've maintained a ${days}-day coding streak!`,
    icon: '🔥',
    priority: 'medium',
  },
  CHALLENGE_INVITE: {
    title: 'New Challenge Available!',
    message: (challenge: any) => `A new challenge "${challenge.title}" is now available!`,
    icon: '🎯',
    priority: 'medium',
  },
  GOAL_COMPLETED: {
    title: 'Goal Completed!',
    message: (goal: any) => `You've completed your goal: "${goal.title}"`,
    icon: '✅',
    priority: 'medium',
  },
  LEADERBOARD_RANK_CHANGE: {
    title: 'Rank Update',
    message: (change: number, rank: number) => 
      change > 0 
        ? `You moved up ${change} positions to rank #${rank}!`
        : `You moved down ${Math.abs(change)} positions to rank #${rank}`,
    icon: '📈',
    priority: 'low',
  },
  PEER_ACHIEVEMENT: {
    title: 'Peer Achievement',
    message: (user: any, achievement: any) => `${user.name} unlocked "${achievement.name}"!`,
    icon: '👥',
    priority: 'low',
  },
  DAILY_CHALLENGE_AVAILABLE: {
    title: 'Daily Challenge Ready!',
    message: () => 'Your daily coding challenge is ready!',
    icon: '📅',
    priority: 'medium',
  },
  WEEKLY_CHALLENGE_STARTING: {
    title: 'Weekly Challenge Starting!',
    message: (challenge: any) => `Weekly challenge "${challenge.title}" starts now!`,
    icon: '📆',
    priority: 'medium',
  },
  MONTHLY_CHALLENGE_STARTING: {
    title: 'Monthly Challenge Starting!',
    message: (challenge: any) => `Monthly challenge "${challenge.title}" starts now!`,
    icon: '🗓️',
    priority: 'high',
  },
};

// Create notification
export function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  metadata: Record<string, any> = {}
): GamificationNotification {
  return {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type,
    title,
    message,
    metadata,
    isRead: false,
    createdAt: new Date(),
  };
}

// Create achievement notification
export function createAchievementNotification(
  userId: string,
  achievement: UserAchievement
): GamificationNotification {
  const template = NOTIFICATION_TEMPLATES.ACHIEVEMENT_UNLOCKED;
  return createNotification(
    userId,
    'ACHIEVEMENT_UNLOCKED',
    template.title,
    template.message(achievement.achievement),
    {
      achievementId: achievement.achievementId,
      xpReward: achievement.achievement.xpReward,
      rarity: achievement.achievement.rarity,
    }
  );
}

// Create level up notification
export function createLevelUpNotification(
  userId: string,
  newLevel: number,
  oldLevel: number
): GamificationNotification {
  const template = NOTIFICATION_TEMPLATES.LEVEL_UP;
  return createNotification(
    userId,
    'LEVEL_UP',
    template.title,
    template.message(newLevel),
    {
      newLevel,
      oldLevel,
      xpGained: (newLevel - oldLevel) * 1000, // Mock XP calculation
    }
  );
}

// Create streak milestone notification
export function createStreakMilestoneNotification(
  userId: string,
  streakDays: number
): GamificationNotification {
  const template = NOTIFICATION_TEMPLATES.STREAK_MILESTONE;
  return createNotification(
    userId,
    'STREAK_MILESTONE',
    template.title,
    template.message(streakDays),
    {
      streakDays,
      milestone: getStreakMilestone(streakDays),
    }
  );
}

// Create challenge invite notification
export function createChallengeInviteNotification(
  userId: string,
  challenge: Challenge
): GamificationNotification {
  const template = NOTIFICATION_TEMPLATES.CHALLENGE_INVITE;
  return createNotification(
    userId,
    'CHALLENGE_INVITE',
    template.title,
    template.message(challenge),
    {
      challengeId: challenge.id,
      challengeType: challenge.type,
      difficulty: challenge.difficulty,
      xpReward: challenge.xpReward,
    }
  );
}

// Create goal completed notification
export function createGoalCompletedNotification(
  userId: string,
  goal: any
): GamificationNotification {
  const template = NOTIFICATION_TEMPLATES.GOAL_COMPLETED;
  return createNotification(
    userId,
    'GOAL_COMPLETED',
    template.title,
    template.message(goal),
    {
      goalId: goal.id,
      goalType: goal.type,
      target: goal.target,
      achieved: goal.current,
    }
  );
}

// Create leaderboard rank change notification
export function createLeaderboardRankChangeNotification(
  userId: string,
  oldRank: number,
  newRank: number,
  leaderboardType: string
): GamificationNotification {
  const template = NOTIFICATION_TEMPLATES.LEADERBOARD_RANK_CHANGE;
  const change = oldRank - newRank;
  return createNotification(
    userId,
    'LEADERBOARD_RANK_CHANGE',
    template.title,
    template.message(change, newRank),
    {
      oldRank,
      newRank,
      change,
      leaderboardType,
    }
  );
}

// Create peer achievement notification
export function createPeerAchievementNotification(
  userId: string,
  peerUser: any,
  achievement: any
): GamificationNotification {
  const template = NOTIFICATION_TEMPLATES.PEER_ACHIEVEMENT;
  return createNotification(
    userId,
    'PEER_ACHIEVEMENT',
    template.title,
    template.message(peerUser, achievement),
    {
      peerUserId: peerUser.id,
      peerUserName: peerUser.name,
      achievementId: achievement.id,
      achievementName: achievement.name,
    }
  );
}

// Create daily challenge notification
export function createDailyChallengeNotification(
  userId: string
): GamificationNotification {
  const template = NOTIFICATION_TEMPLATES.DAILY_CHALLENGE_AVAILABLE;
  return createNotification(
    userId,
    'DAILY_CHALLENGE_AVAILABLE',
    template.title,
    template.message(),
    {
      challengeType: 'DAILY_CODING',
      availableAt: new Date(),
    }
  );
}

// Create weekly challenge notification
export function createWeeklyChallengeNotification(
  userId: string,
  challenge: Challenge
): GamificationNotification {
  const template = NOTIFICATION_TEMPLATES.WEEKLY_CHALLENGE_STARTING;
  return createNotification(
    userId,
    'WEEKLY_CHALLENGE_STARTING',
    template.title,
    template.message(challenge),
    {
      challengeId: challenge.id,
      challengeType: challenge.type,
      startDate: challenge.startDate,
    }
  );
}

// Create monthly challenge notification
export function createMonthlyChallengeNotification(
  userId: string,
  challenge: Challenge
): GamificationNotification {
  const template = NOTIFICATION_TEMPLATES.MONTHLY_CHALLENGE_STARTING;
  return createNotification(
    userId,
    'MONTHLY_CHALLENGE_STARTING',
    template.title,
    template.message(challenge),
    {
      challengeId: challenge.id,
      challengeType: challenge.type,
      startDate: challenge.startDate,
    }
  );
}

// Get streak milestone
function getStreakMilestone(streakDays: number): string {
  if (streakDays >= 100) return 'Century Coder';
  if (streakDays >= 30) return 'Month Master';
  if (streakDays >= 7) return 'Week Warrior';
  if (streakDays >= 3) return 'Getting Started';
  return 'Just Beginning';
}

// Mark notification as read
export function markNotificationAsRead(
  notifications: GamificationNotification[],
  notificationId: string
): GamificationNotification[] {
  return notifications.map(notification =>
    notification.id === notificationId
      ? { ...notification, isRead: true }
      : notification
  );
}

// Mark all notifications as read
export function markAllNotificationsAsRead(
  notifications: GamificationNotification[]
): GamificationNotification[] {
  return notifications.map(notification => ({
    ...notification,
    isRead: true,
  }));
}

// Get unread notifications count
export function getUnreadNotificationsCount(
  notifications: GamificationNotification[]
): number {
  return notifications.filter(notification => !notification.isRead).length;
}

// Get notifications by type
export function getNotificationsByType(
  notifications: GamificationNotification[],
  type: NotificationType
): GamificationNotification[] {
  return notifications.filter(notification => notification.type === type);
}

// Get recent notifications
export function getRecentNotifications(
  notifications: GamificationNotification[],
  limit: number = 10
): GamificationNotification[] {
  return notifications
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

// Get high priority notifications
export function getHighPriorityNotifications(
  notifications: GamificationNotification[]
): GamificationNotification[] {
  const highPriorityTypes: NotificationType[] = [
    'ACHIEVEMENT_UNLOCKED',
    'LEVEL_UP',
    'MONTHLY_CHALLENGE_STARTING',
  ];
  
  return notifications.filter(notification =>
    highPriorityTypes.includes(notification.type)
  );
}

// Filter notifications by date range
export function getNotificationsByDateRange(
  notifications: GamificationNotification[],
  startDate: Date,
  endDate: Date
): GamificationNotification[] {
  return notifications.filter(notification =>
    notification.createdAt >= startDate && notification.createdAt <= endDate
  );
}

// Get notification statistics
export function getNotificationStats(
  notifications: GamificationNotification[]
): {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<string, number>;
} {
  const total = notifications.length;
  const unread = getUnreadNotificationsCount(notifications);
  
  const byType: Record<NotificationType, number> = {} as any;
  const byPriority: Record<string, number> = {};
  
  notifications.forEach(notification => {
    // Count by type
    byType[notification.type] = (byType[notification.type] || 0) + 1;
    
    // Count by priority
    const template = NOTIFICATION_TEMPLATES[notification.type];
    const priority = template?.priority || 'low';
    byPriority[priority] = (byPriority[priority] || 0) + 1;
  });
  
  return {
    total,
    unread,
    byType,
    byPriority,
  };
}

// Check if user should receive notification
export function shouldSendNotification(
  userId: string,
  notificationType: NotificationType,
  userSettings: any
): boolean {
  // Check user's notification preferences
  switch (notificationType) {
    case 'ACHIEVEMENT_UNLOCKED':
      return userSettings?.achievementNotifications !== false;
    case 'LEVEL_UP':
      return userSettings?.achievementNotifications !== false;
    case 'STREAK_MILESTONE':
      return userSettings?.achievementNotifications !== false;
    case 'CHALLENGE_INVITE':
      return userSettings?.challengeNotifications !== false;
    case 'DAILY_CHALLENGE_AVAILABLE':
      return userSettings?.challengeNotifications !== false;
    case 'WEEKLY_CHALLENGE_STARTING':
      return userSettings?.challengeNotifications !== false;
    case 'MONTHLY_CHALLENGE_STARTING':
      return userSettings?.challengeNotifications !== false;
    case 'PEER_ACHIEVEMENT':
      return userSettings?.socialFeedNotifications !== false;
    case 'LEADERBOARD_RANK_CHANGE':
      return userSettings?.socialFeedNotifications !== false;
    default:
      return true;
  }
}
