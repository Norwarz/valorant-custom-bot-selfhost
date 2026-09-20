import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, isAbsolute, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

type ConfigFile = {
  discordToken?: string;
  discordClientId?: string;
  discordGuildId?: string;
  dataDirectory?: string;
  assetsDirectory?: string;
};

const currentDirectory = dirname(fileURLToPath(import.meta.url));
export const applicationDirectory = resolve(currentDirectory, "..");

// 開発時は.envを読み込み、配布版ではユーザーデータ配下のconfig.jsonを読み込む。
dotenv.config();
const isDistExecution = currentDirectory.endsWith(`${sep}dist`) || currentDirectory.endsWith("/dist");
export const isProduction = process.env.NODE_ENV === "production" || isDistExecution;

const defaultConfigDirectory = join(
  process.env.APPDATA ?? join(homedir(), "AppData", "Roaming"),
  "ValorantCustomBot",
);
export const configDirectory = resolve(
  process.env.VALORANT_BOT_CONFIG_DIR ?? (isProduction ? defaultConfigDirectory : applicationDirectory),
);
export const userConfigDirectory = resolve(
  process.env.VALORANT_BOT_CONFIG_DIR ?? defaultConfigDirectory,
);
export const userConfigFilePath = join(userConfigDirectory, "config.json");
const configFilePath = join(configDirectory, "config.json");

function readConfigFile(): ConfigFile {
  if (!existsSync(configFilePath)) return {};

  try {
    return JSON.parse(readFileSync(configFilePath, "utf8")) as ConfigFile;
  } catch (error) {
    throw new Error(`設定ファイルを読み込めません: ${configFilePath}`, { cause: error });
  }
}

const fileConfig = readConfigFile();
const value = (environmentValue: string | undefined, fileValue: string | undefined) =>
  environmentValue?.trim() || fileValue?.trim();

function resolveConfiguredPath(valueToResolve: string | undefined, fallback: string) {
  if (!valueToResolve) return fallback;
  return isAbsolute(valueToResolve) ? valueToResolve : resolve(configDirectory, valueToResolve);
}

export const botConfig = {
  discordToken: value(process.env.DISCORD_TOKEN, fileConfig.discordToken),
  discordClientId: value(process.env.DISCORD_CLIENT_ID, fileConfig.discordClientId),
  discordGuildId: value(process.env.DISCORD_GUILD_ID, fileConfig.discordGuildId),
  dataDirectory: resolveConfiguredPath(
    process.env.VALORANT_BOT_DATA_DIR ?? fileConfig.dataDirectory,
    isProduction ? configDirectory : join(applicationDirectory, "data"),
  ),
  assetsDirectory: resolveConfiguredPath(
    process.env.VALORANT_BOT_ASSETS_DIR ?? fileConfig.assetsDirectory,
    join(applicationDirectory, "assets"),
  ),
  configDirectory,
  configFilePath,
  isProduction,
} as const;

export function requireBotToken() {
  if (!botConfig.discordToken) {
    throw new Error(
      `DISCORD_TOKENが設定されていません。開発時は.env、配布版は${configFilePath}を設定してください。`,
    );
  }
  return botConfig.discordToken;
}

export function requireCommandRegistrationConfig() {
  const { discordClientId, discordGuildId } = botConfig;
  if (!discordClientId || !discordGuildId) {
    throw new Error(
      `DISCORD_CLIENT_IDとDISCORD_GUILD_IDが設定されていません。設定ファイル: ${configFilePath}`,
    );
  }
  return { discordClientId, discordGuildId };
}

export function assetPath(...parts: string[]) {
  return join(botConfig.assetsDirectory, ...parts);
}


