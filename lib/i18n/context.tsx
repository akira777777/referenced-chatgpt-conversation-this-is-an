"use client";

import React, { createContext, useContext, useState } from "react";
import { translations, type Language, type TranslationKeys } from "./translations";

interface LanguageContextType {
  lang: Language;
  language: Language;
  setLang: (lang: Language) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "cs",
  language: "cs",
  setLang: () => {},
  t: translations.cs,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("cs");

  React.useEffect(() => {
    let isSubscribed = true;
    try {
      const stored = localStorage.getItem("reform_lang") as Language | null;
      let targetLang: Language = "cs";
      if (stored && (stored === "cs" || stored === "ru" || stored === "en")) {
        targetLang = stored;
      } else {
        const browserLang = navigator.language.slice(0, 2).toLowerCase();
        if (browserLang === "ru" || browserLang === "uk" || browserLang === "be") {
          targetLang = "ru";
        } else if (browserLang === "en") {
          targetLang = "en";
        }
      }
      document.documentElement.lang = targetLang;
      if (targetLang !== "cs") {
        queueMicrotask(() => {
          if (isSubscribed) {
            setLangState(targetLang);
          }
        });
      }
    } catch {
      // ignore
    }
    return () => {
      isSubscribed = false;
    };
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("reform_lang", newLang);
      document.documentElement.lang = newLang;
    } catch {
      // ignore
    }
  };

  const t = translations[lang] || translations.cs;

  return (
    <LanguageContext.Provider value={{ lang, language: lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  const options: { code: Language; label: string }[] = [
    { code: "cs", label: "CZ" },
    { code: "ru", label: "RU" },
    { code: "en", label: "EN" },
  ];

  return (
    <div className={`lang-switcher ${className}`} role="group" aria-label="Language selection">
      {options.map(opt => (
        <button
          key={opt.code}
          type="button"
          className={`lang-btn ${lang === opt.code ? "active" : ""}`}
          onClick={() => setLang(opt.code)}
          aria-pressed={lang === opt.code}
          aria-label={`Switch to ${opt.label}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
