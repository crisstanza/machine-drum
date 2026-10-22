@ECHO OFF
cls && cd /d "%~dp0"

start git-bash.exe -c "../.bash build ; echo Press [ENTER] to continue. ; read"
