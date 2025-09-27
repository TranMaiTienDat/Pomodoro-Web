"use client";

import { useLocalStorage } from "../hooks/useLocalStorage";

export type Difficulty = "easy" | "normal" | "hard";

export type GameState = {
  enabled: boolean;
  difficulty: Difficulty;
  score: number;
  best: number;
  streak: number; // consecutive work sessions without pause
};

const LS_KEY = "pomodoro:game";

const DEFAULT_GAME: GameState = {
  enabled: false,
  difficulty: "normal",
  score: 0,
  best: 0,
  streak: 0,
};

export function useGameMode() {
  const [game, setGame] = useLocalStorage<GameState>(LS_KEY, DEFAULT_GAME);

  const reset = () => setGame({ ...game, score: 0, streak: 0 });
  const setEnabled = (v: boolean) => setGame({ ...game, enabled: v });
  const setDifficulty = (d: Difficulty) => setGame({ ...game, difficulty: d });

  const spend = (amount: number): boolean => {
    if (!game.enabled) return false;
    if (game.score < amount) return false;
    setGame({ ...game, score: game.score - amount });
    return true;
  };

  const award = (opts: { minutes: number; paused: boolean }) => {
    if (!game.enabled) return;
    // base points per minute by difficulty
    const basePerMin = game.difficulty === "easy" ? 1 : game.difficulty === "normal" ? 2 : 3;
    const gained = basePerMin * opts.minutes;
    const newStreak = opts.paused ? 0 : game.streak + 1;
    const multiplier = 1 + Math.min(newStreak, 5) * 0.1; // up to +50%
    const add = Math.round(gained * multiplier);
    const nextScore = game.score + add;
    setGame({ ...game, score: nextScore, best: Math.max(game.best, nextScore), streak: newStreak });
  };

  return { game, setEnabled, setDifficulty, reset, spend, award };
}
