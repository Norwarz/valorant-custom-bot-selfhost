import { MessageFlags, type RepliableInteraction } from "discord.js";

export async function replyError(
  interaction: RepliableInteraction,
  content: string,
): Promise<void> {
  const message = {
    content,
    flags: MessageFlags.Ephemeral as const,
  };

  if (interaction.replied || interaction.deferred) {
    await interaction.followUp(message);
  } else {
    await interaction.reply(message);
  }
}
