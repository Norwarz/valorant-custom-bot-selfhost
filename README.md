# VALORANT Custom Match Bot

VALORANTカスタムマッチ運営用のDiscord Botです。Riot Gamesの素材を利用しており、Riot Gamesの「Legal Jibber Jabber」ポリシーに基づいて作成しています。Riot Gamesによる推奨・後援を受けたものではありません。

## 開発者向け

- `npm run dev` — TypeScriptの開発モードで起動
- `npm run build` — `dist/`へ本番用JavaScriptを生成
- `npm run init` — 開発用の初回設定
- `npm run register` — スラッシュコマンドを登録
- `npm start -- <command>` — ビルド済みCLIを実行（`init` / `register` / `start`）

開発環境では`.env`の`DISCORD_TOKEN`、`DISCORD_CLIENT_ID`、`DISCORD_GUILD_ID`を使用します。

## セルフホスト利用者向け

インストーラーを実行後、スタートメニューの「Valorant Custom Bot」→「コマンドラインを開く」から操作します。

```text
vbot init      初回設定・設定の変更
vbot register  スラッシュコマンド登録
vbot start     Bot起動
vbot help      ヘルプ表示
```

開発者がソースから利用する場合は、Node.jsをインストールして `npm run build` を実行した後、`npm start -- init`、`npm start -- register`、`npm start -- start` のように実行できます。

設定ファイルとSQLiteデータベースは `%APPDATA%\ValorantCustomBot\` に保存されます。Bot Tokenを含む設定ファイルは他人に共有しないでください。

停止するには起動中のコンソールで`Ctrl+C`を押します。Botを使う間は、起動したPCとコンソールを動作させておく必要があります。
## Setup.exeを作成する場合

開発者はInno Setupをインストールしたうえで、リポジトリ直下から `npm run package:windows` を実行します。配布用ペイロードが `release/payload` に作成されたら、Inno Setup Compilerで `installer/ValorantCustomBot.iss` をコンパイルします。生成物は `release/ValorantCustomBot-Setup-1.0.0.exe` です。

配布パッケージには、作成環境にインストール済みのNode.js実行ファイルが同梱されます。SQLiteデータと設定はユーザーの `%APPDATA%` に置くため、通常のアンインストールでは保持されます。