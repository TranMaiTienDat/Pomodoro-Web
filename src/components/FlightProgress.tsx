"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useI18n } from "../i18n/I18nProvider";

export default function FlightProgress({ km }: { km: number }) {
  const { dict } = useI18n();

  // Cycle every 100 km for a satisfying loop
  const cycleKm = 100;
  const progressPct = Math.max(0, Math.min(100, (km % cycleKm) / cycleKm * 100));
  const stageNumber = Math.floor(km / cycleKm) + 1; // Stage 1, 2, 3...

  const [availableImages, setAvailableImages] = useState<string[] | null>(null);
  const [videoAvailable, setVideoAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/journey", { cache: "no-store" });
        if (!res.ok) throw new Error("journey api");
        const data = (await res.json()) as { images: string[]; video: boolean };
        if (!cancelled) {
          setAvailableImages(data.images);
          setVideoAvailable(data.video);
        }
      } catch {
        if (!cancelled) {
          setAvailableImages([]);
          setVideoAvailable(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="w-full p-4 rounded-xl border border-black/10 dark:border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{dict.journey.title}</h2>
        <div className="text-sm opacity-80">
          {dict.journey.traveled}: <span className="font-medium">{km.toFixed(1)} {dict.achievements.distanceLabel}</span>
          <span className="mx-2">•</span>
          {dict.journey.stage}: <span className="font-medium">{stageNumber}</span>
        </div>
      </div>

      {/* Progress track */}
      <div className="relative h-10 mb-4">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-200/40 to-emerald-200/40 dark:from-blue-500/20 dark:to-emerald-500/20" />
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-black/10 dark:bg-white/20 rounded-full" />
        <div
          className="absolute -top-1 text-xl select-none"
          style={{ left: `calc(${progressPct}% - 10px)` }}
          aria-label="plane"
        >
          ✈️
        </div>
      </div>

      {/* Media area: optional video then images */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Video (optional) */}
        {videoAvailable ? (
          <div className="rounded-lg overflow-hidden border border-black/10 dark:border-white/10">
            <div className="px-3 py-2 text-sm opacity-70 border-b border-black/10 dark:border-white/10">{dict.journey.videoTitle}</div>
            <video
              className="w-full h-56 object-cover bg-black/5"
              src="/flight.mp4"
              autoPlay
              muted
              loop
              playsInline
              controls
            />
          </div>
        ) : null}

        {/* Images: only show when available */}
        {availableImages && availableImages.length > 0 ? (
          <div className="rounded-lg overflow-hidden border border-black/10 dark:border-white/10">
            <div className="grid grid-cols-3 gap-2 p-2">
              {availableImages.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt="journey"
                  className="w-full h-24 object-cover rounded-md bg-black/5"
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
