import { database } from "./database.js";

export type Participant = {
  id: string;
  displayName: string;
};

function ensureMatch(guildId: string): void {
  database
    .prepare(
      `
        INSERT OR IGNORE INTO matches (guild_id, status)
        VALUES (?, 'open')
      `,
    )
    .run(guildId);
}

export function isRegistrationOpen(guildId: string): boolean {
  ensureMatch(guildId);

  const match = database
    .prepare<
      [string],
      { status: "open" | "closed" }
    >("SELECT status FROM matches WHERE guild_id = ?")
    .get(guildId);

  return match?.status === "open";
}

export function setRegistrationOpen(guildId: string, isOpen: boolean): void {
  ensureMatch(guildId);

  database
    .prepare(
      `
        UPDATE matches
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE guild_id = ?
      `,
    )
    .run(isOpen ? "open" : "closed", guildId);
}

export function joinMatch(guildId: string, participant: Participant): boolean {
  ensureMatch(guildId);

  const result = database
    .prepare(
      `
        INSERT OR IGNORE INTO participants
          (guild_id, user_id, display_name)
        VALUES (?, ?, ?)
      `,
    )
    .run(guildId, participant.id, participant.displayName);

  return result.changes > 0;
}

export function leaveMatch(
  guildId: string,
  userId: string,
): Participant | null {
  const participant = database
    .prepare<[string, string], { id: string; displayName: string }>(
      `
        SELECT
          user_id AS id,
          display_name AS displayName
        FROM participants
        WHERE guild_id = ? AND user_id = ?
      `,
    )
    .get(guildId, userId);

  if (!participant) {
    return null;
  }

  database
    .prepare(
      `
        DELETE FROM participants
        WHERE guild_id = ? AND user_id = ?
      `,
    )
    .run(guildId, userId);

  return participant;
}

export function getParticipants(guildId: string): Participant[] {
  return database
    .prepare<[string], Participant>(
      `
        SELECT
          user_id AS id,
          display_name AS displayName
        FROM participants
        WHERE guild_id = ?
        ORDER BY joined_at ASC
      `,
    )
    .all(guildId);
}

export function getParticipantCount(guildId: string): number {
  const result = database
    .prepare<[string], { count: number }>(
      `
        SELECT COUNT(*) AS count
        FROM participants
        WHERE guild_id = ?
      `,
    )
    .get(guildId);

  return result?.count ?? 0;
}

export function clearMatch(guildId: string): number {
  const result = database
    .prepare("DELETE FROM participants WHERE guild_id = ?")
    .run(guildId);

  return result.changes;
}
