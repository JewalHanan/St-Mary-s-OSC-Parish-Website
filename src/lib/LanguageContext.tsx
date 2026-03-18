'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ml';

type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
  isEnglish: boolean;
  t: (en: string, ml: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ml' : 'en');
  };

  const t = (en: string, ml: string) => language === 'en' ? en : ml;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, isEnglish: language === 'en', t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
