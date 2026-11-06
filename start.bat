@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>nul
if not errorlevel 1 (
  py -3 serve.py %*
  if not errorlevel 1 goto :eof
)

where python >nul 2>nul
if not errorlevel 1 (
  python serve.py %*
  if not errorlevel 1 goto :eof
)

start "" "index.html"
