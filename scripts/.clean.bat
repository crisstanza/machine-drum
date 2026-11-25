@ECHO OFF
cls && cd /d "%~dp0"

start git-bash.exe -c "../.bash clean ; echo Press [ENTER] to continue. ; read"
