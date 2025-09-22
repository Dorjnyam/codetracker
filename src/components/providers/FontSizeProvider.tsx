'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useSettingsStore } from '@/store/settings';

interface FontSizeContextType {
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (fontSize: 'small' | 'medium' | 'large') => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const { appearance, updateAppearance } = useSettingsStore();
  const { fontSize } = appearance;

  const setFontSize = (newFontSize: 'small' | 'medium' | 'large') => {
    updateAppearance({ fontSize: newFontSize });
  };

  // Apply font size to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing font size classes
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    
    // Add new font size class
    root.classList.add(`font-size-${fontSize}`);
    
    // Set CSS custom property for dynamic sizing
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    
    root.style.setProperty('--base-font-size', fontSizeMap[fontSize]);
  }, [fontSize]);

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
}
