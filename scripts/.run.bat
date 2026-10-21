@ECHO OFF
cls && cd /d "%~dp0"

start git-bash.exe -c "../.bash transpileAndWatch"
start git-bash.exe -c "../.bash run"
