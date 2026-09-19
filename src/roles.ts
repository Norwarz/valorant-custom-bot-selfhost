import type { Participant } from "./match-state.js";
import type { Teams } from "./team-split.js";

export const roleChoices = [
  { name: "Duelist", emoji: "<:Duelist:1550846120610238535>" },
  { name: "Initiator", emoji: "<:Initiator:1550846145817878618>" },
  { name: "Controller", emoji: "<:Controller:1550846084585365584>" },
  { name: "Sentinel", emoji: "<:Sentinel:1550846167812673608>" },
] as const;

export type Role = (typeof roleChoices)[number]["name"];

export type RoleAssignment = {
  participant: Participant;
  role: Role;
};

export type TeamRoles = {
  teamA: RoleAssignment[];
  teamB: RoleAssignment[];
};

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

function assignTeamRoles(
  participants: Participant[],
  ensureAllRoles: boolean,
): RoleAssignment[] {
  const shuffledParticipants = shuffle(participants);
  const shuffledRoles = shuffle(roleChoices.map((role) => role.name));

  return shuffledParticipants.map((participant, index) => ({
    participant,
    role:
      ensureAllRoles &&
      participants.length >= roleChoices.length &&
      index < roleChoices.length
        ? shuffledRoles[index]
        : shuffledRoles[Math.floor(Math.random() * shuffledRoles.length)],
  }));
}

export function assignRoles(teams: Teams, ensureAllRoles: boolean): TeamRoles {
  return {
    teamA: assignTeamRoles(teams.teamA, ensureAllRoles),
    teamB: assignTeamRoles(teams.teamB, ensureAllRoles),
  };
}

export function assignRandomRoles(teams: Teams): TeamRoles {
  return assignRoles(teams, true);
}

export function assignFreeRoles(teams: Teams): TeamRoles {
  return assignRoles(teams, false);
}

export function getRoleDisplay(role: Role): string {
  const roleData = roleChoices.find((item) => item.name === role);
  return roleData ? roleData.emoji + " " + roleData.name : role;
}
