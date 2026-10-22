@ECHO OFF
cls && cd /d "%~dp0"

start git-bash.exe --cd=.. -c "git add . && git commit --amend --no-edit && git push -f ; echo -e '\nPress [ENTER] to continue.' ; read"
