import { mkdirSync, writeFileSync } from "node:fs";
import { emitKeypressEvents } from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import { botConfig, userConfigDirectory, userConfigFilePath } from "./config.js";

async function readHidden(prompt: string) {
  if (!input.isTTY || !input.setRawMode) {
    throw new Error("Bot Tokenを安全に入力するため、ターミナルから実行してください。");
  }

  output.write(prompt);
  emitKeypressEvents(input);
  input.setRawMode(true);
  input.resume();

  return new Promise<string>((resolve, reject) => {
    let value = "";
    const cleanup = () => {
      input.off("keypress", onKeypress);
      input.setRawMode(false);
      output.write("\n");
    };
    const onKeypress = (character: string, key: { name?: string; ctrl?: boolean }) => {
      if (key.ctrl && key.name === "c") {
        cleanup();
        reject(new Error("設定をキャンセルしました。"));
        return;
      }
      if (key.name === "return" || key.name === "enter") {
        cleanup();
        resolve(value);
        return;
      }
      if (key.name === "backspace") {
        value = value.slice(0, -1);
        return;
      }
      if (character && !key.ctrl && !key.name?.startsWith("arrow")) {
        value += character;
      }
    };
    input.on("keypress", onKeypress);
  });
}

const discordClientId = (await prompt("Discord Application ID: ")).trim();
const discordGuildId = (await prompt("対象サーバーID（ギルドID）: ")).trim();
const discordToken = (await readHidden("Discord Bot Token（入力内容は表示されません）: ")).trim();

if (!discordToken || !discordClientId || !discordGuildId) {
  throw new Error("3項目すべて入力してください。");
}

mkdirSync(userConfigDirectory, { recursive: true });
writeFileSync(
  userConfigFilePath,
  `${JSON.stringify({ discordToken, discordClientId, discordGuildId }, null, 2)}\n`,
  "utf8",
);
mkdirSync(botConfig.dataDirectory, { recursive: true });
console.log(`設定を保存しました: ${userConfigFilePath}`);

async function prompt(question: string) {
  const { createInterface } = await import("node:readline/promises");
  const readline = createInterface({ input, output });
  try {
    return await readline.question(question);
  } finally {
    readline.close();
  }
}