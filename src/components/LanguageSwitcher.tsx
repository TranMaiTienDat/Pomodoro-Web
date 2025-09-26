"use client";

import Link from "next/link";
import { useI18n } from "../i18n/I18nProvider";

export default function LanguageSwitcher() {
  const { locale } = useI18n();
  return (
    <div className="flex gap-2 text-xs opacity-80">
      <Link className={`underline ${locale === "vi" ? "font-semibold" : ""}`} href="/vi">VI</Link>
      <span>·</span>
      <Link className={`underline ${locale === "en" ? "font-semibold" : ""}`} href="/en">EN</Link>
    </div>
  );
}
