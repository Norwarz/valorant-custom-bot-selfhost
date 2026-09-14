import { 
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import { getParticipants } from "../match-state.js";

export const participantsCommand = {
    data: new SlashCommandBuilder()
        .setName("participants")
        .setDescription("現在の参加者を表示します"),

    async execute(interaction: ChatInputCommandInteraction) { 
        const participants = getParticipants();
        if (participants.length === 0) { 
            await interaction.reply("現在、参加者はいません。");
            return;
        }
        const participantList = participants.map((p, index) => 
            `${index + 1}. ${p.displayName}`).join("\n");
        await interaction.reply(`**参加者一覧（${participants.length}人）**\n${participantList}`);
    },
}