"use client";

import React, { useMemo, useState } from "react";
import { useI18n } from "../i18n/I18nProvider";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function TaskList({ tasks, activeId, onAdd, onToggleComplete, onDelete, onSelect }: {
  tasks: Task[];
  activeId: string | null;
  onAdd: (title: string) => void;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  const { dict } = useI18n();
  const [input, setInput] = useState("");
  const sorted = useMemo(() => {
    // Active first, then incomplete, then completed
    return [...tasks].sort((a, b) => {
      if (a.id === activeId) return -1;
      if (b.id === activeId) return 1;
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return a.title.localeCompare(b.title);
    });
  }, [tasks, activeId]);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-3">
      <h2 className="text-lg font-semibold">{dict.tasks.title}</h2>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const title = input.trim();
          if (!title) return;
          onAdd(title);
          setInput("");
        }}
      >
        <input
          className="flex-1 h-10 px-3 rounded-md border border-black/10 dark:border-white/20 bg-transparent"
          placeholder={dict.tasks.addPlaceholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="h-10 px-4 rounded-md bg-foreground text-background text-sm font-medium" type="submit">
          {dict.tasks.addButton}
        </button>
      </form>
      <ul className="flex flex-col gap-2">
        {sorted.length === 0 && (
          <li className="text-sm opacity-60">{dict.tasks.empty}</li>
        )}
        {sorted.map((t) => (
          <li key={t.id} className={`flex items-center justify-between gap-2 p-2 rounded-md border ${t.id === activeId ? "border-foreground" : "border-black/10 dark:border-white/20"}`}>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={t.completed} onChange={() => onToggleComplete(t.id)} />
              <button className={`text-left ${t.completed ? "line-through opacity-60" : ""}`} onClick={() => onSelect(t.id)}>
                {t.title}
              </button>
              {t.id === activeId && <span className="text-xs px-2 py-0.5 rounded-full bg-foreground text-background">{dict.tasks.active}</span>}
            </div>
            <button className="text-xs underline opacity-80" onClick={() => onDelete(t.id)}>
              {dict.tasks.delete}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
