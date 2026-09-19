import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { getLatestTeams } from "../team-state.js";
import {
  assignRandomRoles,
  getRoleDisplay,
  type RoleAssignment,
  type TeamRoles,
} from "../roles.js";
import { replyError } from "../ui.js";

function formatMembers(assignments: RoleAssignment[]): string {
  return assignments
    .map(
      ({ participant, role }, index) =>
        String(index + 1) +
        ". <@" +
        participant.id +
        "> — " +
        getRoleDisplay(role),
    )
    .join("\n");
}

export function createRoleEmbed(teamRoles: TeamRoles): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle("ランダムロール決定")
    .setColor(0x57f287)
    .addFields(
      {
        name: "Team A",
        value: formatMembers(teamRoles.teamA) || "参加者なし",
        inline: true,
      },
      {
        name: "Team B",
        value: formatMembers(teamRoles.teamB) || "参加者なし",
        inline: true,
      },
    )
    .setFooter({ text: "4人以上のチームは各ロールを最低1人ずつ配置" });
}

export const roleCommand = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("チームメンバーのロールを決定します")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("random")
        .setDescription("各プレイヤーのロールをランダムに決定します"),
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const guildId = interaction.guildId;

    if (!guildId) {
      await replyError(interaction, "このコマンドはDiscordサーバー内でのみ使用できます。");
      return;
    }

    if (interaction.options.getSubcommand() !== "random") {
      await replyError(interaction, "指定されたロール決定方法は利用できません。");
      return;
    }

    const teams = getLatestTeams(guildId);

    if (!teams) {
      await replyError(
        interaction,
        "先に /team random または /team rank を実行してください。",
      );
      return;
    }

    await interaction.reply({
      embeds: [createRoleEmbed(assignRandomRoles(teams))],
    });
  },
};
