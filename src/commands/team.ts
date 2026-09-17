import {
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { getParticipants } from "../match-state.js";
import { splitIntoTeams } from "../team-split.js";

export const teamCommand = {
  data: new SlashCommandBuilder()
    .setName("team")
    .setDescription("参加者をチーム分けします")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild.toString())
    .addSubcommand((subcommand) =>
      subcommand
        .setName("random")
        .setDescription("参加者をランダムに2チームへ分けます"),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId;

    if (!guildId) {
      await interaction.reply({
        content: "このコマンドはDiscordサーバー内でのみ使用できます。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
      await interaction.reply({
        content: "このコマンドはサーバー管理者のみ実行できます。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const participants = getParticipants(guildId);

    if (participants.length < 2) {
      await interaction.reply({
        content: "チーム分けには2人以上の参加者が必要です。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const { teamA, teamB } = splitIntoTeams(participants);

    const formatTeam = (teamName: string, members: typeof teamA) =>
      `**${teamName}**\n${
        members.map((member) => `・${member.displayName}`).join("\n") ||
        "メンバーなし"
      }`;

    await interaction.reply(
      [
        "🎮 チーム分け結果",
        "",
        formatTeam("Team A", teamA),
        "",
        formatTeam("Team B", teamB),
      ].join("\n"),
    );
  },
};
