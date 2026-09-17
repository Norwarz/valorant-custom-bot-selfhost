export const rankChoices = [
  { name: "Iron 1", value: "iron1", score: 1 },
  { name: "Iron 2", value: "iron2", score: 2 },
  { name: "Iron 3", value: "iron3", score: 3 },
  { name: "Bronze 1", value: "bronze1", score: 4 },
  { name: "Bronze 2", value: "bronze2", score: 5 },
  { name: "Bronze 3", value: "bronze3", score: 6 },
  { name: "Silver 1", value: "silver1", score: 7 },
  { name: "Silver 2", value: "silver2", score: 8 },
  { name: "Silver 3", value: "silver3", score: 9 },
  { name: "Gold 1", value: "gold1", score: 10 },
  { name: "Gold 2", value: "gold2", score: 11 },
  { name: "Gold 3", value: "gold3", score: 12 },
  { name: "Platinum 1", value: "platinum1", score: 13 },
  { name: "Platinum 2", value: "platinum2", score: 14 },
  { name: "Platinum 3", value: "platinum3", score: 15 },
  { name: "Diamond 1", value: "diamond1", score: 16 },
  { name: "Diamond 2", value: "diamond2", score: 17 },
  { name: "Diamond 3", value: "diamond3", score: 18 },
  { name: "Ascendant 1", value: "ascendant1", score: 19 },
  { name: "Ascendant 2", value: "ascendant2", score: 20 },
  { name: "Ascendant 3", value: "ascendant3", score: 21 },
  { name: "Immortal 1", value: "immortal1", score: 22 },
  { name: "Immortal 2", value: "immortal2", score: 23 },
  { name: "Immortal 3", value: "immortal3", score: 24 },
  { name: "Radiant", value: "radiant", score: 25 },
] as const;

export type RankValue = (typeof rankChoices)[number]["value"];

export function getRankScore(rank: RankValue): number {
  return rankChoices.find((item) => item.value === rank)?.score ?? 0;
}

export function getRankName(rank: RankValue | null): string {
  if (!rank) {
    return "未登録";
  }

  return rankChoices.find((item) => item.value === rank)?.name ?? "不明";
}
