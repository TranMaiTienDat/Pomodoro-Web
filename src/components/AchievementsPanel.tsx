"use client";

import React from "react";
import { useI18n } from "../i18n/I18nProvider";

export type Achievements = {
  noPause3: boolean;
  threeBefore11: boolean;
  minutesFocused: number;
};

export default function AchievementsPanel({ data, km }: { data: Achievements; km: number }) {
  const { dict } = useI18n();
  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-3">
      <h2 className="text-lg font-semibold">{dict.achievements.title}</h2>
      <ul className="flex flex-col gap-2 text-sm">
        <li className={`p-2 rounded-md border ${data.noPause3 ? "border-emerald-500" : "border-black/10 dark:border-white/20"}`}>
          {dict.achievements.noPause3}
        </li>
        <li className={`p-2 rounded-md border ${data.threeBefore11 ? "border-emerald-500" : "border-black/10 dark:border-white/20"}`}>
          {dict.achievements.threeBefore11}
        </li>
        <li className="p-2 rounded-md border border-black/10 dark:border-white/20">
          {km.toFixed(1)} {dict.achievements.distanceLabel}
        </li>
      </ul>
    </div>
  );
}
