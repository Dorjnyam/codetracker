'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  Trophy,
  Star,
  Target,
  Award,
  TrendingUp,
  Users,
  Calendar,
  Filter
} from 'lucide-react';
import { 
  SocialFeed as SocialFeedType, 
  SocialComment 
} from '@/lib/gamification/achievement-system';
import { 
  likeFeedItem,
  addCommentToFeed,
  getRecentFeedItems,
  getTrendingFeedItems,
  getFeedByType
} from '@/lib/gamification/social-system';
import { cn } from '@/lib/utils';

interface SocialFeedProps {
  feeds: SocialFeedType[];
  currentUserId: string;
  onLike?: (feedId: string) => void;
  onComment?: (feedId: string, content: string) => void;
  onShare?: (feed: SocialFeedType) => void;
  className?: string;
  maxHeight?: number;
}

export function SocialFeed({
  feeds,
  currentUserId,
  onLike,
  onComment,
  onShare,
  className,
  maxHeight = 600,
}: SocialFeedProps) {
  const [filter, setFilter] = useState<'all' | 'achievements' | 'level_up' | 'challenges' | 'goals'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'trending'>('recent');
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  // Filter and sort feeds
  const filteredFeeds = (() => {
    let filtered = feeds;
    
    if (filter !== 'all') {
      filtered = getFeedByType(feeds, filter.toUpperCase() as any);
    }
    
    if (sortBy === 'recent') {
      filtered = getRecentFeedItems(filtered, 24 * 7); // Last week
    } else {
      filtered = getTrendingFeedItems(filtered);
    }
    
    return filtered;
  })();

  // Get feed icon
  const getFeedIcon = (type: string) => {
    switch (type) {
      case 'ACHIEVEMENT':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'LEVEL_UP':
        return <Star className="h-4 w-4 text-blue-500" />;
      case 'CHALLENGE_COMPLETED':
        return <Target className="h-4 w-4 text-green-500" />;
      case 'GOAL_ACHIEVED':
        return <Award className="h-4 w-4 text-purple-500" />;
      default:
        return <TrendingUp className="h-4 w-4 text-gray-500" />;
    }
  };

  // Format time
  const formatTime = (date: Date) => {
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

  // Handle like
  const handleLike = (feedId: string) => {
    onLike?.(feedId);
  };

  // Handle comment
  const handleComment = (feedId: string) => {
    if (newComment.trim()) {
      onComment?.(feedId, newComment.trim());
      setNewComment('');
      setShowComments(null);
    }
  };

  // Handle share
  const handleShare = (feed: SocialFeedType) => {
    onShare?.(feed);
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Social Feed
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={sortBy === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('recent')}
            >
              Recent
            </Button>
            <Button
              variant={sortBy === 'trending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('trending')}
            >
              Trending
            </Button>
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="whitespace-nowrap"
          >
            All
          </Button>
          <Button
            variant={filter === 'achievements' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('achievements')}
            className="whitespace-nowrap"
          >
            Achievements
          </Button>
          <Button
            variant={filter === 'level_up' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('level_up')}
            className="whitespace-nowrap"
          >
            Level Up
          </Button>
          <Button
            variant={filter === 'challenges' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('challenges')}
            className="whitespace-nowrap"
          >
            Challenges
          </Button>
          <Button
            variant={filter === 'goals' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('goals')}
            className="whitespace-nowrap"
          >
            Goals
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="w-full" style={{ maxHeight }}>
          <div className="space-y-4">
            {filteredFeeds.map(feed => (
              <Card key={feed.id} className="border-l-4 border-l-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/avatars/${feed.userId}.jpg`} />
                      <AvatarFallback>
                        {feed.userId.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">User {feed.userId}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          {formatTime(feed.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getFeedIcon(feed.type)}
                        <h4 className="font-medium">{feed.title}</h4>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    {feed.description}
                  </p>
                  
                  {/* Feed metadata */}
                  {feed.metadata && Object.keys(feed.metadata).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {feed.metadata.xpReward && (
                        <Badge variant="secondary" className="text-xs">
                          +{feed.metadata.xpReward} XP
                        </Badge>
                      )}
                      {feed.metadata.rarity && (
                        <Badge variant="outline" className="text-xs">
                          {feed.metadata.rarity}
                        </Badge>
                      )}
                      {feed.metadata.difficulty && (
                        <Badge variant="outline" className="text-xs">
                          {feed.metadata.difficulty}
                        </Badge>
                      )}
                      {feed.metadata.score && (
                        <Badge variant="outline" className="text-xs">
                          Score: {feed.metadata.score}
                        </Badge>
                      )}
                      {feed.metadata.rank && (
                        <Badge variant="outline" className="text-xs">
                          Rank: #{feed.metadata.rank}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(feed.id)}
                      className="flex items-center gap-1"
                    >
                      <Heart className="h-4 w-4" />
                      <span>{feed.likes}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowComments(showComments === feed.id ? null : feed.id)}
                      className="flex items-center gap-1"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{feed.comments.length}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(feed)}
                      className="flex items-center gap-1"
                    >
                      <Share className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                  
                  {/* Comments Section */}
                  {showComments === feed.id && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="space-y-3">
                        {/* Existing Comments */}
                        {feed.comments.map(comment => (
                          <div key={comment.id} className="flex items-start gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {comment.userId.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">User {comment.userId}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {/* Add Comment */}
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {currentUserId.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              placeholder="Write a comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleComment(feed.id);
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={() => handleComment(feed.id)}
                              disabled={!newComment.trim()}
                            >
                              Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
        
        {/* Empty State */}
        {filteredFeeds.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {filter === 'all' ? 'No posts yet' : `No ${filter} posts`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
