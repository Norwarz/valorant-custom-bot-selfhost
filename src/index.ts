import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { commands } from "./commands/index.js";

const token = process.env.DISCORD_TOKEN;

if (!token) {
  throw new Error("DISCORD_TOKEN が .env に設定されていません。");
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const commandMap = new Map(
    commands.map((cmd) => [cmd.data.name, cmd])
);

client.once(Events.ClientReady, (readyClient) => {
  console.log(`${readyClient.user.tag} としてログインしました。`);
});
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }
    const command = commandMap.get(interaction.commandName);

    if (!command) {
        console.error(`コマンド ${interaction.commandName} が見つかりません。`);
        return;
    }
    await command.execute(interaction);
});

client.login(token);