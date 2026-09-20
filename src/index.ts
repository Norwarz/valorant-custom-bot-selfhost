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
import {
  joinParticipant,
  leaveParticipant,
  registerParticipantRank,
  resetParticipants,
} from "./services/match-service.js";
import {
  createParticipantButtons,
  createParticipantsEmbed,
  createRankSelectMenu,
} from "./commands/participants.js";
import { isRankValue } from "./rank.js";
import { createMapButtons, createMapEmbed } from "./commands/map.js";
import { pickRandomMap } from "./map-pick.js";
import { createTeamButtons, createTeamEmbed } from "./commands/team.js";
import { getParticipants } from "./match-state.js";
import { splitByRank, splitIntoTeams, type Teams } from "./team-split.js";
import { replyError } from "./ui.js";
import { setLatestTeams } from "./team-state.js";
import { requireBotToken } from "./config.js";

const token = requireBotToken();

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
      await replyError(interaction, "サーバー内でのみ使用できます。");
      return;
    }

    const [prefix, action, panelMessageId] = interaction.customId.split(":");

    if (prefix !== "match" || action !== "rank-select") {
      return;
    }

    const selectedRank = interaction.values[0];

    if (!isRankValue(selectedRank)) {
      await replyError(interaction, "無効なランクが選択されました。");
      return;
    }

    const updated = registerParticipantRank(
      interaction.guildId,
      interaction.user.id,
      selectedRank,
    );

    if (!updated) {
      await replyError(interaction, "先に参加登録してください。");
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
      await replyError(interaction, "サーバー内でのみ使用できます。");
      return;
    }

    const guildId = interaction.guildId;

    if (interaction.customId === "match:join") {
      const member = interaction.member;

      const displayName =
        member && "displayName" in member
          ? member.displayName
          : (interaction.user.globalName ?? interaction.user.username);

      const joined = joinParticipant(guildId, {
        id: interaction.user.id,
        displayName,
        rank: null,
      });

      await replyError(
        interaction,
        joined
          ? `${displayName}さんが参加しました。`
          : "すでに参加登録されています。",
      );
      await interaction.message.edit({
        embeds: [createParticipantsEmbed(guildId)],
        components: [createParticipantButtons()],
      });

      return;
    }

    if (interaction.customId === "match:leave") {
      const participant = leaveParticipant(guildId, interaction.user.id);

      await replyError(
        interaction,
        participant
          ? `${participant.displayName}さんの参加を取り消しました。`
          : "参加登録されていません。",
      );
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
        await replyError(interaction, "サーバー内でのみ使用できます。");
        return;
      }

      const mode = interaction.customId.split(":")[2];

      if (mode !== "random" && mode !== "rank") {
        return;
      }

      const participants = getParticipants(interaction.guildId);

      if (participants.length < 2) {
        await replyError(interaction, "チーム分けには2人以上必要です。");
        return;
      }

      const teams: Teams =
        mode === "rank"
          ? splitByRank(participants)
          : splitIntoTeams(participants);

      // 既存のteam.tsにあるEmbed生成処理を、
      // createTeamEmbed(teams, mode, participants)のような関数に切り出して利用します。
      setLatestTeams(interaction.guildId, teams);

      const embed = createTeamEmbed(teams, mode, participants);

      await interaction.update({
        embeds: [embed],
        components: [createTeamButtons(mode)],
      });

      return;
    }

    if (
      interaction.customId.startsWith("reset:confirm:") ||
      interaction.customId.startsWith("reset:cancel:")
    ) {
      const [command, action, userId] = interaction.customId.split(":");

      if (command !== "reset") {
        return;
      }

      if (interaction.user.id !== userId) {
        await replyError(
          interaction,
          "この確認ボタンを操作できるのは、リセットを実行したユーザーだけです。",
        );
        return;
      }

      if (action === "cancel") {
        await interaction.update({
          content: "リセットをキャンセルしました。",
          components: [],
        });
        return;
      }

      if (action === "confirm") {
        if (!interaction.guildId) {
          await replyError(interaction, "サーバー内でのみ使用できます。");
          return;
        }

        const clearedCount = resetParticipants(interaction.guildId);

        await interaction.update({
          content: `参加者を${clearedCount}人リセットしました。`,
          components: [],
        });
      }

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
