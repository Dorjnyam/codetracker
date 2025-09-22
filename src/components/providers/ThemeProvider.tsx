'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useTheme as useNextTheme } from 'next-themes';
import { useUIStore } from '@/store/ui';
import { optimizeThemeTransitions } from '@/lib/theme-optimization';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resolvedTheme: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const { setTheme: setUITheme } = useUIStore();

  // Optimize theme transitions on mount
  useEffect(() => {
    const cleanup = optimizeThemeTransitions();
    return cleanup;
  }, []);

  // Optimized theme setter that batches changes
  const optimizedSetTheme = useCallback((newTheme: 'light' | 'dark' | 'system') => {
    // Batch the theme change to prevent multiple reflows
    requestAnimationFrame(() => {
      setTheme(newTheme);
      setUITheme(newTheme);
    });
  }, [setTheme, setUITheme]);

  // Sync with UI store
  useEffect(() => {
    setUITheme(theme as 'light' | 'dark' | 'system');
  }, [theme, setUITheme]);
  return (
    <ThemeContext.Provider value={{ theme: theme || 'system', setTheme: optimizedSetTheme, resolvedTheme: resolvedTheme || 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
