'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Save,
  CheckCircle,
  AlertCircle,
  Settings,
  Mail,
  Github,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useSettingsStore } from '@/store/settings';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useFontSize } from '@/components/providers/FontSizeProvider';
import { useCompactMode } from '@/components/providers/CompactModeProvider';
import { supportedLanguages } from '@/lib/i18n';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Get settings from store
  const { 
    appearance, 
    notifications, 
    privacy, 
    profile,
    updateAppearance,
    updateNotifications,
    updatePrivacy,
    updateProfile
  } = useSettingsStore();

  // Get theme and language hooks
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { fontSize, setFontSize } = useFontSize();
  const { compactMode, setCompactMode } = useCompactMode();

  // Initialize profile data from session
  useEffect(() => {
    if (session?.user && !profile.name) {
      updateProfile({
        name: session.user.name || '',
        githubUsername: session.user.githubUsername || '',
      });
    }
  }, [session, profile.name, updateProfile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call - in real app, this would save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  // Handle appearance changes immediately
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    updateAppearance({ theme: newTheme });
  };

  const handleLanguageChange = (newLanguage: 'en' | 'mn' | 'es' | 'fr' | 'de' | 'zh') => {
    setLanguage(newLanguage);
    updateAppearance({ language: newLanguage });
  };

  const handleFontSizeChange = (newFontSize: 'small' | 'medium' | 'large') => {
    setFontSize(newFontSize);
    updateAppearance({ fontSize: newFontSize });
  };

  const handleCompactModeChange = (newCompactMode: boolean) => {
    setCompactMode(newCompactMode);
    updateAppearance({ compactMode: newCompactMode });
  };

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('settings')}</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Save Status */}
        {saved && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{t('success')} - Settings saved successfully!</AlertDescription>
          </Alert>
        )}

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('profile')}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              {t('notifications')}
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t('privacy')}
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              {t('appearance')}
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t('profile')} Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('fullName')}</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => updateProfile({ name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={session?.user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">{t('bio')}</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => updateProfile({ bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="institution">{t('institution')}</Label>
                    <Input
                      id="institution"
                      value={profile.institution}
                      onChange={(e) => updateProfile({ institution: e.target.value })}
                      placeholder="School, university, or organization"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="githubUsername">{t('githubUsername')}</Label>
                    <Input
                      id="githubUsername"
                      value={profile.githubUsername}
                      onChange={(e) => updateProfile({ githubUsername: e.target.value })}
                      placeholder="Your GitHub username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('preferredLanguages')}</Label>
                  <div className="flex flex-wrap gap-2">
                    {['javascript', 'python', 'java', 'cpp', 'typescript', 'go', 'rust'].map((lang) => (
                      <Button
                        key={lang}
                        variant={profile.preferredLanguages.includes(lang) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          const languages = profile.preferredLanguages.includes(lang)
                            ? profile.preferredLanguages.filter(l => l !== lang)
                            : [...profile.preferredLanguages, lang];
                          updateProfile({ preferredLanguages: languages });
                        }}
                      >
                        {lang}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  {t('notifications')} Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified about activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => 
                        updateNotifications({ emailNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive browser push notifications
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => 
                        updateNotifications({ pushNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Assignment Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminded about upcoming assignments
                      </p>
                    </div>
                    <Switch
                      checked={notifications.assignmentReminders}
                      onCheckedChange={(checked) => 
                        updateNotifications({ assignmentReminders: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Achievement Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when you unlock achievements
                      </p>
                    </div>
                    <Switch
                      checked={notifications.achievementNotifications}
                      onCheckedChange={(checked) => 
                        updateNotifications({ achievementNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Collaboration Invites</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about collaboration invitations
                      </p>
                    </div>
                    <Switch
                      checked={notifications.collaborationInvites}
                      onCheckedChange={(checked) => 
                        updateNotifications({ collaborationInvites: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Forum Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about forum activity
                      </p>
                    </div>
                    <Switch
                      checked={notifications.forumUpdates}
                      onCheckedChange={(checked) => 
                        updateNotifications({ forumUpdates: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t('privacy')} & Security
                </CardTitle>
                <CardDescription>
                  Control your privacy settings and data visibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Profile Visibility</Label>
                    <Select
                      value={privacy.profileVisibility}
                      onValueChange={(value: 'public' | 'friends' | 'private') => 
                        updatePrivacy({ profileVisibility: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="friends">Friends Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Email Address</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to see your email address
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showEmail}
                      onCheckedChange={(checked) => 
                        updatePrivacy({ showEmail: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Activity</Label>
                      <p className="text-sm text-muted-foreground">
                        Show your coding activity to others
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showActivity}
                      onCheckedChange={(checked) => 
                        updatePrivacy({ showActivity: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Achievements</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your achievements publicly
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showAchievements}
                      onCheckedChange={(checked) => 
                        updatePrivacy({ showAchievements: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Direct Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow other users to send you direct messages
                      </p>
                    </div>
                    <Switch
                      checked={privacy.allowDirectMessages}
                      onCheckedChange={(checked) => 
                        updatePrivacy({ allowDirectMessages: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  {t('appearance')} & Display
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('theme')}</Label>
                    <Select
                      value={appearance.theme}
                      onValueChange={handleThemeChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">{t('light')}</SelectItem>
                        <SelectItem value="dark">{t('dark')}</SelectItem>
                        <SelectItem value="system">{t('system')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Changes apply immediately
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('language')}</Label>
                    <Select
                      value={appearance.language}
                      onValueChange={handleLanguageChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {supportedLanguages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            <div className="flex items-center gap-2">
                              <span>{lang.flag}</span>
                              <span>{lang.nativeName}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Changes apply immediately
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('fontSize')}</Label>
                    <Select
                      value={appearance.fontSize}
                      onValueChange={handleFontSizeChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">{t('small')}</SelectItem>
                        <SelectItem value="medium">{t('medium')}</SelectItem>
                        <SelectItem value="large">{t('large')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Changes apply immediately
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t('compactMode')}</Label>
                      <p className="text-sm text-muted-foreground">
                        Use a more compact interface layout
                      </p>
                    </div>
                    <Switch
                      checked={appearance.compactMode}
                      onCheckedChange={handleCompactModeChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="min-w-[120px]">
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('loading')}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {t('save')}
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
