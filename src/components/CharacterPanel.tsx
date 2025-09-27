"use client";

import React, { useMemo } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { useCharacter } from "../state/character";
import { useGameMode } from "../state/gameMode";

function Avatar({ level, hat, cape }: { level: number; hat: boolean; cape: boolean }) {
  const size = 124;
  const tier = level < 3 ? 0 : level < 6 ? 1 : 2;
  const bodyGradientId = useMemo(() => `g-body-${tier}`, [tier]);
  const auraGradientId = useMemo(() => `g-aura-${tier}`, [tier]);

  const palette = [
    { from: "#60a5fa", to: "#93c5fd", aura: "#60a5fa" }, // blue
    { from: "#22c55e", to: "#86efac", aura: "#22c55e" }, // green
    { from: "#f59e0b", to: "#fde68a", aura: "#f59e0b" }, // amber
  ][tier];

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className="rounded-xl border border-black/10 dark:border-white/20 bg-black/5">
      <defs>
        <radialGradient id={auraGradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.aura} stopOpacity="0.45" />
          <stop offset="100%" stopColor={palette.aura} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={bodyGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.from} />
          <stop offset="100%" stopColor={palette.to} />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>{`
          @keyframes breathe { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }
          @keyframes floaty { 0% { transform: translateY(0); } 50% { transform: translateY(-2px); } 100% { transform: translateY(0); } }
          .aura { animation: breathe 3s ease-in-out infinite; }
          .floaty { animation: floaty 4s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* aura */}
      <circle className="aura" cx="60" cy="60" r="40" fill={`url(#${auraGradientId})`} filter="url(#glow)" />

      {/* cape */}
      {cape && <path className="floaty" d="M24,72 C10,108 110,108 96,72 L60,56 Z" fill="#ef4444" opacity="0.7" />}

      {/* body */}
      <circle cx="60" cy="60" r="26" fill={`url(#${bodyGradientId})`} stroke="#111" strokeOpacity="0.06" />
      {/* eyes */}
      <circle cx="52" cy="56" r="3" fill="#111" />
      <circle cx="68" cy="56" r="3" fill="#111" />
      {/* smile */}
      <path d="M50,66 Q60,72 70,66" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* hat */}
      {hat && (
        <g className="floaty">
          <rect x="44" y="34" width="32" height="8" rx="3" fill="#111" />
          <rect x="54" y="24" width="12" height="12" rx="2" fill="#111" />
        </g>
      )}
    </svg>
  );
}

export default function CharacterPanel() {
  const { dict } = useI18n();
  const { ch, addXP, buyCosmetic, xpForNext } = useCharacter();
  const { game, setEnabled, spend } = useGameMode();

  const upgradeCost = 30; // cost in game score to convert to XP
  const cosmeticCost = 50;

  const canUpgrade = game.score >= upgradeCost;
  const canBuy = (owned: boolean) => !owned && game.score >= cosmeticCost;

  const trySpend = (amount: number, onOk: () => void) => {
    if (!game.enabled) { setEnabled(true); return; }
    const ok = spend(amount);
    if (ok) onOk();
    // else optionally toast "not enough"
  };

  return (
    <div className="w-full rounded-lg border border-black/10 dark:border-white/20 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{dict.character.title}</h3>
        <div className="text-xs opacity-70">
          {dict.character.level}: <span className="font-semibold">{ch.level}</span>
          <span className="mx-2">•</span>
          {dict.character.power}: <span className="font-semibold">{ch.power}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4">
        <Avatar level={ch.level} hat={ch.cosmetics.hat} cape={ch.cosmetics.cape} />
        <div className="text-sm">
          <div className="mb-2">
            {dict.character.xp}: <span className="font-semibold">{ch.xp}</span> / {xpForNext(ch.level)}
          </div>
          <div className="flex gap-2">
            <button
              className="h-8 px-3 rounded-md border border-black/10 dark:border-white/20 disabled:opacity-50"
              disabled={!canUpgrade}
              onClick={() => {
                if (!canUpgrade) return;
                trySpend(upgradeCost, () => addXP(20));
              }}
            >
              {dict.character.upgrade}
            </button>
            <button
              className="h-8 px-3 rounded-md border border-black/10 dark:border-white/20 disabled:opacity-50"
              disabled={!canBuy(ch.cosmetics.hat)}
              onClick={() => {
                if (!canBuy(ch.cosmetics.hat)) return;
                trySpend(cosmeticCost, () => buyCosmetic("hat"));
              }}
            >
              {dict.character.hat} ({dict.character.buy})
            </button>
            <button
              className="h-8 px-3 rounded-md border border-black/10 dark:border-white/20 disabled:opacity-50"
              disabled={!canBuy(ch.cosmetics.cape)}
              onClick={() => {
                if (!canBuy(ch.cosmetics.cape)) return;
                trySpend(cosmeticCost, () => buyCosmetic("cape"));
              }}
            >
              {dict.character.cape} ({dict.character.buy})
            </button>
          </div>
          {!game.enabled && (
            <div className="text-xs opacity-70 mt-2">{dict.game.enable}</div>
          )}
        </div>
      </div>
    </div>
  );
}
