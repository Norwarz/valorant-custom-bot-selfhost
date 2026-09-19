import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export function createHelpEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle("VALORANT Custom Match Bot - Help")
    .setColor(0x5865f2)
    .setDescription(
      "カスタムマッチの参加者管理、チーム分け、ロール決定を行います。",
    )
    .addFields(
      {
        name: "参加者管理",
        value: [
          "/open — 参加受付を開始",
          "/close — 参加受付を締切",
          "/join — カスタムマッチに参加",
          "/leave — 参加を取り消し",
          "/participants — 参加者一覧を表示",
          "/reset — 参加者を全員リセット",
        ].join("\n"),
      },
      {
        name: "ランク・チーム分け",
        value: [
          "/rank value:<ランク> — 自分のランクを登録",
          "/team random — ランダムにチーム分け",
          "/team rank — ランクを考慮してチーム分け",
          "/role random — 4ロールを考慮してロール決定",
          "/role free — 制約なしでロール決定",
        ].join("\n"),
      },
      {
        name: "マップ",
        value: "/map random — マップをランダムに選択",
      },
      {
        name: "基本的な流れ",
        value: [
          "1. /open で受付を開始",
          "2. /join または参加者パネルから参加",
          "3. 必要に応じて /rank でランク登録",
          "4. /team random または /team rank を実行",
          "5. /role random または /role free を実行",
          "6. /map random でマップを選択",
        ].join("\n"),
      },
    )
    .setFooter({ text: "コマンドはDiscordサーバー内で使用してください。" });
}

export const helpCommand = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Botの使い方を表示します"),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply({
      embeds: [createHelpEmbed()],
    });
  },
};
