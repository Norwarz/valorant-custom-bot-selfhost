import {
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { isRegistrationOpen, setRegistrationOpen } from "../match-state.js";

export const openCommand = {
  data: new SlashCommandBuilder()
    .setName("open")
    .setDescription("参加受付を開始します"),

  async execute(interaction: ChatInputCommandInteraction) {
    const canManage = interaction.memberPermissions?.has(
      PermissionFlagsBits.ManageGuild,
    );

    if (!canManage) {
      await interaction.reply({
        content: "このコマンドを実行する権限がありません。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (isRegistrationOpen()) {
      await interaction.reply({
        content: "参加受付はすでに開始されています。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    setRegistrationOpen(true);
    await interaction.reply("参加受付を開始しました。");
  },
};