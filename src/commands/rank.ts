import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { isRankValue, rankChoices } from "../rank.js";
import { registerParticipantRank } from "../services/match-service.js";
import { getRankDisplay } from "../rank.js";
import { replyError } from "../ui.js";

export const rankCommand = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("自分のランクを登録します")
    .addStringOption((option) =>
      option
        .setName("value")
        .setDescription("現在のランク")
        .setRequired(true)
        .addChoices(
          ...rankChoices.map((rank) => ({
            name: rank.name,
            value: rank.value,
          })),
        ),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId;

    if (!guildId) {
      await replyError(
        interaction,
        "このコマンドはDiscordサーバー内でのみ使用できます。",
      );
      return;
    }

    const rank = interaction.options.getString("value", true);

    if (!isRankValue(rank)) {
      await replyError(interaction, "無効なランクが選択されました。");
      return;
    }

    const updated = registerParticipantRank(guildId, interaction.user.id, rank);

    if (!updated) {
      await replyError(interaction, "先に`/join`で参加登録してください。");
      return;
    }
    await interaction.reply({
      content: `ランクを **${getRankDisplay(rank)}** に登録しました。`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
