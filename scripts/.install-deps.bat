@ECHO OFF
cls && cd /d "%~dp0"

start git-bash.exe -c "../.bash installDeps ; echo Press [ENTER] to continue. ; read"
