import { 
  UserFollow, 
  SocialFeed, 
  SocialComment,
  UserProgress,
  UserAchievement,
  Challenge
} from './achievement-system';

// Social system configuration
export const SOCIAL_CONFIG = {
  MAX_FOLLOWERS: 1000,
  MAX_FOLLOWING: 500,
  FEED_ITEMS_PER_PAGE: 20,
  COMMENTS_PER_PAGE: 10,
  ACHIEVEMENT_SHARE_DELAY: 5 * 60 * 1000, // 5 minutes
};

// Follow a user
export function followUser(
  followerId: string,
  followingId: string,
  existingFollows: UserFollow[]
): { success: boolean; message: string; follow?: UserFollow } {
  // Check if already following
  const existingFollow = existingFollows.find(
    follow => follow.followerId === followerId && follow.followingId === followingId
  );
  
  if (existingFollow) {
    return { success: false, message: 'You are already following this user' };
  }
  
  // Check follower limit
  const followerCount = existingFollows.filter(f => f.followerId === followerId).length;
  if (followerCount >= SOCIAL_CONFIG.MAX_FOLLOWING) {
    return { success: false, message: 'You have reached the maximum following limit' };
  }
  
  // Check following limit
  const followingCount = existingFollows.filter(f => f.followingId === followingId).length;
  if (followingCount >= SOCIAL_CONFIG.MAX_FOLLOWERS) {
    return { success: false, message: 'This user has reached the maximum followers limit' };
  }
  
  // Create follow relationship
  const newFollow: UserFollow = {
    id: `follow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    followerId,
    followingId,
    createdAt: new Date(),
    follower: {} as any, // Would be populated from database
    following: {} as any, // Would be populated from database
  };
  
  return {
    success: true,
    message: 'Successfully followed user',
    follow: newFollow,
  };
}

// Unfollow a user
export function unfollowUser(
  followerId: string,
  followingId: string,
  existingFollows: UserFollow[]
): { success: boolean; message: string } {
  const followIndex = existingFollows.findIndex(
    follow => follow.followerId === followerId && follow.followingId === followingId
  );
  
  if (followIndex === -1) {
    return { success: false, message: 'You are not following this user' };
  }
  
  existingFollows.splice(followIndex, 1);
  
  return {
    success: true,
    message: 'Successfully unfollowed user',
  };
}

// Get user's followers
export function getUserFollowers(
  userId: string,
  follows: UserFollow[]
): UserFollow[] {
  return follows.filter(follow => follow.followingId === userId);
}

// Get user's following
export function getUserFollowing(
  userId: string,
  follows: UserFollow[]
): UserFollow[] {
  return follows.filter(follow => follow.followerId === userId);
}

// Check if user is following another user
export function isFollowing(
  followerId: string,
  followingId: string,
  follows: UserFollow[]
): boolean {
  return follows.some(
    follow => follow.followerId === followerId && follow.followingId === followingId
  );
}

// Create social feed item
export function createSocialFeedItem(
  userId: string,
  type: 'ACHIEVEMENT' | 'LEVEL_UP' | 'CHALLENGE_COMPLETED' | 'GOAL_ACHIEVED',
  title: string,
  description: string,
  metadata: Record<string, any> = {},
  isPublic: boolean = true
): SocialFeed {
  return {
    id: `feed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type,
    title,
    description,
    metadata,
    createdAt: new Date(),
    isPublic,
    likes: 0,
    comments: [],
  };
}

// Create achievement feed item
export function createAchievementFeedItem(
  userId: string,
  achievement: UserAchievement,
  isPublic: boolean = true
): SocialFeed {
  return createSocialFeedItem(
    userId,
    'ACHIEVEMENT',
    `Unlocked "${achievement.achievement.name}"`,
    achievement.achievement.description,
    {
      achievementId: achievement.achievementId,
      rarity: achievement.achievement.rarity,
      xpReward: achievement.achievement.xpReward,
      icon: achievement.achievement.icon,
    },
    isPublic
  );
}

