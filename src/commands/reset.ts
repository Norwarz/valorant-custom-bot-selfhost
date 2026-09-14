import {
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import { clearMatch } from "../match-state.js";

export const resetCommand = {
    data: new SlashCommandBuilder()
        .setName("reset")
        .setDescription("カスタムマッチの参加者をリセットします"),

    async execute(interaction: ChatInputCommandInteraction) { 
        const canReset = interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild);
        if (!canReset) {
            await interaction.reply({ content: "このコマンドを実行する権限がありません。", flags: MessageFlags.Ephemeral });
            return;
        }

        const clearedCount = clearMatch();
        await interaction.reply({ content: `参加者を ${clearedCount} 人削除しました。`, flags: MessageFlags.Ephemeral });
    }
}