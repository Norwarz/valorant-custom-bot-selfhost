// コマンドをここで管理
import { joinCommand } from "./join.js";
import { pingCommand } from "./ping.js";
import { participantsCommand } from "./participants.js";
import { leaveCommand } from "./leave.js";
import { resetCommand } from "./reset.js";
import { openCommand } from "./open.js";
import { closeCommand } from "./close.js";
import { teamCommand } from "./team.js";

export const commands = [
  joinCommand,
  pingCommand,
  participantsCommand,
  leaveCommand,
  resetCommand,
  openCommand,
  closeCommand,
  teamCommand,
];
