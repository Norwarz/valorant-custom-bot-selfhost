import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    MessageFlags
} from "discord.js";
import { getParticipantCount, joinMatch } from "../match-state.js";

export const joinCommand = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("カスタムマッチに参加します"),
    async execute(interaction: ChatInputCommandInteraction) {
        const displayName = interaction.user.globalName ?? interaction.user.username;
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