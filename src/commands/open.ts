import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { isRegistrationOpen, setRegistrationOpen } from "../match-state.js";

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

    setRegistrationOpen(guildId, true);
    await interaction.reply("参加受付を開始しました。");
  },
};
