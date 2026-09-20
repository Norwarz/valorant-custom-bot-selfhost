const action = process.argv[2]?.toLowerCase();

const entrypoints: Record<string, string> = {
  init: "./configure.js",
  register: "./register-commands.js",
  start: "./index.js",
};

if (action === "help" || action === undefined) {
  console.log(`Valorant Custom Bot\n\n使い方: vbot <command>\n\n  init      初回設定・設定の変更\n  register  スラッシュコマンド登録\n  start     Bot起動\n  help      ヘルプ表示`);
  process.exitCode = action ? 0 : 1;
} else if (!entrypoints[action]) {
  console.error(`不明なコマンドです: ${action}`);
  console.error("vbot help で使い方を確認してください。");
  process.exitCode = 1;
} else {
  await import(entrypoints[action]);
}