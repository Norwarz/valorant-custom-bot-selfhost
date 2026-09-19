import type { Teams } from "./team-split.js";

const latestTeams = new Map<string, Teams>();

export function setLatestTeams(guildId: string, teams: Teams): void {
  latestTeams.set(guildId, {
    teamA: [...teams.teamA],
    teamB: [...teams.teamB],
  });
}

export function getLatestTeams(guildId: string): Teams | null {
  return latestTeams.get(guildId) ?? null;
}

export function clearLatestTeams(guildId: string): void {
  latestTeams.delete(guildId);
}
