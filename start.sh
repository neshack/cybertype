#!/usr/bin/env sh
# CyberType launcher for Linux and macOS.
set -eu

cd "$(dirname "$0")"

if command -v python3 >/dev/null 2>&1; then
  exec python3 serve.py "$@"
fi

if command -v python >/dev/null 2>&1; then
  exec python serve.py "$@"
fi

if command -v xdg-open >/dev/null 2>&1; then
  exec xdg-open index.html
fi

if command -v open >/dev/null 2>&1; then
  exec open index.html
fi

printf '%s\n' "No se encontró Python ni un abridor de navegador. Abre index.html manualmente."
