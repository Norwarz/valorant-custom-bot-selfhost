import {
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { getParticipants } from "../match-state.js";
import { getRankName } from "../rank.js";
import { splitByRank, splitIntoTeams, type Teams } from "../team-split.js";

export const teamCommand = {
  data: new SlashCommandBuilder()
    .setName("team")
    .setDescription("参加者をチーム分けします")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild.toString())
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

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
      await interaction.reply({
        content: "サーバー管理者のみ実行できます。",
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

    const mode = interaction.options.getSubcommand();
    const teams: Teams =
      mode === "rank"
        ? splitByRank(participants)
        : splitIntoTeams(participants);

    const hasUnregisteredRank = participants.some(
      (participant) => participant.rank === null,
    );

    const formatTeam = (name: string, members: Teams["teamA"]) =>
      `**${name}**\n${members
        .map(
          (member) => `・${member.displayName}（${getRankName(member.rank)}）`,
        )
        .join("\n")}`;

    const warning =
      mode === "rank" && hasUnregisteredRank
        ? "\n⚠️ ランク未登録の参加者がいるため、バランスが均等にならない可能性があります。\n"
        : "";

    await interaction.reply(
      [
        mode === "rank"
          ? "⚖️ ランクを考慮したチーム分け結果"
          : "🎮 ランダムチーム分け結果",
        warning,
        formatTeam("Team A", teams.teamA),
        "",
        formatTeam("Team B", teams.teamB),
      ].join("\n"),
    );
  },
};
