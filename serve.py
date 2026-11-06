#!/usr/bin/env python3
"""Small local server for CyberType.

The app is already usable by opening index.html. This server exists for the
service worker, consistent localStorage behavior, and a native-feeling launch.
"""

from __future__ import annotations

import argparse
import http.server
import os
import socketserver
import threading
import webbrowser
from pathlib import Path


class CyberTypeHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".webmanifest": "application/manifest+json",
        ".woff2": "font/woff2",
        ".svg": "image/svg+xml",
    }

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        super().end_headers()

    def log_message(self, format: str, *args: object) -> None:
        # Keep the launcher quiet; the browser console is the useful log.
        pass


class ReusableThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    allow_reuse_address = True
    daemon_threads = True


def find_server(start_port: int) -> ReusableThreadingHTTPServer:
    for port in range(start_port, start_port + 25):
        try:
            return ReusableThreadingHTTPServer(("127.0.0.1", port), CyberTypeHandler)
        except OSError:
            continue
    raise RuntimeError("No hay un puerto libre entre %d y %d." % (start_port, start_port + 24))


def main() -> None:
    parser = argparse.ArgumentParser(description="Servidor local de CyberType")
    parser.add_argument("--port", type=int, default=8000, help="puerto inicial (default: 8000)")
    parser.add_argument("--no-browser", action="store_true", help="no abrir el navegador")
    args = parser.parse_args()

    root = Path(__file__).resolve().parent
    os.chdir(root)
    server = find_server(args.port)
    port = server.server_address[1]
    url = "http://127.0.0.1:%d/" % port

    print("CyberType listo en %s" % url)
    print("Cierra esta ventana o pulsa Ctrl+C para detenerlo.")

    if not args.no_browser:
        threading.Timer(0.6, lambda: webbrowser.open(url)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
