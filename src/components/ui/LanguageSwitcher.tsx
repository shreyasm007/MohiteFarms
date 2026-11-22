'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LANGUAGES } from '@/lib/i18n/translations';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === language)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-cream/80 hover:text-gold-light transition-colors text-sm px-2 py-1 rounded-lg hover:bg-white/5"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline font-medium">{current.nativeLabel}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-xl border border-sand py-1 animate-slide-down z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setOpen(false); }}
              className={`w-full text-left px-3 py-2.5 text-sm flex items-center justify-between transition-colors ${
                language === lang.code
                  ? 'bg-cream text-forest font-semibold'
                  : 'text-foreground hover:bg-cream/60'
              }`}
            >
              <span>{lang.nativeLabel}</span>
              <span className="text-xs text-earth-light">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
