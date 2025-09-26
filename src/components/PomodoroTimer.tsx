"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../i18n/I18nProvider";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

type Phase = "work" | "short" | "long";

type Settings = {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  cyclesBeforeLongBreak: number;
  autoStartNext: boolean;
  soundOn: boolean;
  soundType?: "beep" | "ding" | "chime" | "pop";
  soundVolume?: number; // 0..1
};

type TimerState = {
  phase: Phase;
  secondsLeft: number;
  cyclesCompleted: number;
  isRunning: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  cyclesBeforeLongBreak: 4,
  autoStartNext: true,
  soundOn: true,
  soundType: "beep",
  soundVolume: 0.2,
};

const LS_SETTINGS_KEY = "pomodoro:settings";
const LS_STATE_KEY = "pomodoro:state";

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const hydratedRef = useRef(false);

  // Load from localStorage after mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch {
      // ignore
    } finally {
      hydratedRef.current = true;
    }
  }, [key]);

  // Persist to localStorage after initial hydration
  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value]);

  return [value, setValue] as const;
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function PhasePills({ phase }: { phase: Phase }) {
  const { dict } = useI18n();
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={`px-2 py-1 rounded-full border ${phase === "work" ? "bg-red-500/10 border-red-500 text-red-600" : "border-black/10 dark:border-white/20"}`}>{dict.phases.work}</span>
      <span className={`px-2 py-1 rounded-full border ${phase === "short" ? "bg-emerald-500/10 border-emerald-500 text-emerald-600" : "border-black/10 dark:border-white/20"}`}>{dict.phases.short}</span>
      <span className={`px-2 py-1 rounded-full border ${phase === "long" ? "bg-blue-500/10 border-blue-500 text-blue-600" : "border-black/10 dark:border-white/20"}`}>{dict.phases.long}</span>
    </div>
  );
}