// Create level up feed item
export function createLevelUpFeedItem(
  userId: string,
  newLevel: number,
  oldLevel: number,
  isPublic: boolean = true
): SocialFeed {
  return createSocialFeedItem(
    userId,
    'LEVEL_UP',
    `Reached Level ${newLevel}!`,
    `Leveled up from ${oldLevel} to ${newLevel}`,
    {
      newLevel,
      oldLevel,
      levelGain: newLevel - oldLevel,
    },
    isPublic
  );
}

// Create challenge completion feed item
export function createChallengeCompletionFeedItem(
  userId: string,
  challenge: Challenge,
  score: number,
  rank: number,
  isPublic: boolean = true
): SocialFeed {
  return createSocialFeedItem(
    userId,
    'CHALLENGE_COMPLETED',
    `Completed "${challenge.title}"`,
    `Scored ${score} points and ranked #${rank}`,
    {
      challengeId: challenge.id,
      challengeType: challenge.type,
      difficulty: challenge.difficulty,
      score,
      rank,
      xpReward: challenge.xpReward,
    },
    isPublic
  );
}

// Create goal achievement feed item
export function createGoalAchievementFeedItem(
  userId: string,
  goal: any,
  isPublic: boolean = true
): SocialFeed {
  return createSocialFeedItem(
    userId,
    'GOAL_ACHIEVED',
    `Completed "${goal.title}"`,
    `Achieved ${goal.target} ${goal.unit}`,
    {
      goalId: goal.id,
      goalType: goal.type,
      target: goal.target,
      unit: goal.unit,
    },
    isPublic
  );
}

// Add comment to feed item
export function addCommentToFeed(
  feedId: string,
  userId: string,
  content: string,
  feeds: SocialFeed[]
): { success: boolean; message: string; comment?: SocialComment } {
  const feed = feeds.find(f => f.id === feedId);
  
  if (!feed) {
    return { success: false, message: 'Feed item not found' };
  }
  
  if (!feed.isPublic) {
    return { success: false, message: 'Cannot comment on private feed item' };
  }
  
  const comment: SocialComment = {
    id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    feedId,
    userId,
    content,
    createdAt: new Date(),
    user: {} as any, // Would be populated from database
  };
  
  feed.comments.push(comment);
  
  return {
    success: true,
    message: 'Comment added successfully',
    comment,
  };
}

// Like a feed item
export function likeFeedItem(
  feedId: string,
  feeds: SocialFeed[]
): { success: boolean; message: string; likes?: number } {
  const feed = feeds.find(f => f.id === feedId);
  
  if (!feed) {
    return { success: false, message: 'Feed item not found' };
  }
  
  if (!feed.isPublic) {
    return { success: false, message: 'Cannot like private feed item' };
  }
  
  feed.likes += 1;
  
  return {
    success: true,
    message: 'Feed item liked',
    likes: feed.likes,
  };
}

