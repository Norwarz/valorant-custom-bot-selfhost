import type { Participant } from "./match-state.js";
import { getRankScore } from "./rank.js";

export type Teams = {
  teamA: Participant[];
  teamB: Participant[];
};

export function splitIntoTeams(participants: Participant[]): Teams {
  const shuffled = [...participants];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }

  const teamA: Participant[] = [];
  const teamB: Participant[] = [];

  shuffled.forEach((participant, index) => {
    if (index % 2 === 0) {
      teamA.push(participant);
    } else {
      teamB.push(participant);
    }
  });

  return { teamA, teamB };
}

export function splitByRank(participants: Participant[]): Teams {
  const sorted = [...participants].sort(
    (a, b) => getRankScore(b.rank ?? "iron1") - getRankScore(a.rank ?? "iron1"),
  );

  const teamA: Participant[] = [];
  const teamB: Participant[] = [];

  let teamAScore = 0;
  let teamBScore = 0;

  for (const participant of sorted) {
    const score = participant.rank ? getRankScore(participant.rank) : 0;

    if (
      teamA.length < teamB.length ||
      (teamA.length === teamB.length && teamAScore <= teamBScore)
    ) {
      teamA.push(participant);
      teamAScore += score;
    } else {
      teamB.push(participant);
      teamBScore += score;
    }
  }

  return { teamA, teamB };
}
