import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { pickRandomMap } from "../map-pick.js";

export const mapCommand = {
  data: new SlashCommandBuilder()
    .setName("map")
    .setDescription("ステージを選択します")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("random")
        .setDescription("候補からランダムにステージを選択します"),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guildId) {
      await interaction.reply({
        content: "このコマンドはDiscordサーバー内でのみ使用できます。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const selectedMap = pickRandomMap();

    await interaction.reply(`🗺️ 今回のステージは **${selectedMap}** です！`);
  },
};
