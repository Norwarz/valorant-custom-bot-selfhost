import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { joinParticipant } from "../services/match-service.js";
import { isRegistrationOpen } from "../match-state.js";
import { replyError } from "../ui.js";

const messageLinkPattern =
  /^https?:\/\/(?:canary\.|ptb\.)?(?:discord\.com|discordapp\.com)\/channels\/(\d+)\/(\d+)\/(\d+)(?:\?.*)?$/i;

function parseMessageLink(value: string): {
  guildId: string;
  channelId: string;
  messageId: string;
} | null {
  const match = value.trim().match(messageLinkPattern);

  if (!match) {
    return null;
  }

  return {
    guildId: match[1],
    channelId: match[2],
    messageId: match[3],
  };
}

export const syncReactionsCommand = {
  data: new SlashCommandBuilder()
    .setName("sync-reactions")
    .setDescription("募集メッセージのリアクションから参加者を登録します")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("募集メッセージのリンク")
        .setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const guildId = interaction.guildId;

    if (!guildId) {
      await replyError(interaction, "このコマンドはDiscordサーバー内でのみ使用できます。");
      return;
    }

    if (!isRegistrationOpen(guildId)) {
      await replyError(interaction, "現在、参加登録を受け付けていません。先に /open を実行してください。");
      return;
    }

    const parsed = parseMessageLink(interaction.options.getString("message", true));

    if (!parsed) {
      await replyError(
        interaction,
        "Discordのメッセージリンクを入力してください。例: https://discord.com/channels/サーバーID/チャンネルID/メッセージID",
      );
      return;
    }

    if (parsed.guildId !== guildId) {
      await replyError(interaction, "このサーバーのメッセージリンクを指定してください。");
      return;
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      const channel = await interaction.client.channels.fetch(parsed.channelId);

      if (!channel?.isTextBased() || !("messages" in channel)) {
        await interaction.editReply("メッセージを取得できるテキストチャンネルではありません。");
        return;
      }

      const message = await channel.messages.fetch(parsed.messageId);
      const participantIds = new Set<string>();

      for (const reaction of message.reactions.cache.values()) {
        const users = await reaction.users.fetch();

        for (const user of users.values()) {
          if (!user.bot) {
            participantIds.add(user.id);
          }
        }
      }

      let addedCount = 0;
      let skippedCount = 0;

      for (const userId of participantIds) {
        try {
          const member = await interaction.guild!.members.fetch(userId);
          const joined = joinParticipant(guildId, {
            id: userId,
            displayName: member.displayName,
            rank: null,
          });

          if (joined) {
            addedCount += 1;
          } else {
            skippedCount += 1;
          }
        } catch {
          skippedCount += 1;
        }
      }

      await interaction.editReply(
        `リアクションから${addedCount}人を参加登録しました。` +
          (skippedCount > 0 ? `（${skippedCount}人は登録済み、またはサーバーから退出済みです）` : ""),
      );
    } catch (error) {
      console.error("リアクションの同期に失敗しました:", error);
      await interaction.editReply(
        "メッセージを取得できませんでした。Botがチャンネルを閲覧できるか、リンクが正しいか確認してください。",
      );
    }
  },
};