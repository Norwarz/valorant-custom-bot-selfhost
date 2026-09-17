import type { Participant } from "./match-state.js";

export type Teams = {
  teamA: Participant[];
  teamB: Participant[];
};

export function splitIntoTeams(participants: Participant[]): Teams {
  const shuffled = [...participants];
  // Fisher-Yatesシャッフル
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }

  const teamA: Participant[] = [];
  const teamB: Participant[] = [];

  // 順番に振り分ける
  shuffled.forEach((participant, index) => {
    if (index % 2 === 0) {
      teamA.push(participant);
    } else {
      teamB.push(participant);
    }
  });

  return { teamA, teamB };
}
