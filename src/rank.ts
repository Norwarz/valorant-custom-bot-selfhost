export const rankChoices = [
  {
    name: "Iron_1",
    value: "iron1",
    score: 1,
    emoji: "<:Iron_1_Rank:1550188014880170106>",
  },
  {
    name: "Iron_2",
    value: "iron2",
    score: 2,
    emoji: "<:Iron_2_Rank:1550187946739769456>",
  },
  {
    name: "Iron_3",
    value: "iron3",
    score: 3,
    emoji: "<:Iron_3_Rank:1550187969208385649>",
  },
  {
    name: "Bronze_1",
    value: "bronze1",
    score: 4,
    emoji: "<:Bronze_1_Rank:1550188284687417447>",
  },
  {
    name: "Bronze_2",
    value: "bronze2",
    score: 5,
    emoji: "<:Bronze_2_Rank:1550188310343721051>",
  },
  {
    name: "Bronze_3",
    value: "bronze3",
    score: 6,
    emoji: "<:Bronze_3_Rank:1550188332137578596>",
  },
  {
    name: "Silver_1",
    value: "silver1",
    score: 7,
    emoji: "<:Silver_1_Rank:1550185741060018276>",
  },
  {
    name: "Silver_2",
    value: "silver2",
    score: 8,
    emoji: "<:Silver_2_Rank:1550185771753934878>",
  },
  {
    name: "Silver_3",
    value: "silver3",
    score: 9,
    emoji: "<:Silver_3_Rank:1550185683597922304>",
  },
  {
    name: "Gold_1",
    value: "gold1",
    score: 10,
    emoji: "<:Gold_1_Rank:1550188199781859468>",
  },
  {
    name: "Gold_2",
    value: "gold2",
    score: 11,
    emoji: "<:Gold_2_Rank:1550188086967934987>",
  },
  {
    name: "Gold_3",
    value: "gold3",
    score: 12,
    emoji: "<:Gold_3_Rank:1550188107587125298>",
  },
  {
    name: "Platinum_1",
    value: "platinum1",
    score: 13,
    emoji: "<:Platinum_1_Rank:1550187886425407488>",
  },
  {
    name: "Platinum_2",
    value: "platinum2",
    score: 14,
    emoji: "<:Platinum_2_Rank:1550187907506241547>",
  },
  {
    name: "Platinum_3",
    value: "platinum3",
    score: 15,
    emoji: "<:Platinum_3_Rank:1550187824202911745>",
  },
  {
    name: "Diamond_1",
    value: "diamond1",
    score: 16,
    emoji: "<:Diamond_1_Rank:1550188230454935582>",
  },
  {
    name: "Diamond_2",
    value: "diamond2",
    score: 17,
    emoji: "<:Diamond_2_Rank:1550188262172266516>",
  },
  {
    name: "Diamond_3",
    value: "diamond3",
    score: 18,
    emoji: "<:Diamond_3_Rank:1550188127463809085>",
  },
  {
    name: "Ascendant_1",
    value: "ascendant1",
    score: 19,
    emoji: "<:Ascendant_1_Rank:1550188397132513300>",
  },
  {
    name: "Ascendant_2",
    value: "ascendant2",
    score: 20,
    emoji: "<:Ascendant_2_Rank:1550188377423347773>",
  },
  {
    name: "Ascendant_3",
    value: "ascendant3",
    score: 21,
    emoji: "<:Ascendant_3_Rank:1550188352488349877>",
  },
  {
    name: "Immortal_1",
    value: "immortal1",
    score: 22,
    emoji: "<:Immortal_1_Rank:1550188041828700190>",
  },
  {
    name: "Immortal_2",
    value: "immortal2",
    score: 23,
    emoji: "<:Immortal_2_Rank:1550188065417330748>",
  },
  {
    name: "Immortal_3",
    value: "immortal3",
    score: 24,
    emoji: "<:Immortal_3_Rank:1550187992210219129>",
  },
  {
    name: "Radiant",
    value: "radiant",
    score: 25,
    emoji: "<:Radiant_Rank:1550187862283001856>",
  },
] as const;

export type RankValue = (typeof rankChoices)[number]["value"];

export function getRankScore(rank: RankValue): number {
  return rankChoices.find((item) => item.value === rank)?.score ?? 0;
}

export function getRankName(rank: RankValue | null): string {
  if (!rank) {
    return "未登録";
  }

  return rankChoices.find((item) => item.value === rank)?.name ?? "Null";
}

export function getRankDisplay(rank: RankValue | null): string {
  if (!rank) {
    return "<:Null_Rank:1550185637460705291> ランクなし";
  }

  const rankData = rankChoices.find((item) => item.value === rank);

  if (!rankData) {
    return "🏷️ 不明";
  }

  return `${rankData.emoji} ${rankData.name}`;
}

export function getRankFromAverageScore(
  averageScore: number,
): RankValue | null {
  if (!Number.isFinite(averageScore) || averageScore <= 0) {
    return null;
  }

  // 平均値に最も近いランクへ変換
  const roundedScore = Math.round(averageScore);

  // Iron 1未満、Radiant超過を防止
  const clampedScore = Math.min(25, Math.max(1, roundedScore));

  return rankChoices[clampedScore - 1]?.value ?? null;
}
