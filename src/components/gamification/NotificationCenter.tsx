'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  BellRing, 
  Check, 
  CheckCheck, 
  Filter,
  MoreHorizontal,
  Trophy,
  Star,
  Zap,
  Target,
  Users,
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react';
import { 
  GamificationNotification, 
  NotificationType 
} from '@/lib/gamification/achievement-system';
import { 
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationsCount,
  getRecentNotifications,
  getNotificationsByType,
  getNotificationStats
} from '@/lib/gamification/notification-system';
import { cn } from '@/lib/utils';

interface NotificationCenterProps {
  notifications: GamificationNotification[];
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onNotificationClick?: (notification: GamificationNotification) => void;
  className?: string;
  maxHeight?: number;
}

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
  className,
  maxHeight = 400,
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<NotificationType | 'ALL'>('ALL');
  const [showAll, setShowAll] = useState(false);

  const unreadCount = getUnreadNotificationsCount(notifications);
  const stats = getNotificationStats(notifications);
  
  const filteredNotifications = filter === 'ALL' 
    ? notifications 
    : getNotificationsByType(notifications, filter);
  
  const displayNotifications = showAll 
    ? filteredNotifications 
    : getRecentNotifications(filteredNotifications, 10);

  // Get notification icon
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'ACHIEVEMENT_UNLOCKED':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'LEVEL_UP':
        return <Star className="h-4 w-4 text-blue-500" />;
      case 'STREAK_MILESTONE':
        return <Zap className="h-4 w-4 text-orange-500" />;
      case 'CHALLENGE_INVITE':
      case 'DAILY_CHALLENGE_AVAILABLE':
      case 'WEEKLY_CHALLENGE_STARTING':
      case 'MONTHLY_CHALLENGE_STARTING':
        return <Target className="h-4 w-4 text-green-500" />;
      case 'GOAL_COMPLETED':
        return <Award className="h-4 w-4 text-purple-500" />;
      case 'LEADERBOARD_RANK_CHANGE':
        return <TrendingUp className="h-4 w-4 text-indigo-500" />;
      case 'PEER_ACHIEVEMENT':
        return <Users className="h-4 w-4 text-pink-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get notification priority color
  const getPriorityColor = (type: NotificationType) => {
    switch (type) {
      case 'ACHIEVEMENT_UNLOCKED':
      case 'LEVEL_UP':
      case 'MONTHLY_CHALLENGE_STARTING':
        return 'border-l-4 border-l-red-500';
      case 'STREAK_MILESTONE':
      case 'CHALLENGE_INVITE':
      case 'WEEKLY_CHALLENGE_STARTING':
        return 'border-l-4 border-l-yellow-500';
      default:
        return 'border-l-4 border-l-blue-500';
    }
  };

  // Format notification time
  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = (notificationId: string) => {
    onMarkAsRead?.(notificationId);
  };

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead?.();
  };

  const handleNotificationClick = (notification: GamificationNotification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    onNotificationClick?.(notification);
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {unreadCount > 0 ? (
              <BellRing className="h-5 w-5 text-primary" />
            ) : (
              <Bell className="h-5 w-5 text-muted-foreground" />
            )}
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1"
              >
                <CheckCheck className="h-3 w-3" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto">
          <Button
            variant={filter === 'ALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('ALL')}
            className="whitespace-nowrap"
          >
            All ({stats.total})
          </Button>
          <Button
            variant={filter === 'ACHIEVEMENT_UNLOCKED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('ACHIEVEMENT_UNLOCKED')}
            className="whitespace-nowrap"
          >
            Achievements ({stats.byType.ACHIEVEMENT_UNLOCKED || 0})
          </Button>
          <Button
            variant={filter === 'CHALLENGE_INVITE' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('CHALLENGE_INVITE')}
            className="whitespace-nowrap"
          >
            Challenges ({stats.byType.CHALLENGE_INVITE || 0})
          </Button>
          <Button
            variant={filter === 'LEVEL_UP' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('LEVEL_UP')}
            className="whitespace-nowrap"
          >
            Level Up ({stats.byType.LEVEL_UP || 0})
          </Button>
        </div>

        {/* Notifications List */}
        <ScrollArea className="w-full" style={{ maxHeight }}>
          <div className="space-y-2">
            {displayNotifications.map(notification => (
              <div
                key={notification.id}
                className={cn(
                  'p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50',
                  getPriorityColor(notification.type),
                  !notification.isRead && 'bg-muted/30'
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={cn(
                        'text-sm font-medium',
                        !notification.isRead && 'font-semibold'
                      )}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {formatNotificationTime(notification.createdAt)}
                        </span>
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    
                    {/* Notification metadata */}
                    {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {notification.metadata.xpReward && (
                          <Badge variant="secondary" className="text-xs">
                            +{notification.metadata.xpReward} XP
                          </Badge>
                        )}
                        {notification.metadata.rarity && (
                          <Badge variant="outline" className="text-xs">
                            {notification.metadata.rarity}
                          </Badge>
                        )}
                        {notification.metadata.difficulty && (
                          <Badge variant="outline" className="text-xs">
                            {notification.metadata.difficulty}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Show More/Less Button */}
        {filteredNotifications.length > 10 && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : `Show All ${filteredNotifications.length} Notifications`}
            </Button>
          </div>
        )}

        {/* Empty State */}
        {displayNotifications.length === 0 && (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {filter === 'ALL' ? 'No notifications yet' : `No ${filter.toLowerCase()} notifications`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
