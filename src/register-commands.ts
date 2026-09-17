import "dotenv/config";
import { REST, Routes } from "discord.js";
import { commands } from "./commands/index.js";

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token || !clientId || !guildId) {
  throw new Error(
    "DISCORD_TOKEN, DISCORD_CLIENT_ID, または DISCORD_GUILD_ID が .env に設定されていません。",
  );
}

const rest = new REST({ version: "10" }).setToken(token);

await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
  body: commands.map((cmd) => cmd.data.toJSON()),
});

console.log("コマンドが正常に登録されました。");
