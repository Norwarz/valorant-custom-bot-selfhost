import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { pickRandomMap } from "../map-pick.js";
import { replyError } from "../ui.js";

export function createMapButtons() {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("map:random")
      .setLabel("再抽選")
      .setStyle(ButtonStyle.Primary),
  );
}

export function createMapEmbed(selectedMap: string) {
  const imageFileName = `${selectedMap}.png`;

  return {
    embed: new EmbedBuilder()
      .setTitle("今回のステージ")
      .setDescription(`**${selectedMap}**`)
      .setColor(0x5865f2)
      .setImage(`attachment://${imageFileName}`),

    file: {
      attachment: `assets/maps/${imageFileName}`,
      name: imageFileName,
    },
  };
}

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
      await replyError(
        interaction,
        "このコマンドはDiscordサーバー内でのみ使用できます。",
      );
      return;
    }

    const selectedMap = pickRandomMap();
    const { embed, file } = createMapEmbed(selectedMap);

    await interaction.reply({
      embeds: [embed],
      files: [file],
      components: [createMapButtons()],
    });
  },
};
