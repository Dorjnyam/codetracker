import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface UIState {
  // Sidebar state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;

  // Theme state
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Mobile navigation
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  // Search state
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Notifications
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;

  // User profile menu
  profileMenuOpen: boolean;
  setProfileMenuOpen: (open: boolean) => void;

  // Quick actions
  quickActionsOpen: boolean;
  setQuickActionsOpen: (open: boolean) => void;

  // Breadcrumbs
  breadcrumbs: Array<{ label: string; href?: string }>;
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; href?: string }>) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Error state
  error: string | null;
  setError: (error: string | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Sidebar state
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // Theme state
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // Mobile navigation
      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

      // Search state
      searchOpen: false,
      setSearchOpen: (open) => set({ searchOpen: open }),

      // Notifications
      notificationsOpen: false,
      setNotificationsOpen: (open) => set({ notificationsOpen: open }),

      // User profile menu
      profileMenuOpen: false,
      setProfileMenuOpen: (open) => set({ profileMenuOpen: open }),

      // Quick actions
      quickActionsOpen: false,
      setQuickActionsOpen: (open) => set({ quickActionsOpen: open }),

      // Breadcrumbs
      breadcrumbs: [],
      setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),

      // Loading states
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      // Error state
      error: null,
      setError: (error) => set({ error }),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);
