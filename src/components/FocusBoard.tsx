"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import PomodoroTimer from "./PomodoroTimer";
import TaskList, { type Task } from "./TaskList";
import { useLocalStorage } from "../hooks/useLocalStorage";
import InboxPanel, { type InboxItem } from "./InboxPanel";
import AchievementsPanel, { type Achievements } from "./AchievementsPanel";
import ReviewPanel, { type DailyStat } from "./ReviewPanel";
import AmbientSound from "./AmbientSound";
import FlightProgress from "./FlightProgress";
import BackgroundPicker from "./BackgroundPicker";
import GameModePanel from "./GameModePanel";
import { useGameMode } from "../state/gameMode";
import CharacterPanel from "./CharacterPanel";
import { useCharacter } from "../state/character";

type BoardState = {
  tasks: Task[];
  activeId: string | null;
};

const LS_BOARD_KEY = "pomodoro:tasks";
const LS_INBOX_KEY = "pomodoro:inbox";
const LS_STATS_KEY = "pomodoro:stats";

type StatsState = {
  minutesToday: number;
  lastTick: number | null; // ms timestamp for running session start
  noPauseStreak: number; // current streak of work sessions without pause
  tasksBefore11: number; // today count
  distanceKm: number; // cumulative based on minutes (e.g., 1 min = 0.2km)
  daily: Record<string, number>; // yyyy-mm-dd -> minutes
};

export default function FocusBoard() {
  const [board, setBoard] = useLocalStorage<BoardState>(LS_BOARD_KEY, {
    tasks: [],
    activeId: null,
  });
  const [inbox, setInbox] = useLocalStorage<InboxItem[]>(LS_INBOX_KEY, []);
  const [stats, setStats] = useLocalStorage<StatsState>(LS_STATS_KEY, {
    minutesToday: 0,
    lastTick: null,
    noPauseStreak: 0,
    tasksBefore11: 0,
    distanceKm: 0,
    daily: {},
  });

  const [currentPhase, setCurrentPhase] = useState<"work" | "short" | "long">("work");
  const { award } = useGameMode();
  const { addXP } = useCharacter();

  const addTask = useCallback((title: string) => {
    const t: Task = { id: crypto.randomUUID(), title, completed: false };
    setBoard({ ...board, tasks: [t, ...board.tasks], activeId: board.activeId ?? t.id });
  }, [board, setBoard]);

  const toggleComplete = useCallback((id: string) => {
    setBoard({
      ...board,
      tasks: board.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    });
  }, [board, setBoard]);

  const deleteTask = useCallback((id: string) => {
    const tasks = board.tasks.filter((t) => t.id !== id);
    const activeId = board.activeId === id ? (tasks[0]?.id ?? null) : board.activeId;
    setBoard({ tasks, activeId });
  }, [board, setBoard]);

  const selectTask = useCallback((id: string) => {
    setBoard({ ...board, activeId: id });
  }, [board, setBoard]);

  const onWorkSessionComplete = useCallback(() => {
    // Auto-mark active task completed when finishing a work session
    if (!board.activeId) return;
    setBoard({
      ...board,
      tasks: board.tasks.map((t) => (t.id === board.activeId ? { ...t, completed: true } : t)),
    });
  }, [board, setBoard]);

  // Handle stats on work session complete (receives meta from timer)
  const onWorkDoneWithMeta = useCallback((meta: { paused: boolean; plannedMinutes: number }) => {
    const minutes = meta.plannedMinutes;
    const dateKey = new Date().toISOString().slice(0, 10);
    const isBefore11 = new Date().getHours() < 11;
    setStats({
      ...stats,
      minutesToday: stats.minutesToday + minutes,
      noPauseStreak: meta.paused ? 0 : stats.noPauseStreak + 1,
      tasksBefore11: isBefore11 ? stats.tasksBefore11 + 1 : stats.tasksBefore11,
      distanceKm: stats.distanceKm + minutes * 0.2,
      daily: { ...stats.daily, [dateKey]: (stats.daily[dateKey] ?? 0) + minutes },
    });
    // Award game points if enabled
    award({ minutes, paused: meta.paused });
    // Add XP to character (e.g., 5 XP per planned minute, more if not paused)
    const xpGain = minutes * (meta.paused ? 3 : 5);
    addXP(xpGain);
  }, [stats, setStats, award, addXP]);

  // Hotkey I to quick add to inbox
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "i") {
        const text = prompt("Quick inbox:")?.trim();
        if (text) setInbox([{ id: crypto.randomUUID(), text, createdAt: Date.now() }, ...inbox]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inbox, setInbox]);

  const addInbox = useCallback((text: string) => setInbox([{ id: crypto.randomUUID(), text, createdAt: Date.now() }, ...inbox]), [inbox, setInbox]);
  const removeInbox = useCallback((id: string) => setInbox(inbox.filter((x) => x.id !== id)), [inbox, setInbox]);

  const achievements: Achievements = useMemo(() => ({
    noPause3: stats.noPauseStreak >= 3,
    threeBefore11: stats.tasksBefore11 >= 3,
    minutesFocused: stats.minutesToday,
  }), [stats.noPauseStreak, stats.tasksBefore11, stats.minutesToday]);

  const reviewData: DailyStat[] = useMemo(() => {
    const today = new Date();
    const arr: DailyStat[] = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      arr.push({ date: key, minutes: stats.daily[key] ?? 0 });
    }
    return arr;
  }, [stats.daily]);

  return (
    <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <PomodoroTimer onWorkSessionComplete={onWorkDoneWithMeta} onPhaseChange={(p) => setCurrentPhase(p)} />
        <AmbientSound playing={currentPhase === "work"} />
        <AchievementsPanel data={achievements} km={stats.distanceKm} />
        <ReviewPanel data={reviewData} />
        <FlightProgress km={stats.distanceKm} />
      </div>
      <div className="flex flex-col gap-8">
        <BackgroundPicker />
        <GameModePanel />
        <CharacterPanel />
        <TaskList
          tasks={board.tasks}
          activeId={board.activeId}
          onAdd={addTask}
          onToggleComplete={toggleComplete}
          onDelete={deleteTask}
          onSelect={selectTask}
        />
        {currentPhase !== "work" && <InboxPanel items={inbox} onAdd={addInbox} onRemove={removeInbox} />}
      </div>
    </div>
  );
}
