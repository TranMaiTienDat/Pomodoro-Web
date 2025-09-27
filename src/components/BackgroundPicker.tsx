"use client";

import React, { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useI18n } from "../i18n/I18nProvider";

type BgSettings = {
  color: string; // hex color
  autoContrast?: boolean; // auto adjust text color for readability
  textColor?: string; // manual override when autoContrast is off
};

const LS_BG_KEY = "pomodoro:bg";

export default function BackgroundPicker() {
  const { dict } = useI18n();
  const [bg, setBg] = useLocalStorage<BgSettings>(LS_BG_KEY, {
    color: "#ffffff",
    autoContrast: true,
    textColor: "#171717",
  });

  // Utility: compute luminance and choose contrasting text color
  function pickTextColor(hex: string) {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.length === 3 ? clean[0] + clean[0] : clean.slice(0, 2), 16);
    const g = parseInt(clean.length === 3 ? clean[1] + clean[1] : clean.slice(2, 4), 16);
    const b = parseInt(clean.length === 3 ? clean[2] + clean[2] : clean.slice(4, 6), 16);
    const srgb = [r, g, b].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    const L = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
    return L > 0.5 ? "#171717" : "#ededed";
  }

  // Apply background and text color
  useEffect(() => {
    if (typeof document === "undefined") return;
    const body = document.body;

    const clearToDefault = () => {
      body.style.background = "var(--background)";
      body.style.setProperty("--foreground", "");
      body.style.setProperty("--background", "");
    };

    if (bg.color) {
      body.style.background = bg.color;
      body.style.setProperty("--background", bg.color);
      if (bg.autoContrast) {
        const text = pickTextColor(bg.color);
        body.style.setProperty("--foreground", text);
      } else {
        body.style.setProperty("--foreground", bg.textColor || "");
      }
    } else {
      clearToDefault();
    }
  }, [bg.color, bg.autoContrast, bg.textColor]);

  return (
    <div className="w-full rounded-lg border border-black/10 dark:border-white/20 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{dict.background.title}</h3>
        <div className="text-sm opacity-70">{dict.background.colorOption}</div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <label className="text-sm opacity-80 w-28">{dict.background.color}</label>
        <input
          type="color"
          className="h-9 w-12 p-0 border border-black/10 dark:border-white/20 rounded-md"
          value={bg.color}
          onChange={(e) => setBg({ ...bg, color: e.target.value })}
          aria-label={dict.background.color}
        />
        <input
          type="text"
          className="flex-1 h-9 px-2 rounded-md border border-black/10 dark:border-white/20 bg-transparent text-sm"
          value={bg.color}
          onChange={(e) => setBg({ ...bg, color: e.target.value })}
          placeholder="#ffffff"
        />
        <label className="ml-2 inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={bg.autoContrast ?? true}
            onChange={(e) => setBg({ ...bg, autoContrast: e.target.checked })}
          />
          {dict.background.autoContrast}
        </label>
        {!bg.autoContrast && (
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm opacity-80">{dict.background.textColor}</span>
            <input
              type="color"
              className="h-9 w-12 p-0 border border-black/10 dark:border-white/20 rounded-md"
              value={bg.textColor ?? "#171717"}
              onChange={(e) => setBg({ ...bg, textColor: e.target.value })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
