@echo off
echo Installing npm dependencies for StadiumGenie...
call npm install
echo.
echo Starting Next.js development server...
echo Access the app at http://localhost:3000
call npm run dev
pause
