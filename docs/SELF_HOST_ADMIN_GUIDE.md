# セルフホスト版 導入ガイド（サーバー管理者向け）

## はじめに

このBotは、導入する管理者が自分のDiscordアプリケーション／Botを用意して、そのPC上で動かすセルフホスト方式です。開発者のBot Tokenを受け取ったり、他人に渡したりしないでください。Bot Tokenはパスワードと同じ秘密情報です。

## 1. Discordアプリケーションを作成する

1. Discord Developer Portal(https://discord.com/developers/home)でアプリケーションを作成します。
2. アプリケーションの「Bot」ページでBotユーザーを作成し、Bot Tokenを取得します。TokenはこのPCの設定画面にだけ入力し、チャットや共有ファイルには貼らないでください。
3. OAuth2 URL Generatorで `bot` と `applications.commands` を選びます。
4. 必要なBot権限として、少なくとも `View Channels`、`Send Messages`、`Embed Links`、`Attach Files`、`Use External Emojis` を選択し、対象サーバーへBotを招待します。
5. ランク絵文字を使う場合、このBotを絵文字サーバーにも招待してください。招待には絵文字サーバー管理者の承認が必要です。

## 2. インストールと初期設定

1. `ValorantCustomBot-Setup-1.0.0.exe` を実行してインストールします。
2. 初回設定が開いたら、次を入力します。
   - Discord Application ID
   - Botを使う対象サーバーのID（Guild ID）
   - Bot Token（入力中は画面に表示されません）
3. 設定は `%APPDATA%\ValorantCustomBot\config.json`、参加者データは同フォルダのSQLiteデータベースに保存されます。設定ファイルは他人に共有しないでください。

## 3. スラッシュコマンド登録と起動

スタートメニューから「Valorant Custom Bot」→「コマンドラインを開く」を選びます。画面上部のヘルプを確認して、次を順に入力します。

```text
vbot register
vbot start
```

`register` は対象サーバーへスラッシュコマンドを登録します。`start` が実行中はBotがオンラインです。Botを使う間は、このPCと起動中のコンソールを動作させてください。停止するには `Ctrl+C` を押します。

## トラブルシューティング

- コマンド候補が出ない場合：Botが対象サーバーに参加しているか確認し、`vbot register` を実行してください。
- ランク絵文字が出ない場合：Botが絵文字サーバーにも参加していること、対象チャンネルで `Use External Emojis` が許可されていることを確認してください。
- 設定を変更する場合：`vbot init` を実行します。

## セキュリティと配布について

このインストーラーはコード署名されていません。Windows Smart App Controlがブロックする場合があります。
ブロックされた場合はWindows設定→「プライバシーとセキュリティ」→「Windowsセキュリティ」→「アプリとブラウザーの制御」→「スマートアプリコントロールの設定」→オフにすることで回避できます。
インストール後は再度オンにすることを推奨します（Botの動作に影響はしません）。
