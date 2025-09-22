'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Loader2, Bell, Shield, Palette, Trash2 } from 'lucide-react';
import { ProfileForm } from '@/components/forms/ProfileForm';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settings, setSettings] = useState({
    theme: 'system',
    notifications: {
      email: true,
      push: true,
      assignments: true,
      achievements: true,
      collaborations: true,
    },
  });

  useEffect(() => {
    // Load user settings from session or API
    if (session?.user) {
      // You can fetch settings from API here
      // For now, using default settings
    }
  }, [session]);

  const handleThemeChange = async (theme: string) => {
    setIsLoading(true);
    setError('');

    try {
      // Update theme in database
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update theme');
      }

      setSettings(prev => ({ ...prev, theme }));
      setSuccess('Theme updated successfully!');

      // Update session
      await update();

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update theme');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = async (key: string, value: boolean) => {
    setIsLoading(true);
    setError('');

    try {
      const newSettings = {
        ...settings,
        notifications: {
          ...settings.notifications,
          [key]: value,
        },
      };

      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notifications: newSettings.notifications,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update notification settings');
      }

      setSettings(newSettings);
      setSuccess('Notification settings updated!');

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      // Redirect to home page after account deletion
      window.location.href = '/';

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete account');
      setIsLoading(false);
    }
  };

  if (!session?.user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Profile Settings */}
      <ProfileForm user={session.user} />

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="mr-2 h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how CodeTracker looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select value={settings.theme} onValueChange={handleThemeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose your preferred color scheme
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose what notifications you want to receive
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
                checked={settings.notifications.email}
                onCheckedChange={(value) => handleNotificationChange('email', value)}
                disabled={isLoading}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications in your browser
                </p>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={(value) => handleNotificationChange('push', value)}
                disabled={isLoading}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Assignment Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new assignments and deadlines
                </p>
              </div>
              <Switch
                checked={settings.notifications.assignments}
                onCheckedChange={(value) => handleNotificationChange('assignments', value)}
                disabled={isLoading}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Achievement Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when you unlock new achievements
                </p>
              </div>
              <Switch
                checked={settings.notifications.achievements}
                onCheckedChange={(value) => handleNotificationChange('achievements', value)}
                disabled={isLoading}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Collaboration Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about collaboration invitations and updates
                </p>
              </div>
              <Switch
                checked={settings.notifications.collaborations}
                onCheckedChange={(value) => handleNotificationChange('collaborations', value)}
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your account security and privacy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Change Password</Label>
            <Button variant="outline" size="sm">
              Update Password
            </Button>
            <p className="text-sm text-muted-foreground">
              Change your account password
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Two-Factor Authentication</Label>
            <Button variant="outline" size="sm">
              Enable 2FA
            </Button>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Connected Accounts</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">GitHub</span>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Google</span>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Link your social accounts for easier sign-in
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <Trash2 className="mr-2 h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Delete Account</Label>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAccount}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
