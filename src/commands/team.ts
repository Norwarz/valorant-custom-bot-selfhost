import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { getParticipants } from "../match-state.js";
import {
  getRankDisplay,
  getRankScore,
  getRankFromAverageScore,
} from "../rank.js";
import { splitByRank, splitIntoTeams, type Teams } from "../team-split.js";

function getTeamScore(members: Teams["teamA"]): number {
  return members.reduce(
    (total, member) => total + (member.rank ? getRankScore(member.rank) : 0),
    0,
  );
}

function getTeamAverageRank(members: Teams["teamA"]): string {
  const rankedMembers = members.filter((member) => member.rank !== null);

  if (rankedMembers.length === 0) {
    return "⚪ ランク未登録";
  }

  const totalScore = rankedMembers.reduce(
    (total, member) => total + getRankScore(member.rank!),
    0,
  );

  const averageScore = totalScore / rankedMembers.length;
  const averageRank = getRankFromAverageScore(averageScore);

  return getRankDisplay(averageRank);
}

function formatTeamMembers(members: Teams["teamA"]): string {
  return members
    .map(
      (member, index) =>
        `${index + 1}. <@${member.id}>（${getRankDisplay(member.rank)}）`,
    )
    .join("\n");
}

export const teamCommand = {
  data: new SlashCommandBuilder()
    .setName("team")
    .setDescription("参加者をチーム分けします")
    .addSubcommand((subcommand) =>
      subcommand.setName("random").setDescription("ランダムにチーム分けします"),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("rank")
        .setDescription("ランクが近くなるようにチーム分けします"),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId;

    if (!guildId) {
      await interaction.reply({
        content: "このコマンドはサーバー内でのみ使用できます。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const participants = getParticipants(guildId);

    if (participants.length < 2) {
      await interaction.reply({
        content: "チーム分けには2人以上必要です。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (participants.length > 10) {
      await interaction.reply({
        content:
          "登録者は10人以下である必要があります。参加しない人は/leaveで離脱してください。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const mode = interaction.options.getSubcommand();

    const teams: Teams =
      mode === "rank"
        ? splitByRank(participants)
        : splitIntoTeams(participants);

    const hasUnregisteredRank = participants.some(
      (participant) => participant.rank === null,
    );

    const embed = new EmbedBuilder()
      .setTitle(
        mode === "rank"
          ? "⚖️ ランクを考慮したチーム分け結果"
          : "🎮 ランダムチーム分け結果",
      )
      .setColor(mode === "rank" ? 0x5865f2 : 0xfee75c)
      .addFields(
        {
          name: "Team A",
          value:
            `${formatTeamMembers(teams.teamA)}\n\n` +
            `平均ランク: ${getTeamAverageRank(teams.teamA)}`,
          inline: true,
        },
        {
          name: "Team B",
          value:
            `${formatTeamMembers(teams.teamB)}\n\n` +
            `平均ランク: ${getTeamAverageRank(teams.teamB)}`,
          inline: true,
        },
      );

    if (mode === "rank" && hasUnregisteredRank) {
      embed.addFields({
        name: "注意",
        value:
          "ランク未登録の参加者がいるため、バランスが均等にならない可能性があります。",
      });
    }

    await interaction.reply({
      embeds: [embed],
    });
  },
};
