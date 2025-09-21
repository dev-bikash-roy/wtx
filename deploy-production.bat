@echo off
echo Deploying WTX News site to production...
echo.
echo Make sure you have Vercel CLI installed.
echo If not, install it by running: npm install -g vercel
echo.
echo Current directory: %cd%
echo.
echo Running build...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo Build failed. Please check the errors above.
    pause
    exit /b %errorlevel%
)
echo.
echo Build completed successfully!
echo.
echo Deploying to Vercel production...
echo.
echo Please run the following command manually:
echo vercel --prod
echo.
pause