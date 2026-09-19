import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { isRegistrationOpen } from "../match-state.js";
import { changeRegistration } from "../services/match-service.js";

export const openCommand = {
  data: new SlashCommandBuilder()
    .setName("open")
    .setDescription("参加受付を開始します"),

  async execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId;

    if (!guildId) {
      await interaction.reply({
        content: "このコマンドはDiscordサーバー内でのみ使用できます。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (isRegistrationOpen(guildId)) {
      await interaction.reply({
        content: "参加受付はすでに開始されています。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    changeRegistration(guildId, true);
    await interaction.reply("参加受付を開始しました。");
  },
};
