import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import {
  getParticipantCount,
  getParticipants,
  isRegistrationOpen,
} from "../match-state.js";
import { getRankDisplay } from "../rank.js";

export const participantsCommand = {
  data: new SlashCommandBuilder()
    .setName("participants")
    .setDescription("現在の参加者を表示します"),

  async execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId;

    if (!guildId) {
      await interaction.reply({
        content: "このコマンドはDiscordサーバー内でのみ使用できます。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const status = isRegistrationOpen(guildId) ? "受付中" : "締切";
    const participants = getParticipants(guildId);
    if (participants.length === 0) {
      await interaction.reply(
        `参加受付: **${status}**\n現在、参加者はいません。`,
      );
      return;
    }
    const participantList = participants
      .map(
        (participant, index) =>
          `${index + 1}. ${participant.displayName}（${getRankDisplay(
            participant.rank,
          )}）`,
      )
      .join("\n");
    await interaction.reply(
      [
        `現在の参加者（${getParticipantCount(guildId)}人）`,
        "",
        participantList || "参加者はいません。",
      ].join("\n"),
    );
  },
};
