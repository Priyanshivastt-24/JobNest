@echo off
setlocal

rem Check if mvn is available on PATH
where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    mvn %*
    exit /b %ERRORLEVEL%
)

rem Fallback to IntelliJ bundled Maven if present
set "IDEA_MAVEN=C:\Program Files\JetBrains\IntelliJ IDEA 2026.2.1\plugins\maven-plugin\lib\maven3\bin\mvn.cmd"
if exist "%IDEA_MAVEN%" (
    call "%IDEA_MAVEN%" %*
    exit /b %ERRORLEVEL%
)

echo [ERROR] Maven not found. Please install Apache Maven or open this project in IntelliJ IDEA / Eclipse.
exit /b 1
