"use client";

import React, { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/I18nProvider";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export default function AmbientSound({ playing }: { playing: boolean }) {
  const { dict } = useI18n();
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolume] = useState(0.15);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const noiseRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    if (!enabled || !playing) {
      gainRef.current?.gain.setTargetAtTime(0, audioCtxRef.current?.currentTime ?? 0, 0.2);
      return;
    }
    const AudioCtor = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioCtor) return;
    if (!audioCtxRef.current) audioCtxRef.current = new AudioCtor();
    const ctx = audioCtxRef.current;
    if (!gainRef.current) gainRef.current = ctx.createGain();
    gainRef.current.gain.value = 0;
    gainRef.current.connect(ctx.destination);

    // Brown noise
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // gain adjust
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gainRef.current);
    source.start(0);
    noiseRef.current = source;

  gainRef.current.gain.setTargetAtTime(volume, ctx.currentTime, 0.2);

    return () => {
      try { source.stop(); } catch {}
      source.disconnect();
      if (noiseRef.current === source) noiseRef.current = null;
    };
  }, [enabled, playing, volume]);

  useEffect(() => {
    if (!gainRef.current || !audioCtxRef.current) return;
    gainRef.current.gain.setTargetAtTime(enabled && playing ? volume : 0, audioCtxRef.current.currentTime, 0.2);
  }, [volume, enabled, playing]);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-2">
      <h2 className="text-lg font-semibold">{dict.ambient.title}</h2>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        <span>{dict.ambient.enable}</span>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <span>{dict.ambient.volume}</span>
        <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
      </label>
    </div>
  );
}
