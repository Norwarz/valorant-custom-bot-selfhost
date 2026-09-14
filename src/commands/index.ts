// コマンドをここで管理
import { joinCommand } from "./join.js";
import { pingCommand } from "./ping.js";
import { participantsCommand } from "./participants.js";

export const commands = [joinCommand, pingCommand, participantsCommand];