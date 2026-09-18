import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import {
  getParticipantCount,
  getParticipants,
  isRegistrationOpen,
} from "../match-state.js";
import { getRankDisplay } from "../rank.js";

export function createParticipantButtons() {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("match:join")
      .setLabel("参加")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("match:leave")
      .setLabel("辞退")
      .setStyle(ButtonStyle.Danger),
  );
}

export function createParticipantsEmbed(guildId: string) {
  const registrationOpen = isRegistrationOpen(guildId);
  const participants = getParticipants(guildId);

  const participantList =
    participants.length > 0
      ? participants
          .map(
            (participant, index) =>
              `${index + 1}. <@${participant.id}>（${getRankDisplay(
                participant.rank,
              )}）`,
          )
          .join("\n")
      : "参加者はいません。";

  const unregisteredCount = participants.filter(
    (participant) => participant.rank === null,
  ).length;

  const embed = new EmbedBuilder()
    .setTitle("VALORANTカスタムマッチ")
    .setColor(registrationOpen ? 0x57f287 : 0xed4245)
    .addFields(
      {
        name: "参加受付",
        value: registrationOpen ? "受付中" : "締切",
        inline: true,
      },
      {
        name: "参加人数",
        value: `${getParticipantCount(guildId)}人`,
        inline: true,
      },
      {
        name: "参加者",
        value: participantList,
      },
    )
    .setFooter({
      text: "ランク未登録の場合は /rank を実行してください",
    });

  if (unregisteredCount > 0) {
    embed.addFields({
      name: "注意",
      value: `ランク未登録: ${unregisteredCount}人`,
    });
  }

  return embed;
}

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

    await interaction.reply({
      embeds: [createParticipantsEmbed(guildId)],
      components: [createParticipantButtons()],
    });
  },
};
