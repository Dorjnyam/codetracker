'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Trophy, 
  Star, 
  Target, 
  Award,
  Share,
  Edit,
  Settings,
  Crown,
  Zap,
  Code,
  Users,
  BarChart3,
  Activity,
  Github,
  Mail,
  MapPin,
  Globe,
  Building
} from 'lucide-react';
import { 
  UserProgress, 
  UserAchievement, 
  AchievementCategory,
  AchievementRarity
} from '@/lib/gamification/achievement-system';
import { getLevelInfo, getLevelProgress } from '@/lib/gamification/xp-system';
import { ACHIEVEMENTS } from '@/lib/gamification/achievement-system';
import { RoleRequestForm } from '@/components/profile/RoleRequestForm';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [githubData, setGithubData] = useState<{
    avatar_url: string;
    name: string;
    login: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    public_gists: number;
    location: string;
    blog: string;
    company: string;
    html_url: string;
  } | null>(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user) return;

      try {
        setLoading(true);

        // Fetch user progress (mock for now, but would be real API call)
        const progressResponse = await fetch('/api/user/progress');
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setUserProgress(progressData);
        } else {
          // Fallback to mock data if API fails
          setUserProgress({
            userId: session.user.id || 'user1',
            currentLevel: 5,
            currentXP: 2500,
            totalXP: 15000,
            streak: 7,
            lastActiveDate: new Date(),
            weeklyXP: 500,
            monthlyXP: 2000,
            languageXP: {
              javascript: 8000,
              python: 4000,
              typescript: 3000,
            },
        skillLevels: {
          javascript: { 
            level: 6, 
            xp: 8000, 
            language: 'javascript',
            proficiency: 'INTERMEDIATE',
            badges: [],
            milestones: []
          },
          python: { 
            level: 4, 
            xp: 4000, 
            language: 'python',
            proficiency: 'BEGINNER',
            badges: [],
            milestones: []
          },
          typescript: { 
            level: 3, 
            xp: 3000, 
            language: 'typescript',
            proficiency: 'BEGINNER',
            badges: [],
            milestones: []
          },
        },
            achievements: [],
            goals: [],
            challenges: [],
          });
        }

        // Fetch user achievements (mock for now)
        const achievementsResponse = await fetch('/api/user/achievements');
        if (achievementsResponse.ok) {
          const achievementsData = await achievementsResponse.json();
          setUserAchievements(achievementsData);
        } else {
          // Fallback to mock achievements
          setUserAchievements([
            {
              id: '1',
              userId: session.user.id || 'user1',
              achievementId: 'first-login',
              unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              progress: {},
              isNotified: true,
              achievement: ACHIEVEMENTS[0],
            },
            {
              id: '2',
              userId: session.user.id || 'user1',
              achievementId: 'github-connected',
              unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              progress: {},
              isNotified: true,
              achievement: ACHIEVEMENTS[1],
            },
          ]);
        }

        // Fetch GitHub data if user has GitHub connected
        if (session.user.githubUsername) {
          try {
            const githubResponse = await fetch(`/api/github/user/${session.user.githubUsername}`);
            if (githubResponse.ok) {
              const githubUserData = await githubResponse.json();
              setGithubData(githubUserData);
            } else {
              console.warn('GitHub API request failed:', await githubResponse.text());
            }
          } catch (error) {
            console.error('Failed to fetch GitHub data:', error);
          }
        }

      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session]);

  const getRarityColor = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'COMMON':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'UNCOMMON':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'RARE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'EPIC':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'LEGENDARY':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category: AchievementCategory) => {
    switch (category) {
      case 'STREAK':
        return <Zap className="h-4 w-4" />;
      case 'LANGUAGE_MASTERY':
        return <Code className="h-4 w-4" />;
      case 'ASSIGNMENT_COMPLETION':
        return <Target className="h-4 w-4" />;
      case 'COLLABORATION':
        return <Users className="h-4 w-4" />;
      case 'CODE_QUALITY':
        return <Award className="h-4 w-4" />;
      case 'MENTORING':
        return <Users className="h-4 w-4" />;
      case 'CHALLENGE':
        return <Trophy className="h-4 w-4" />;
      case 'SPECIAL_EVENT':
        return <Crown className="h-4 w-4" />;
      case 'HIDDEN':
        return <Award className="h-4 w-4" />;
      case 'SOCIAL':
        return <Users className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };


  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session?.user) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Please sign in to view your profile</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!userProgress) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No profile data available</p>
        </div>
      </DashboardLayout>
    );
  }

  const levelInfo = getLevelInfo(userProgress.currentLevel);
  const levelProgress = getLevelProgress(userProgress.totalXP);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
          <CardContent className="relative p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={session.user.image || ''} />
                <AvatarFallback className="text-2xl font-bold">
                  {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{session.user.name || session.user.email}</h1>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Level {userProgress.currentLevel}
                  </Badge>
                  {session.user.role && (
                    <Badge variant="secondary" className="capitalize">
                      {session.user.role.toLowerCase()}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{session.user.email}</span>
                  </div>
                  {session.user.githubUsername && (
                    <div className="flex items-center gap-1">
                      <Github className="h-4 w-4" />
                      <span>@{session.user.githubUsername}</span>
                    </div>
                  )}
                </div>

                <p className="text-muted-foreground mb-4">
                  Coding enthusiast • {userProgress.streak} day streak • {userProgress.totalXP.toLocaleString()} total XP
                </p>
                
                {/* Level Progress */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Level Progress</span>
                    <span>{levelProgress.progressPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${levelProgress.progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{userProgress.currentXP.toLocaleString()} XP</span>
                    <span>{levelInfo.xpRequired.toLocaleString()} XP required</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total XP</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProgress.totalXP.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                All time
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userAchievements.length}</div>
              <p className="text-xs text-muted-foreground">
                Unlocked
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coding Streak</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProgress.streak}</div>
              <p className="text-xs text-muted-foreground">
                Days
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Languages</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(userProgress.languageXP).length}</div>
              <p className="text-xs text-muted-foreground">
                Mastered
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="role">Role</TabsTrigger>
            </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userAchievements.slice(0, 3).map(achievement => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="text-2xl">{achievement.achievement.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium">{achievement.achievement.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {achievement.achievement.description}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getRarityColor(achievement.achievement.rarity)}>
                              {achievement.achievement.rarity}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Language Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Language Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(userProgress.skillLevels).map(([language, skill]) => (
                      <div key={language} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize">
                              {language}
                            </Badge>
                            <span className="text-sm font-medium">Level {skill.level}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {skill.xp.toLocaleString()} XP
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(skill.xp / 20000) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* GitHub Information */}
            {githubData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    GitHub Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={githubData.avatar_url} />
                        <AvatarFallback>{githubData.login?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{githubData.name || githubData.login}</h3>
                        <p className="text-muted-foreground">@{githubData.login}</p>
                        {githubData.bio && (
                          <p className="text-sm text-muted-foreground mt-1">{githubData.bio}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{githubData.public_repos || 0}</div>
                        <div className="text-sm text-muted-foreground">Repositories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{githubData.followers || 0}</div>
                        <div className="text-sm text-muted-foreground">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{githubData.following || 0}</div>
                        <div className="text-sm text-muted-foreground">Following</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{githubData.public_gists || 0}</div>
                        <div className="text-sm text-muted-foreground">Gists</div>
                      </div>
                    </div>

                    {githubData.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{githubData.location}</span>
                      </div>
                    )}

                    {githubData.blog && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        <a href={githubData.blog} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                          {githubData.blog}
                        </a>
                      </div>
                    )}

                    {githubData.company && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-4 w-4" />
                        <span>{githubData.company}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={githubData.html_url} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          View on GitHub
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userAchievements.map(achievement => (
                <Card key={achievement.id} className="relative overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{achievement.achievement.icon}</div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{achievement.achievement.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {achievement.achievement.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getRarityColor(achievement.achievement.rarity)}>
                          {achievement.achievement.rarity}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getCategoryIcon(achievement.achievement.category)}
                          {achievement.achievement.category.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">XP Reward</span>
                        <span className="font-medium">+{achievement.achievement.xpReward}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Unlocked</span>
                        <span className="font-medium">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Skill Progression
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(userProgress.skillLevels).map(([language, skill]) => (
                    <div key={language} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {language}
                          </Badge>
                          <span className="font-medium">Level {skill.level}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {skill.xp.toLocaleString()} XP
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div 
                          className="bg-primary h-3 rounded-full transition-all duration-300"
                          style={{ width: `${(skill.xp / 20000) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0 XP</span>
                        <span>20,000 XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userAchievements.slice(0, 5).map(achievement => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="text-2xl">{achievement.achievement.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium">Unlocked &ldquo;{achievement.achievement.name}&rdquo;</div>
                        <div className="text-sm text-muted-foreground">
                          {achievement.achievement.description}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            +{achievement.achievement.xpReward} XP
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Role Tab */}
          <TabsContent value="role" className="space-y-4">
            <RoleRequestForm />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
