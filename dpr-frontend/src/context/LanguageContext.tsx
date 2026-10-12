'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, Translations } from '@/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
  isLanguageModalOpen: false,
  setIsLanguageModalOpen: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = (sessionStorage.getItem('dpr_selected_language') || localStorage.getItem('dpr_language_preference')) as Language;
      if (stored && (stored === 'en' || stored === 'kn' || stored === 'hi')) {
        setLanguageState(stored);
      } else {
        // First-time visitor without preference: open language modal
        const hasPrompted = sessionStorage.getItem('dpr_language_prompted');
        if (!hasPrompted) {
          setIsLanguageModalOpen(true);
          sessionStorage.setItem('dpr_language_prompted', 'true');
        }
      }
      setIsInitialized(true);
    }
  }, []);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dpr_selected_language', newLang);
      localStorage.setItem('dpr_language_preference', newLang);
    }
  };

  const currentTranslations = translations[language] || translations.en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: currentTranslations,
        isLanguageModalOpen,
        setIsLanguageModalOpen,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
