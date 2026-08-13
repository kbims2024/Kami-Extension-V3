@echo off
setlocal
cd /d "%~dp0"

echo ======================================================
echo    GENERATION DE L'APK KAMI-EXT V3
echo ======================================================
echo.

:: 1. Preparation des fichiers Web
echo 1/3 - Preparation du projet Web...
if exist "src\app\api" (
    echo [INFO] Masquage temporaire du dossier API pour l'export statique...
    ren "src\app\api" "_api_hidden"
)

:: 2. Build Web
echo [INFO] Compilation Next.js...
call npm run static
if %errorlevel% neq 0 (
    echo.
    echo [ERREUR] La compilation Web a echoue.
    if exist "src\app\_api_hidden" ren "src\app\_api_hidden" "api"
    pause
    exit /b %errorlevel%
)

:: 3. Restauration API
if exist "src\app\_api_hidden" (
    echo [INFO] Restauration du dossier API...
    ren "src\app\_api_hidden" "api"
)

:: 4. Sync Capacitor
echo.
echo 2/3 - Synchronisation Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo.
    echo [ERREUR] La synchronisation Capacitor a echoue.
    pause
    exit /b %errorlevel%
)

:: 5. Build APK
echo.
echo 3/3 - Generation de l'APK...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo.
    echo [ERREUR] La generation de l'APK a echoue.
    cd ..
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo ======================================================
echo    TERMINE AVEC SUCCES !
echo.
echo    Votre APK est ici :
echo    android\app\build\outputs\apk\debug\Kami-Ext V3.apk
echo ======================================================
echo.
echo IMPORTANT : Desinstallez l'ancienne version avant d'installer celle-ci.
echo.
pause
endlocal