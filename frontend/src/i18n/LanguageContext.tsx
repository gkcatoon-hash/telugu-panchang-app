import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { strings, StringKey } from "./strings";

export type Language = "en" | "te" | "hi" | "ta" | "kn";

type LanguageContextValue = {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: StringKey) => string;
};

const STORAGE_KEY = "@manalife/lang";

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (
          saved === "en" ||
          saved === "te" ||
          saved === "hi" ||
          saved === "ta" ||
          saved === "kn"
        ) {
          setLangState(saved);
        }
      } catch {}
    })();
  }, []);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const t = useCallback(
    (key: StringKey) => {
      const entry = strings[key];

      if (!entry) return key;

      return entry[lang] ?? entry.en ?? key;
    },
    [lang]
  );

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
    }),
    [lang, setLang, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);

  if (!ctx) {
    throw new Error("useLang must be used inside LanguageProvider");
  }

  return ctx;
}