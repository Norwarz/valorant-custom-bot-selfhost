import "dotenv/config";
import {
  Client,
  Events,
  GatewayIntentBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  MessageFlags,
} from "discord.js";
import { commands } from "./commands/index.js";
import "./database.js";
import { joinMatch, leaveMatch } from "./match-state.js";
import {
  createParticipantButtons,
  createParticipantsEmbed,
  createRankSelectMenu,
} from "./commands/participants.js";
import { rankChoices, type RankValue } from "./rank.js";
import { setParticipantRank } from "./match-state.js";
import { createMapButtons, createMapEmbed } from "./commands/map.js";
import { pickRandomMap } from "./map-pick.js";
import { createTeamButtons, createTeamEmbed } from "./commands/team.js";
import { getParticipants } from "./match-state.js";
import { splitByRank, splitIntoTeams, type Teams } from "./team-split.js";

const token = process.env.DISCORD_TOKEN;

if (!token) {
  throw new Error("DISCORD_TOKEN が .env に設定されていません。");
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const commandMap = new Map(commands.map((cmd) => [cmd.data.name, cmd]));

client.once(Events.ClientReady, (readyClient) => {
  console.log(`${readyClient.user.tag} としてログインしました。`);
});
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isStringSelectMenu()) {
    if (!interaction.guildId) {
      await interaction.reply({
        content: "サーバー内でのみ使用できます。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const [prefix, action, panelMessageId] = interaction.customId.split(":");

    if (prefix !== "match" || action !== "rank-select") {
      return;
    }

    const selectedRank = interaction.values[0] as RankValue;

    const isValidRank = rankChoices.some((rank) => rank.value === selectedRank);

    if (!isValidRank) {
      await interaction.reply({
        content: "無効なランクが選択されました。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const updated = setParticipantRank(
      interaction.guildId,
      interaction.user.id,
      selectedRank,
    );

    if (!updated) {
      await interaction.reply({
        content: "先に参加登録してください。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.update({
      content: "ランクを登録しました。",
      components: [],
    });

    try {
      const channel = interaction.channel;

      if (channel?.isTextBased() && "messages" in channel) {
        const panelMessage = await channel.messages.fetch(panelMessageId);

        await panelMessage.edit({
          embeds: [createParticipantsEmbed(interaction.guildId)],
          components: [createParticipantButtons()],
        });
      }
    } catch (error) {
      console.error("参加者Embedの更新に失敗しました:", error);
    }

    return;
  }

  // ボタン処理
  if (interaction.isButton()) {
    if (!interaction.guildId) {
      await interaction.reply({
        content: "サーバー内でのみ使用できます。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const guildId = interaction.guildId;

    if (interaction.customId === "match:join") {
      const member = interaction.member;

      const displayName =
        member && "displayName" in member
          ? member.displayName
          : (interaction.user.globalName ?? interaction.user.username);

      const joined = joinMatch(guildId, {
        id: interaction.user.id,
        displayName,
        rank: null,
      });

      await interaction.reply({
        content: joined
          ? `${displayName}さんが参加しました。`
          : "すでに参加登録されています。",
        flags: MessageFlags.Ephemeral,
      });
      await interaction.message.edit({
        embeds: [createParticipantsEmbed(guildId)],
        components: [createParticipantButtons()],
      });

      return;
    }

    if (interaction.customId === "match:leave") {
      const participant = leaveMatch(guildId, interaction.user.id);

      await interaction.reply({
        content: participant
          ? `${participant.displayName}さんの参加を取り消しました。`
          : "参加登録されていません。",
        flags: MessageFlags.Ephemeral,
      });
      await interaction.message.edit({
        embeds: [createParticipantsEmbed(guildId)],
        components: [createParticipantButtons()],
      });

      return;
    }

    if (interaction.customId === "match:rank") {
      const menu = createRankSelectMenu(interaction.message.id);

      await interaction.reply({
        content: "登録するランクを選択してください。",
        components: [
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu),
        ],
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    if (interaction.customId === "map:random") {
      const selectedMap = pickRandomMap();
      const { embed, file } = createMapEmbed(selectedMap);

      await interaction.update({
        embeds: [embed],
        files: [file],
        components: [createMapButtons()],
      });

      return;
    }
    if (interaction.customId.startsWith("team:reroll:")) {
      if (!interaction.guildId) {
        await interaction.reply({
          content: "サーバー内でのみ使用できます。",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const mode = interaction.customId.split(":")[2];

      if (mode !== "random" && mode !== "rank") {
        return;
      }

      const participants = getParticipants(interaction.guildId);

      if (participants.length < 2) {
        await interaction.reply({
          content: "チーム分けには2人以上必要です。",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const teams: Teams =
        mode === "rank"
          ? splitByRank(participants)
          : splitIntoTeams(participants);

      // 既存のteam.tsにあるEmbed生成処理を、
      // createTeamEmbed(teams, mode, participants)のような関数に切り出して利用します。
      const embed = createTeamEmbed(teams, mode, participants);

      await interaction.update({
        embeds: [embed],
        components: [createTeamButtons(mode)],
      });

      return;
    }
    return;
  }

  if (!interaction.isChatInputCommand()) {
    return;
  }

  // コマンド処理
  const command = commandMap.get(interaction.commandName);

  if (!command) {
    console.error(`コマンドが見つかりません: ${interaction.commandName}`);
    return;
  }

  await command.execute(interaction);
});
client.login(token);
