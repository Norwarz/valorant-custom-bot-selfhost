import { maps } from "./maps.js";

export function pickRandomMap(candidates: string[] = maps): string {
  if (candidates.length === 0) {
    throw new Error("マップ候補がありません。");
  }

  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}