function TimerDisplay({ secondsLeft, phase, progress }: { secondsLeft: number; phase: Phase; progress: number }) {
  const { dict } = useI18n();
  return (
    <div className="relative w-64 h-64">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(var(--foreground) ${Math.max(0, Math.min(1, progress)) * 360}deg, rgba(127,127,127,0.15) 0deg)`,
        }}
        aria-hidden
      />
      <div className="absolute inset-3 rounded-full bg-background border border-black/10 dark:border-white/10 grid place-items-center">
        <div className="text-5xl tabular-nums font-medium select-none">{formatTime(secondsLeft)}</div>
        <div className="text-xs opacity-70 mt-2">
          {phase === "work" ? dict.phases.work : phase === "short" ? dict.phases.short : dict.phases.long}
        </div>
      </div>
    </div>
  );
}

function TimerControls({ isRunning, onStart, onPause, onReset, onSkip }: { isRunning: boolean; onStart: () => void; onPause: () => void; onReset: () => void; onSkip: () => void }) {
  const { dict } = useI18n();
  return (
    <div className="flex gap-3 items-center">
      {isRunning ? (
        <button className="h-10 px-4 rounded-md bg-foreground text-background text-sm font-medium" onClick={onPause}>
          {dict.actions.pause}
        </button>
      ) : (
        <button className="h-10 px-4 rounded-md bg-foreground text-background text-sm font-medium" onClick={onStart}>
          {dict.actions.start}
        </button>
      )}
      <button className="h-10 px-4 rounded-md border border-black/10 dark:border-white/20 text-sm" onClick={onReset}>
        {dict.actions.reset}
      </button>
      <button className="h-10 px-4 rounded-md border border-black/10 dark:border-white/20 text-sm" onClick={onSkip}>
        {dict.actions.skip}
      </button>
    </div>
  );
}

function SettingsPanel({ settings, setSettings, test }: { settings: Settings; setSettings: (s: Settings) => void; test: () => void }) {
  const { dict } = useI18n();
  return (
    <details className="w-full mt-2">
      <summary className="cursor-pointer text-sm font-medium">{dict.settings.title}</summary>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <label className="flex items-center justify-between gap-2">
          <span>{dict.settings.workMinutes}</span>
          <input
            className="w-20 h-9 px-2 rounded-md border border-black/10 dark:border-white/20 bg-transparent"
            type="number"
            min={1}
            max={180}
            value={settings.workMinutes}
            onChange={(e) => setSettings({ ...settings, workMinutes: Number(e.target.value || 0) })}
          />
        </label>
        <label className="flex items-center justify-between gap-2">
          <span>{dict.settings.shortBreakMinutes}</span>
          <input
            className="w-20 h-9 px-2 rounded-md border border-black/10 dark:border-white/20 bg-transparent"
            type="number"
            min={1}
            max={60}
            value={settings.shortBreakMinutes}
            onChange={(e) => setSettings({ ...settings, shortBreakMinutes: Number(e.target.value || 0) })}
          />
        </label>
        <label className="flex items-center justify-between gap-2">
          <span>{dict.settings.longBreakMinutes}</span>
          <input
            className="w-20 h-9 px-2 rounded-md border border-black/10 dark:border-white/20 bg-transparent"
            type="number"
            min={1}
            max={180}
            value={settings.longBreakMinutes}
            onChange={(e) => setSettings({ ...settings, longBreakMinutes: Number(e.target.value || 0) })}
          />
        </label>
        <label className="flex items-center justify-between gap-2">
          <span>{dict.settings.cyclesBeforeLong}</span>
          <input
            className="w-20 h-9 px-2 rounded-md border border-black/10 dark:border-white/20 bg-transparent"
            type="number"
            min={1}
            max={10}
            value={settings.cyclesBeforeLongBreak}
            onChange={(e) => setSettings({ ...settings, cyclesBeforeLongBreak: Number(e.target.value || 0) })}
          />
        </label>
        <label className="flex items-center justify-between gap-2 col-span-2">
          <span>{dict.settings.autoStartNext}</span>
          <input
            className="h-5 w-10"
            type="checkbox"
            checked={settings.autoStartNext}
            onChange={(e) => setSettings({ ...settings, autoStartNext: e.target.checked })}
          />
        </label>
        <label className="flex items-center justify-between gap-2 col-span-2">
          <span>{dict.settings.soundOn}</span>
          <input
            className="h-5 w-10"
            type="checkbox"
            checked={settings.soundOn}
            onChange={(e) => setSettings({ ...settings, soundOn: e.target.checked })}
          />
        </label>
        <label className="flex items-center justify-between gap-2">
          <span>{dict.settings.soundType}</span>
          <select
            className="h-9 px-2 rounded-md border border-black/10 dark:border-white/20 bg-transparent"
            value={settings.soundType ?? "beep"}
            onChange={(e) => setSettings({ ...settings, soundType: e.target.value as Settings["soundType"] })}
          >
            <option value="beep">Beep</option>
            <option value="ding">Ding</option>
            <option value="chime">Chime</option>
            <option value="pop">Pop</option>
          </select>
        </label>
        <label className="flex items-center justify-between gap-2">
          <span>{dict.settings.soundVolume}</span>
          <input
            className="w-32"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={settings.soundVolume ?? 0.2}
            onChange={(e) => setSettings({ ...settings, soundVolume: Number(e.target.value) })}
          />
        </label>
        <div className="col-span-2">
          <button className="h-9 px-3 rounded-md border border-black/10 dark:border-white/20" onClick={test}>{dict.settings.testSound}</button>
        </div>
      </div>
    </details>
  );
}

export default function PomodoroTimer({ onWorkSessionComplete, onPhaseChange }: { onWorkSessionComplete?: (meta: { paused: boolean; plannedMinutes: number }) => void; onPhaseChange?: (phase: Phase) => void }) {
  const { dict } = useI18n();
  const [settings, setSettings] = useLocalStorage<Settings>(LS_SETTINGS_KEY, DEFAULT_SETTINGS);

  const initialState = useMemo(
    () => ({
      phase: "work" as Phase,
      secondsLeft: DEFAULT_SETTINGS.workMinutes * 60,
      cyclesCompleted: 0, // number of finished work sessions in current set
      isRunning: false,
    }),
    []
  );

  const [state, setState] = useLocalStorage<TimerState>(LS_STATE_KEY, initialState);
  const intervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const pausedThisSessionRef = useRef(false);

  // Ensure secondsLeft aligns with settings when phase or settings change and timer not running
  useEffect(() => {
    if (state.isRunning) return;
    const seconds = (
      state.phase === "work"
        ? settings.workMinutes
        : state.phase === "short"
          ? settings.shortBreakMinutes
          : settings.longBreakMinutes
    ) * 60;
    if (seconds !== state.secondsLeft) {
      setState({ ...state, secondsLeft: seconds });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, state.phase]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const playAlert = useCallback(() => {
    if (!settings.soundOn) return;
    try {
      const AudioCtor = (window as any).AudioContext ?? (window as any).webkitAudioContext;
      if (!AudioCtor) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtor();
      const ctx = audioCtxRef.current as AudioContext;
      const gain = ctx.createGain();
      gain.gain.value = Math.max(0, Math.min(1, settings.soundVolume ?? 0.2)) * 0.2;
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      const makeTone = (freq: number, type: OscillatorType = "sine", dur = 0.2) => {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.value = freq;
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + dur);
      };

      const type = settings.soundType ?? "beep";
      if (type === "beep") {
        makeTone(880, "sine", 0.18);
      } else if (type === "ding") {
        makeTone(587.33, "triangle", 0.12); // D5
        makeTone(880, "triangle", 0.12);
      } else if (type === "chime") {
        makeTone(523.25, "sine", 0.22); // C5
        setTimeout(() => makeTone(659.25, "sine", 0.22), 60); // E5
        setTimeout(() => makeTone(783.99, "sine", 0.22), 120); // G5
      } else if (type === "pop") {
        // simple pop: short saw wave with quick fade
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 0.14);
      }

      // Fade out gain
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.5);
    } catch {}
  }, [settings.soundOn, settings.soundType, settings.soundVolume]);

  const notify = useCallback(
    (title: string, body?: string) => {
      if (typeof window === "undefined" || !("Notification" in window)) return;
      if (Notification.permission === "granted") {
        try {
          new Notification(title, { body });
        } catch {
          // ignore
        }
      }
    },
    []
  );

  const nextPhase = useCallback(() => {
    setState((prev: TimerState): TimerState => {
      if (prev.phase === "work") {
        const newCycles = prev.cyclesCompleted + 1;
        const isLong = newCycles % settings.cyclesBeforeLongBreak === 0;
        const newPhase: Phase = isLong ? "long" : "short";
        const seconds = (isLong ? settings.longBreakMinutes : settings.shortBreakMinutes) * 60;
        const updated: TimerState = {
          ...prev,
          phase: newPhase,
          secondsLeft: seconds,
          cyclesCompleted: newCycles,
          isRunning: settings.autoStartNext ? true : false,
        };
        return updated;
      } else {
        const seconds = settings.workMinutes * 60;
        const updated: TimerState = {
          ...prev,
          phase: "work",
          secondsLeft: seconds,
          isRunning: settings.autoStartNext ? true : false,
        };
        // starting a new work session: reset pause tracker
        pausedThisSessionRef.current = false;
        return updated;
      }
    });
  }, [setState, settings.autoStartNext, settings.cyclesBeforeLongBreak, settings.longBreakMinutes, settings.shortBreakMinutes, settings.workMinutes, onPhaseChange]);

  // Notify parent about phase changes without mutating state during render
  useEffect(() => {
    onPhaseChange?.(state.phase);
    // We only want to react to actual phase changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  // Ticking logic
  useEffect(() => {
    clearTimer();
    if (!state.isRunning) return;
    intervalRef.current = window.setInterval(() => {
      setState((prev: typeof state) => {
        const next = prev.secondsLeft - 1;
        if (next <= 0) {
          return { ...prev, secondsLeft: 0, isRunning: false };
        }
        return { ...prev, secondsLeft: next };
      });
    }, 1000);
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isRunning]);

  // Handle phase transitions when reaching zero
  useEffect(() => {
    if (state.secondsLeft === 0) {
  playAlert();
      try { if (navigator.vibrate) navigator.vibrate(200); } catch {}
      const phaseName = state.phase === "work" ? dict.phases.work : state.phase === "short" ? dict.phases.short : dict.phases.long;
      notify(dict.notifications.sessionEnded, `${phaseName}`);
      if (state.phase === "work") {
        onWorkSessionComplete?.({ paused: pausedThisSessionRef.current, plannedMinutes: settings.workMinutes });
      }
      nextPhase();
    }
  }, [state.secondsLeft, state.phase, playAlert, notify, nextPhase, dict.notifications.sessionEnded, dict.phases.long, dict.phases.short, dict.phases.work, onWorkSessionComplete, settings.workMinutes]);

  // Update document title
  useEffect(() => {
    if (typeof document === "undefined") return;
    const phaseName = state.phase === "work" ? dict.phases.work : state.phase === "short" ? dict.phases.short : dict.phases.long;
    const base = `${dict.appTitle} — ${phaseName}`;
    document.title = `${formatTime(state.secondsLeft)} • ${base}`;
  }, [state.secondsLeft, state.phase, dict.appTitle, dict.phases.long, dict.phases.short, dict.phases.work]);

  // Request notification permission button appears when needed
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const canAskNotification =
    mounted && typeof window !== "undefined" && "Notification" in window && Notification.permission === "default";

  const start = useCallback(() => setState({ ...state, isRunning: true }), [state, setState]);
  const pause = useCallback(() => {
    pausedThisSessionRef.current = true;
    setState({ ...state, isRunning: false });
  }, [state, setState]);
  const reset = useCallback(() => {
    const seconds = (
      state.phase === "work"
        ? settings.workMinutes
        : state.phase === "short"
          ? settings.shortBreakMinutes
          : settings.longBreakMinutes
    ) * 60;
    setState({ ...state, secondsLeft: seconds, isRunning: false });
  }, [setState, settings.longBreakMinutes, settings.shortBreakMinutes, settings.workMinutes, state]);
  const skip = useCallback(() => {
    pause();
    nextPhase();
  }, [nextPhase, pause]);

  const totalSeconds = useMemo(() => {
    return (
      state.phase === "work"
        ? settings.workMinutes
        : state.phase === "short"
          ? settings.shortBreakMinutes
          : settings.longBreakMinutes
    ) * 60;
  }, [settings.longBreakMinutes, settings.shortBreakMinutes, settings.workMinutes, state.phase]);
  const progress = 1 - state.secondsLeft / totalSeconds;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6">
      <h1 className="text-2xl font-semibold">{dict.appTitle}</h1>
      <PhasePills phase={state.phase} />
      <TimerDisplay secondsLeft={state.secondsLeft} phase={state.phase} progress={progress} />
      <TimerControls isRunning={state.isRunning} onStart={start} onPause={pause} onReset={reset} onSkip={skip} />

      {canAskNotification && (
        <button
          className="text-xs underline opacity-80"
          onClick={() => {
            if (!("Notification" in window)) return;
            Notification.requestPermission();
          }}
        >
          {dict.actions.enableNotifications}
        </button>
      )}

  <SettingsPanel settings={settings} setSettings={setSettings} test={playAlert} />

      <p className="text-xs opacity-60">{dict.labels.completed}: {state.cyclesCompleted}</p>
    </div>
  );
}
