import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    MessageFlags
} from "discord.js";
import { getParticipantCount, joinMatch, isRegistrationOpen } from "../match-state.js";

export const joinCommand = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("カスタムマッチに参加します"),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!isRegistrationOpen()) {
            await interaction.reply({ content: "現在、参加登録は受け付けていません。", flags: MessageFlags.Ephemeral });
            return;
        }
        const member = interaction.member;

        // サーバーのメンバー情報が取得できる場合は displayName を使用し、取得できない場合はユーザー名を使用する
        const displayName =
        member && "displayName" in member
            ? member.displayName
            : member?.nick ?? interaction.user.globalName ?? interaction.user.username;

        const joined = joinMatch( { id: interaction.user.id, displayName});

        if (!joined) {
            await interaction.reply( { content: "すでに参加しています",  flags: MessageFlags.Ephemeral });
            return;
        }

        await interaction.reply(
            `${displayName} さんが参加しました！ 現在 ${getParticipantCount()} 人です。`,
        );
    }
};