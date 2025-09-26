"use client";

import React from "react";
import { useI18n } from "../i18n/I18nProvider";

export type DailyStat = { date: string; minutes: number };

export default function ReviewPanel({ data }: { data: DailyStat[] }) {
  const { dict } = useI18n();
  const max = Math.max(1, ...data.map((d) => d.minutes));
  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-3">
      <h2 className="text-lg font-semibold">{dict.review.title} · {dict.review.last28Days}</h2>
      <div className="grid grid-cols-7 gap-1">
        {data.map((d) => {
          const intensity = Math.min(1, d.minutes / max);
          const bg = `rgba(16,185,129,${0.15 + intensity * 0.85})`;
          return (
            <div key={d.date} className="h-6 w-6 rounded" title={`${d.minutes} ${dict.review.minutes}`} style={{ background: bg }} />
          );
        })}
      </div>
    </div>
  );
}
