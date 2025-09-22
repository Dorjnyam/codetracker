'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useSettingsStore } from '@/store/settings';
import { SupportedLanguage, getTranslation } from '@/lib/i18n';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { appearance, updateAppearance } = useSettingsStore();
  const { language } = appearance;

  const setLanguage = (newLanguage: SupportedLanguage) => {
    updateAppearance({ language: newLanguage });
  };

  const t = (key: string) => getTranslation(key, language);

  // Apply language to document
  useEffect(() => {
    document.documentElement.lang = language;
    
    // Update document direction for RTL languages if needed
    if (language === 'ar' || language === 'he') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
