import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { commands } from "./commands/index.js";
import "./database.js";
import { joinMatch, leaveMatch } from "./match-state.js";
import { MessageFlags } from "discord.js";
import {
  createParticipantButtons,
  createParticipantsEmbed,
} from "./commands/participants.js";

const token = process.env.DISCORD_TOKEN;

if (!token) {
  throw new Error("DISCORD_TOKEN が .env に設定されていません。");
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const commandMap = new Map(commands.map((cmd) => [cmd.data.name, cmd]));

client.once(Events.ClientReady, (readyClient) => {
  console.log(`${readyClient.user.tag} としてログインしました。`);
});
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton()) {
    if (!interaction.guildId) {
      await interaction.reply({
        content: "サーバー内でのみ使用できます。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const guildId = interaction.guildId;

    if (interaction.customId === "match:join") {
      const member = interaction.member;

      const displayName =
        member && "displayName" in member
          ? member.displayName
          : (interaction.user.globalName ?? interaction.user.username);

      const joined = joinMatch(guildId, {
        id: interaction.user.id,
        displayName,
        rank: null,
      });

      await interaction.reply({
        content: joined
          ? `${displayName}さんが参加しました。`
          : "すでに参加登録されています。",
        flags: MessageFlags.Ephemeral,
      });
      await interaction.message.edit({
        embeds: [createParticipantsEmbed(guildId)],
        components: [createParticipantButtons()],
      });

      return;
    }

    if (interaction.customId === "match:leave") {
      const participant = leaveMatch(guildId, interaction.user.id);

      await interaction.reply({
        content: participant
          ? `${participant.displayName}さんの参加を取り消しました。`
          : "参加登録されていません。",
        flags: MessageFlags.Ephemeral,
      });
      await interaction.message.edit({
        embeds: [createParticipantsEmbed(guildId)],
        components: [createParticipantButtons()],
      });

      return;
    }

    return;
  }

  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = commandMap.get(interaction.commandName);

  if (!command) {
    console.error(`コマンドが見つかりません: ${interaction.commandName}`);
    return;
  }

  await command.execute(interaction);
});
client.login(token);
