import {
  clearMatch,
  joinMatch as saveParticipant,
  leaveMatch as deleteParticipant,
  setParticipantRank as saveParticipantRank,
  setRegistrationOpen as saveRegistrationOpen,
  type Participant,
} from "../match-state.js";
import type { RankValue } from "../rank.js";
import { clearLatestTeams } from "../team-state.js";

export function joinParticipant(
  guildId: string,
  participant: Participant,
): boolean {
  const saved = saveParticipant(guildId, participant);
  if (saved) clearLatestTeams(guildId);
  return saved;
}

export function leaveParticipant(
  guildId: string,
  userId: string,
): Participant | null {
  const participant = deleteParticipant(guildId, userId);
  if (participant) clearLatestTeams(guildId);
  return participant;
}

export function changeRegistration(guildId: string, isOpen: boolean): void {
  saveRegistrationOpen(guildId, isOpen);
}

export function registerParticipantRank(
  guildId: string,
  userId: string,
  rank: RankValue,
): boolean {
  return saveParticipantRank(guildId, userId, rank);
}

export function resetParticipants(guildId: string): number {
  const clearedCount = clearMatch(guildId);
  clearLatestTeams(guildId);
  return clearedCount;
}