// Get user's social feed
export function getUserSocialFeed(
  userId: string,
  feeds: SocialFeed[],
  follows: UserFollow[],
  limit: number = SOCIAL_CONFIG.FEED_ITEMS_PER_PAGE
): SocialFeed[] {
  // Get user's own posts and posts from users they follow
  const followingIds = getUserFollowing(userId, follows).map(f => f.followingId);
  const feedUserIds = [userId, ...followingIds];
  
  return feeds
    .filter(feed => 
      feedUserIds.includes(feed.userId) && 
      feed.isPublic
    )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

// Get feed by type
export function getFeedByType(
  feeds: SocialFeed[],
  type: 'ACHIEVEMENT' | 'LEVEL_UP' | 'CHALLENGE_COMPLETED' | 'GOAL_ACHIEVED'
): SocialFeed[] {
  return feeds.filter(feed => feed.type === type);
}

// Get recent feed items
export function getRecentFeedItems(
  feeds: SocialFeed[],
  hours: number = 24,
  limit: number = 10
): SocialFeed[] {
  const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
  
  return feeds
    .filter(feed => feed.createdAt >= cutoffTime && feed.isPublic)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

// Get trending feed items
export function getTrendingFeedItems(
  feeds: SocialFeed[],
  limit: number = 10
): SocialFeed[] {
  return feeds
    .filter(feed => feed.isPublic)
    .sort((a, b) => {
      // Sort by likes and recency
      const scoreA = a.likes + (a.comments.length * 2) + (Date.now() - a.createdAt.getTime()) / (1000 * 60 * 60);
      const scoreB = b.likes + (b.comments.length * 2) + (Date.now() - b.createdAt.getTime()) / (1000 * 60 * 60);
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

// Get social statistics
export function getSocialStats(
  userId: string,
  follows: UserFollow[],
  feeds: SocialFeed[]
): {
  followers: number;
  following: number;
  posts: number;
  likes: number;
  comments: number;
  engagement: number;
} {
  const followers = getUserFollowers(userId, follows).length;
  const following = getUserFollowing(userId, follows).length;
  const userFeeds = feeds.filter(feed => feed.userId === userId && feed.isPublic);
  const posts = userFeeds.length;
  const likes = userFeeds.reduce((sum, feed) => sum + feed.likes, 0);
  const comments = userFeeds.reduce((sum, feed) => sum + feed.comments.length, 0);
  const engagement = posts > 0 ? (likes + comments) / posts : 0;
  
  return {
    followers,
    following,
    posts,
    likes,
    comments,
    engagement: Math.round(engagement * 100) / 100,
  };
}

// Get recommended users to follow
export function getRecommendedUsers(
  userId: string,
  follows: UserFollow[],
  userProgress: UserProgress[]
): string[] {
  const followingIds = getUserFollowing(userId, follows).map(f => f.followingId);
  const currentUser = userProgress.find(u => u.userId === userId);
  
  if (!currentUser) return [];
  
  // Find users with similar levels and interests
  const recommendations = userProgress
    .filter(user => 
      user.userId !== userId && 
      !followingIds.includes(user.userId) &&
      Math.abs(user.currentLevel - currentUser.currentLevel) <= 2
    )
    .sort((a, b) => {
      // Sort by level similarity and total XP
      const levelDiffA = Math.abs(a.currentLevel - currentUser.currentLevel);
      const levelDiffB = Math.abs(b.currentLevel - currentUser.currentLevel);
      
      if (levelDiffA !== levelDiffB) {
        return levelDiffA - levelDiffB;
      }
      
      return b.totalXP - a.totalXP;
    })
    .slice(0, 10)
    .map(user => user.userId);
  
  return recommendations;
}

// Check if user can share achievement
export function canShareAchievement(
  userId: string,
  achievement: UserAchievement,
  recentShares: SocialFeed[]
): { canShare: boolean; reason?: string } {
  // Check if achievement was already shared recently
  const recentShare = recentShares.find(feed =>
    feed.userId === userId &&
    feed.type === 'ACHIEVEMENT' &&
    feed.metadata.achievementId === achievement.achievementId &&
    (Date.now() - feed.createdAt.getTime()) < SOCIAL_CONFIG.ACHIEVEMENT_SHARE_DELAY
  );
  
  if (recentShare) {
    return {
      canShare: false,
      reason: 'You have already shared this achievement recently',
    };
  }
  
  return { canShare: true };
}

// Get user's social activity summary
export function getUserSocialActivitySummary(
  userId: string,
  feeds: SocialFeed[],
  follows: UserFollow[]
): {
  recentPosts: number;
  recentLikes: number;
  recentComments: number;
  newFollowers: number;
  engagement: number;
} {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  const userFeeds = feeds.filter(feed => feed.userId === userId);
  const recentPosts = userFeeds.filter(feed => feed.createdAt >= oneWeekAgo).length;
  const recentLikes = userFeeds.reduce((sum, feed) => sum + feed.likes, 0);
  const recentComments = userFeeds.reduce((sum, feed) => sum + feed.comments.length, 0);
  
  const followers = getUserFollowers(userId, follows);
  const newFollowers = followers.filter(follow => follow.createdAt >= oneWeekAgo).length;
  
  const engagement = recentPosts > 0 ? (recentLikes + recentComments) / recentPosts : 0;
  
  return {
    recentPosts,
    recentLikes,
    recentComments,
    newFollowers,
    engagement: Math.round(engagement * 100) / 100,
  };
}
