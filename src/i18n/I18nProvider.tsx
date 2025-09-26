"use client";

import React, { createContext, useContext } from "react";
import type { Dictionary, Locale } from "./dictionaries";

type I18nContextType = {
  locale: Locale;
  dict: Dictionary;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ locale, dict, children }: React.PropsWithChildren<{ locale: Locale; dict: Dictionary }>) {
  return <I18nContext.Provider value={{ locale, dict }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
