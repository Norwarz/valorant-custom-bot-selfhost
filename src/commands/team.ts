import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { getParticipants, type Participant } from "../match-state.js";
import {
  getRankDisplay,
  getRankScore,
  getRankFromAverageScore,
} from "../rank.js";
import { splitByRank, splitIntoTeams, type Teams } from "../team-split.js";
import { replyError } from "../ui.js";
import { setLatestTeams } from "../team-state.js";

export function createTeamButtons(mode: "random" | "rank") {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`team:reroll:${mode}`)
      .setLabel("もう一度チーム分け")
      .setStyle(ButtonStyle.Primary),
  );
}

export function createTeamEmbed(
  teams: Teams,
  mode: "random" | "rank",
  participants: Participant[],
): EmbedBuilder {
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

  const hasUnregisteredRank = participants.some(
    (participant) => participant.rank === null,
  );

  if (mode === "rank" && hasUnregisteredRank) {
    embed.addFields({
      name: "注意",
      value:
        "ランク未登録の参加者がいるため、バランスが均等にならない可能性があります。",
    });
  }

  return embed;
}

function getTeamScore(members: Teams["teamA"]): number {
  return members.reduce(
    (total, member) => total + (member.rank ? getRankScore(member.rank) : 0),
    0,
  );
}

function getTeamAverageRank(members: Teams["teamA"]): string {
  const rankedMembers = members.filter(
    (
      member,
    ): member is Participant & { rank: NonNullable<Participant["rank"]> } =>
      member.rank !== null,
  );

  if (rankedMembers.length === 0) {
    return "⚪ ランク未登録";
  }

  const totalScore = rankedMembers.reduce(
    (total, member) => total + getRankScore(member.rank),
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
      await replyError(
        interaction,
        "このコマンドはサーバー内でのみ使用できます。",
      );
      return;
    }
    const participants = getParticipants(guildId);

    if (participants.length < 2) {
      await replyError(interaction, "チーム分けには2人以上必要です。");
      return;
    }

    if (participants.length > 10) {
      await replyError(
        interaction,
        "登録者は10人以下である必要があります。参加しない人は/leaveで離脱してください。",
      );
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand !== "random" && subcommand !== "rank") {
      await replyError(interaction, "無効なチーム分け方式です。");
      return;
    }

    const mode: "random" | "rank" = subcommand;
    const teams: Teams =
      mode === "rank"
        ? splitByRank(participants)
        : splitIntoTeams(participants);

    setLatestTeams(guildId, teams);

    const embed = createTeamEmbed(teams, mode, participants);

    await interaction.reply({
      embeds: [embed],
      components: [createTeamButtons(mode)],
    });
  },
};
