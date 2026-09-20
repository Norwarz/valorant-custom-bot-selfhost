import { REST, Routes } from "discord.js";
import { commands } from "./commands/index.js";
import { requireBotToken, requireCommandRegistrationConfig } from "./config.js";

const token = requireBotToken();
const { discordClientId: clientId, discordGuildId: guildId } =
  requireCommandRegistrationConfig();

const rest = new REST({ version: "10" }).setToken(token);

await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
  body: commands.map((cmd) => cmd.data.toJSON()),
});

console.log("コマンドが正常に登録されました。");
