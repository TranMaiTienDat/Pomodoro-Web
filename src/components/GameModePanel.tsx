"use client";

import React from "react";
import { useI18n } from "../i18n/I18nProvider";
import { useGameMode, type Difficulty } from "../state/gameMode";

export default function GameModePanel() {
  const { dict } = useI18n();
  const { game, setEnabled, setDifficulty, reset } = useGameMode();

  return (
    <div className="w-full rounded-lg border border-black/10 dark:border-white/20 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{dict.game.title}</h3>
        <label className="text-sm inline-flex items-center gap-2">
          <input type="checkbox" checked={game.enabled} onChange={(e) => setEnabled(e.target.checked)} />
          {dict.game.enable}
        </label>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="opacity-80">{dict.game.difficulty}</span>
          <select
            className="h-8 px-2 rounded-md border border-black/10 dark:border-white/20 bg-transparent"
            value={game.difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          >
            <option value="easy">{dict.game.easy}</option>
            <option value="normal">{dict.game.normal}</option>
            <option value="hard">{dict.game.hard}</option>
          </select>
        </div>

        <div className="flex items-center gap-4 justify-end">
          <div>
            <span className="opacity-70 mr-1">{dict.game.score}:</span>
            <span className="font-semibold">{game.score}</span>
          </div>
          <div>
            <span className="opacity-70 mr-1">{dict.game.best}:</span>
            <span className="font-semibold">{game.best}</span>
          </div>
          <div>
            <span className="opacity-70 mr-1">{dict.game.streak}:</span>
            <span className="font-semibold">{game.streak}</span>
          </div>
        </div>
      </div>

      <p className="mt-2 text-xs opacity-70">{dict.game.rules}</p>
      <div className="mt-2">
        <button className="h-8 px-3 rounded-md border border-black/10 dark:border-white/20 text-xs" onClick={reset}>
          {dict.game.resetScore}
        </button>
      </div>
    </div>
  );
}
