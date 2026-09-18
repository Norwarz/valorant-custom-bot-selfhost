import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { clearMatch, getParticipantCount } from "../match-state.js";

export const resetCommand = {
  data: new SlashCommandBuilder()
    .setName("reset")
    .setDescription("参加者を全員リセットします"),

  async execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId;

    if (!guildId) {
      await interaction.reply({
        content: "このコマンドはサーバー内でのみ使用できます。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const count = getParticipantCount(guildId);

    if (count === 0) {
      await interaction.reply({
        content: "現在、参加者は登録されていません。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`reset:confirm:${interaction.user.id}`)
        .setLabel(` ${count}人をリセット`)
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId(`reset:cancel:${interaction.user.id}`)
        .setLabel("キャンセル")
        .setStyle(ButtonStyle.Secondary),
    );

    await interaction.reply({
      content: `参加者${count}人をすべてリセットしますか？`,
      components: [buttons],
      flags: MessageFlags.Ephemeral,
    });
  },
};
