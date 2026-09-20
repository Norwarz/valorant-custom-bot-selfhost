import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { botConfig } from "./config.js";

mkdirSync(botConfig.dataDirectory, { recursive: true });

const databasePath = join(botConfig.dataDirectory, "bot.sqlite");

export const database = new Database(databasePath);

database.pragma("foreign_keys = ON");

database.exec(`
  CREATE TABLE IF NOT EXISTS matches (
    guild_id TEXT PRIMARY KEY,
    status TEXT NOT NULL
      CHECK (status IN ('open', 'closed'))
      DEFAULT 'open',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS participants (
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    display_name TEXT NOT NULL,
    joined_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (guild_id, user_id),

    FOREIGN KEY (guild_id)
      REFERENCES matches(guild_id)
      ON DELETE CASCADE
  );
`);
const participantColumns = database
  .prepare<[], { name: string }>("PRAGMA table_info(participants)")
  .all();

if (!participantColumns.some((column) => column.name === "rank")) {
  database.exec(`
    ALTER TABLE participants
    ADD COLUMN rank TEXT
  `);
}
console.log(`SQLite database connected: ${databasePath}`);
