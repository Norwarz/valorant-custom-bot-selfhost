import {
  clearMatch,
  joinMatch as saveParticipant,
  leaveMatch as deleteParticipant,
  setParticipantRank as saveParticipantRank,
  setRegistrationOpen as saveRegistrationOpen,
  type Participant,
} from "../match-state.js";
import type { RankValue } from "../rank.js";

export function joinParticipant(
  guildId: string,
  participant: Participant,
): boolean {
  return saveParticipant(guildId, participant);
}

export function leaveParticipant(
  guildId: string,
  userId: string,
): Participant | null {
  return deleteParticipant(guildId, userId);
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
  return clearMatch(guildId);
}
