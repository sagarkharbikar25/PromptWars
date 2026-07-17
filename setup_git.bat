@echo off
echo Connecting StadiumGenie to remote Git repository...
git init
git remote remove origin >nul 2>&1
git remote add origin https://github.com/sagarkharbikar25/PromptWars.git
git branch -M main
git add .
git commit -m "Initialize StadiumGenie App - Fan Assistant & Ops Dashboard"
echo.
echo Pushing to GitHub (you may be prompted to authenticate)...
git push -u origin main
echo.
echo ===========================================
echo Git connection and initial commit completed!
echo ===========================================
pause
