import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { isRegistrationOpen } from "../match-state.js";
import { changeRegistration } from "../services/match-service.js";

export const closeCommand = {
  data: new SlashCommandBuilder()
    .setName("close")
    .setDescription("参加受付を締め切ります"),

  async execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId;

    if (!guildId) {
      await interaction.reply({
        content: "このコマンドはDiscordサーバー内でのみ使用できます。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (!isRegistrationOpen(guildId)) {
      await interaction.reply({
        content: "参加受付はすでに締め切られています。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    changeRegistration(guildId, false);
    await interaction.reply("参加受付を締め切りました。");
  },
};
