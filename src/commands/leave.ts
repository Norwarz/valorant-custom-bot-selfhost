import { 
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandBuilder,
} from "discord.js";
import { getParticipantCount, leaveMatch } from "../match-state.js";

export const leaveCommand = { 
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("カスタムマッチの参加を取り消します"),

    async execute(interaction: ChatInputCommandInteraction) { 
        const participant = leaveMatch(interaction.user.id);
        if (!participant) { 
            await interaction.reply({ content: "参加登録していません", flags: MessageFlags.Ephemeral });
            return;
        }

        await interaction.reply(
            `${participant.displayName} さんが参加を取り消しました。 現在 ${getParticipantCount()} 人です。`,
        );
    }
}
