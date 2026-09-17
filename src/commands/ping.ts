import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const pingCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Botの応答速度を確認します。"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("Pong!");
  },
};
