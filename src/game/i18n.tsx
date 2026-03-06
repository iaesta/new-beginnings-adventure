import React, { createContext, useContext, useMemo, useState } from "react";
import { TEXT_EN } from "./text_en";
import { TEXT_ES } from "./text_es";
import { TEXT_JA } from "./text_ja";

export type Language = "en" | "es" | "ja";
export type TextDict = typeof TEXT_EN;

const STORAGE_KEY = "fresh_start_lang";

function normalizeLang(raw: string | null | undefined): Language {
  const s = (raw ?? "").toLowerCase();
  if (s.startsWith("es")) return "es";
  if (s.startsWith("ja")) return "ja";
  return "en";
}

export function detectInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return normalizeLang(saved);
  } catch {
    // ignore
  }
  if (typeof navigator !== "undefined") return normalizeLang(navigator.language);
  return "en";
}

export function getText(lang: Language): TextDict {
  if (lang === "es") return TEXT_ES as unknown as TextDict;
  if (lang === "ja") return TEXT_JA as unknown as TextDict;
  return TEXT_EN;
}

type I18nCtx = {
  lang: Language;
  setLang: (lang: Language) => void;
  T: TextDict;
};

const Ctx = createContext<I18nCtx | null>(null);

export function LanguageProvider({
  initialLang,
  children,
}: {
  initialLang?: Language;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Language>(initialLang ?? detectInitialLanguage());

  const setLang = (next: Language) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  const T = useMemo(() => getText(lang), [lang]);
  const value = useMemo(() => ({ lang, setLang, T }), [lang, T]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useI18n must be used within <LanguageProvider>");
  }
  return ctx;
}

export function useText() {
  return useI18n().T;
}
