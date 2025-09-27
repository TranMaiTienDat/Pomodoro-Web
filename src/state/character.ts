"use client";

import { useLocalStorage } from "../hooks/useLocalStorage";

export type Cosmetics = {
  hat: boolean;
  cape: boolean;
};

export type CharacterState = {
  level: number;
  xp: number; // total xp
  power: number; // derived or manual, here keep as number to show growth
  cosmetics: Cosmetics;
};

const LS_KEY = "pomodoro:character";

const DEFAULT_CHAR: CharacterState = {
  level: 1,
  xp: 0,
  power: 10,
  cosmetics: { hat: false, cape: false },
};

function xpForNext(level: number) {
  // simple curve: 50 * level
  return 50 * level;
}

export function useCharacter() {
  const [ch, setCh] = useLocalStorage<CharacterState>(LS_KEY, DEFAULT_CHAR);

  const addXP = (amount: number) => {
    let xp = ch.xp + amount;
    let level = ch.level;
    let power = ch.power;
    // level up loop
    while (xp >= xpForNext(level)) {
      xp -= xpForNext(level);
      level += 1;
      power += 5; // each level adds power
    }
    setCh({ ...ch, xp, level, power });
  };

  const buyCosmetic = (item: keyof Cosmetics) => {
    setCh({ ...ch, cosmetics: { ...ch.cosmetics, [item]: true } });
  };

  return { ch, addXP, buyCosmetic, xpForNext };
}
