import { 
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandBuilder,
} from "discord.js";
import {
  getParticipantCount,
  getParticipants,
  isRegistrationOpen,
} from "../match-state.js";

export const participantsCommand = {
    data: new SlashCommandBuilder()
        .setName("participants")
        .setDescription("現在の参加者を表示します"),

    async execute(interaction: ChatInputCommandInteraction) { 
        const guildId = interaction.guildId;

        if (!guildId) {
            await interaction.reply({
                content: "このコマンドはDiscordサーバー内でのみ使用できます。",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }
        const status = isRegistrationOpen(guildId) ? "受付中" : "締切";
        const participants = getParticipants(guildId);
        if (participants.length === 0) {
            await interaction.reply(
                `参加受付: **${status}**\n現在、参加者はいません。`,
            );
            return;
        }
        const participantList = participants.map((p, index) => 
            `${index + 1}. ${p.displayName}`).join("\n");
        await interaction.reply(
        `参加受付: **${status}**\n` +
            `**参加者一覧（${participants.length}人）**\n` +
            participantList,
        );    
    },
}