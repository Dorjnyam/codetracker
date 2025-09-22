import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'mn' | 'es' | 'fr' | 'de' | 'zh';
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  assignmentReminders: boolean;
  achievementNotifications: boolean;
  collaborationInvites: boolean;
  forumUpdates: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showEmail: boolean;
  showActivity: boolean;
  showAchievements: boolean;
  allowDirectMessages: boolean;
}

export interface ProfileSettings {
  name: string;
  bio: string;
  institution: string;
  githubUsername: string;
  preferredLanguages: string[];
}

export interface SettingsState {
  appearance: AppearanceSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  profile: ProfileSettings;
  
  // Actions
  updateAppearance: (settings: Partial<AppearanceSettings>) => void;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  updatePrivacy: (settings: Partial<PrivacySettings>) => void;
  updateProfile: (settings: Partial<ProfileSettings>) => void;
  resetSettings: () => void;
}

const defaultAppearance: AppearanceSettings = {
  theme: 'system',
  language: 'en',
  fontSize: 'medium',
  compactMode: false,
};

const defaultNotifications: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  assignmentReminders: true,
  achievementNotifications: true,
  collaborationInvites: true,
  forumUpdates: false,
};

const defaultPrivacy: PrivacySettings = {
  profileVisibility: 'public',
  showEmail: false,
  showActivity: true,
  showAchievements: true,
  allowDirectMessages: true,
};

const defaultProfile: ProfileSettings = {
  name: '',
  bio: '',
  institution: '',
  githubUsername: '',
  preferredLanguages: ['javascript', 'python'],
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      appearance: defaultAppearance,
      notifications: defaultNotifications,
      privacy: defaultPrivacy,
      profile: defaultProfile,

      updateAppearance: (settings) =>
        set((state) => ({
          appearance: { ...state.appearance, ...settings },
        })),

      updateNotifications: (settings) =>
        set((state) => ({
          notifications: { ...state.notifications, ...settings },
        })),

      updatePrivacy: (settings) =>
        set((state) => ({
          privacy: { ...state.privacy, ...settings },
        })),

      updateProfile: (settings) =>
        set((state) => ({
          profile: { ...state.profile, ...settings },
        })),

      resetSettings: () =>
        set({
          appearance: defaultAppearance,
          notifications: defaultNotifications,
          privacy: defaultPrivacy,
          profile: defaultProfile,
        }),
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        appearance: state.appearance,
        notifications: state.notifications,
        privacy: state.privacy,
        profile: state.profile,
      }),
    }
  )
);
