// コマンドをここで管理
import { joinCommand } from "./join.js";
import { participantsCommand } from "./participants.js";
import { leaveCommand } from "./leave.js";
import { resetCommand } from "./reset.js";
import { openCommand } from "./open.js";
import { closeCommand } from "./close.js";
import { teamCommand } from "./team.js";
import { mapCommand } from "./map.js";
import { rankCommand } from "./rank.js";

export const commands = [
  joinCommand,
  participantsCommand,
  leaveCommand,
  resetCommand,
  openCommand,
  closeCommand,
  teamCommand,
  mapCommand,
  rankCommand,
];
