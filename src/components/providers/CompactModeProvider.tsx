'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useSettingsStore } from '@/store/settings';

interface CompactModeContextType {
  compactMode: boolean;
  setCompactMode: (compactMode: boolean) => void;
}

const CompactModeContext = createContext<CompactModeContextType | undefined>(undefined);

export function CompactModeProvider({ children }: { children: React.ReactNode }) {
  const { appearance, updateAppearance } = useSettingsStore();
  const { compactMode } = appearance;

  const setCompactMode = (newCompactMode: boolean) => {
    updateAppearance({ compactMode: newCompactMode });
  };

  // Apply compact mode to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
  }, [compactMode]);

  return (
    <CompactModeContext.Provider value={{ compactMode, setCompactMode }}>
      {children}
    </CompactModeContext.Provider>
  );
}

export function useCompactMode() {
  const context = useContext(CompactModeContext);
  if (context === undefined) {
    throw new Error('useCompactMode must be used within a CompactModeProvider');
  }
  return context;
}
