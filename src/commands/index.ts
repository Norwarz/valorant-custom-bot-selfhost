import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { joinCommand } from "./join.js";
import { participantsCommand } from "./participants.js";
import { leaveCommand } from "./leave.js";
import { resetCommand } from "./reset.js";
import { openCommand } from "./open.js";
import { closeCommand } from "./close.js";
import { teamCommand } from "./team.js";
import { mapCommand } from "./map.js";
import { rankCommand } from "./rank.js";
import { roleCommand } from "./role.js";
import { helpCommand } from "./help.js";

export type BotCommand = {
  data:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
};

export const commands: BotCommand[] = [
  joinCommand,
  participantsCommand,
  leaveCommand,
  resetCommand,
  openCommand,
  closeCommand,
  teamCommand,
  mapCommand,
  rankCommand,
  roleCommand,
  helpCommand,
];
