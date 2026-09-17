import {
  ChatInputCommandInteraction,
  EmbedBuilder,
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
    const imageFileName = `${selectedMap}.png`;

    const embed = new EmbedBuilder()
      .setTitle("今回のステージ")
      .setDescription(`**${selectedMap}**`)
      .setColor(0x5865f2)
      .setImage(`attachment://${imageFileName}`);

    await interaction.reply({
      embeds: [embed],
      files: [
        {
          attachment: `assets/maps/${imageFileName}`,
          name: imageFileName,
        },
      ],
    });
  },
};
