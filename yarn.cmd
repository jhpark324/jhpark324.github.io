@echo off
setlocal
set "SCRIPT_DIR=%~dp0"
if "%PWD%"=="" set "PWD=%CD%"
node "%SCRIPT_DIR%.yarn\releases\yarn-3.6.1.cjs" %*
endlocal
