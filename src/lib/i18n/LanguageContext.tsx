'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations } from './translations';

// Deep-map all leaf values to string so Hindi/Marathi strings are compatible
type DeepString<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
  ? DeepString<U>[]
  : { [K in keyof T]: DeepString<T[K]> };

export type Translations = DeepString<typeof translations.en>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en as unknown as Translations,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('mf-lang') as Language | null;
    if (saved && ['en', 'hi', 'mr'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mf-lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] as unknown as Translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
