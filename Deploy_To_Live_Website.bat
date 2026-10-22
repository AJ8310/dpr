@echo off
title Deploying DPR to Official Website (dpr.vkfoundations.org)
color 0A
echo ======================================================================
echo    VK FOUNDATIONS - DEPLOY DPR APPLICATION TO LIVE WEBSITE
echo ======================================================================
echo.
echo Target Domain: https://dpr.vkfoundations.org
echo Firebase Project: dpr-frontend-badcf
echo.
cd /d "%~dp0\dpr-frontend"

echo [Step 1 of 3] Pulling latest code and pricing from GitHub main...
call git pull origin main
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Git pull encountered an issue or working directory has uncommitted changes.
)

echo.
echo [Step 2 of 3] Compiling optimized production build...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed! Please review the errors above.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [Step 3 of 3] Deploying to Firebase Hosting (dpr-frontend-badcf)...
call npx firebase-tools deploy --only hosting --project dpr-frontend-badcf
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Firebase deploy failed. If not logged in, please run: npx firebase-tools login
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ======================================================================
echo    DEPLOYMENT SUCCESSFUL!
echo.
echo    Please open https://dpr.vkfoundations.org and press Ctrl + F5
echo ======================================================================
echo.
pause
