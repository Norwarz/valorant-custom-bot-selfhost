import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { pingCommand } from "./commands/ping.js";

const token = process.env.DISCORD_TOKEN;

if (!token) {
  throw new Error("DISCORD_TOKEN が .env に設定されていません。");
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const commands = new Map([
    [pingCommand.data.name, pingCommand]
]);

client.once(Events.ClientReady, (readyClient) => {
  console.log(`${readyClient.user.tag} としてログインしました。`);
});
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }
    const command = commands.get(interaction.commandName);

    if (!command) {
        console.error(`コマンド ${interaction.commandName} が見つかりません。`);
        return;
    }
    await command.execute(interaction);
});

client.login(token);