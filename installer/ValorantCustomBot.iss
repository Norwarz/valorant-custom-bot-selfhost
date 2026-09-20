#define AppName "Valorant Custom Bot"
#define AppVersion "1.0.0"
#define AppPublisher "Valorant Custom Bot"

[Setup]
AppId={{C454B8A2-4FC6-4C0D-A470-C826D9A36725}
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher={#AppPublisher}
DefaultDirName={localappdata}\Programs\ValorantCustomBot
DefaultGroupName={#AppName}
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64
OutputDir=..\release
OutputBaseFilename=ValorantCustomBot-Setup-{#AppVersion}
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
Uninstallable=yes

[Tasks]
Name: "desktopicon"; Description: "デスクトップにコマンドラインのショートカットを作成する"; GroupDescription: "追加オプション:"; Flags: unchecked

[Files]
Source: "..\release\payload\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{autoprograms}\{#AppName}\コマンドラインを開く"; Filename: "{app}\vbot.cmd"; Parameters: "shell"; WorkingDir: "{app}"
Name: "{autodesktop}\{#AppName}"; Filename: "{app}\vbot.cmd"; Parameters: "shell"; WorkingDir: "{app}"; Tasks: desktopicon

[Run]
Filename: "{app}\vbot.cmd"; Parameters: "init"; Description: "初回セットアップを起動する"; Flags: postinstall shellexec skipifsilent; Check: not FileExists(ExpandConstant('{userappdata}\ValorantCustomBot\config.json'))
