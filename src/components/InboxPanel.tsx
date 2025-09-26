"use client";

import React, { useState } from "react";
import { useI18n } from "../i18n/I18nProvider";

export type InboxItem = { id: string; text: string; createdAt: number };

export default function InboxPanel({ items, onAdd, onRemove }: {
  items: InboxItem[];
  onAdd: (text: string) => void;
  onRemove: (id: string) => void;
}) {
  const { dict } = useI18n();
  const [text, setText] = useState("");
  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-3">
      <h2 className="text-lg font-semibold">{dict.inbox.title}</h2>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const t = text.trim();
          if (!t) return;
          onAdd(t);
          setText("");
        }}
      >
        <input
          className="flex-1 h-10 px-3 rounded-md border border-black/10 dark:border-white/20 bg-transparent"
          placeholder={dict.inbox.placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="h-10 px-4 rounded-md bg-foreground text-background text-sm font-medium" type="submit">
          {dict.inbox.addQuick}
        </button>
      </form>
      <ul className="flex flex-col gap-2">
        {items.length === 0 && <li className="text-sm opacity-60">{dict.inbox.empty}</li>}
        {items.map((it) => (
          <li key={it.id} className="flex items-center justify-between gap-2 p-2 rounded-md border border-black/10 dark:border-white/20">
            <div className="text-sm">{it.text}</div>
            <button className="text-xs underline opacity-80" onClick={() => onRemove(it.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
