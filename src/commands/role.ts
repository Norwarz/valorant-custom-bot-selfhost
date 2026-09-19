import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { getLatestTeams } from "../team-state.js";
import {
  assignFreeRoles,
  assignRandomRoles,
  getRoleDisplay,
  type RoleAssignment,
  type TeamRoles,
} from "../roles.js";
import { replyError } from "../ui.js";

type RoleMode = "random" | "free";

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

export function createRoleEmbed(
  teamRoles: TeamRoles,
  mode: RoleMode = "random",
): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle(mode === "random" ? "ランダムロール決定" : "自由ロール決定")
    .setColor(mode === "random" ? 0x57f287 : 0xfee75c)
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
    );

  if (mode === "random") {
    embed.setFooter({
      text: "4人以上のチームは各ロールを最低1人ずつ配置",
    });
  } else {
    embed.setFooter({
      text: "ロールの重複・未使用を許可",
    });
  }

  return embed;
}

export const roleCommand = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("チームメンバーのロールを決定します")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("random")
        .setDescription("各ロールを最低1人ずつ含めてランダムに決定します"),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("free")
        .setDescription("制約なしでロールをランダムに決定します"),
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const guildId = interaction.guildId;

    if (!guildId) {
      await replyError(
        interaction,
        "このコマンドはDiscordサーバー内でのみ使用できます。",
      );
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand !== "random" && subcommand !== "free") {
      await replyError(
        interaction,
        "指定されたロール決定方法は利用できません。",
      );
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

    const mode: RoleMode = subcommand;
    const teamRoles =
      mode === "random" ? assignRandomRoles(teams) : assignFreeRoles(teams);

    await interaction.reply({
      embeds: [createRoleEmbed(teamRoles, mode)],
    });
  },
};
