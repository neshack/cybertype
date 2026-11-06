#!/usr/bin/env python3
"""Build dist/CyberType.html as a truly self-contained offline file.

Only Python's standard library is used. The source stays maintainable in
index.html + assets/, while the generated file can be copied to a USB stick,
a Windows desktop, or a Linux school computer and opened with a double click.
"""

from __future__ import annotations

import base64
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DIST = ROOT / "dist"
OUTPUT = DIST / "CyberType.html"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def data_uri(path: Path, mime: str) -> str:
    payload = base64.b64encode(path.read_bytes()).decode("ascii")
    return "data:%s;base64,%s" % (mime, payload)


def inline_fonts(css: str) -> str:
    font_pattern = re.compile(r"url\(['\"]?\.\./fonts/([^'\")]+)['\"]?\)")

    def replace(match: re.Match[str]) -> str:
        filename = match.group(1)
        path = ROOT / "assets" / "fonts" / filename
        if not path.exists():
            raise FileNotFoundError("No existe la fuente: %s" % path)
        return "url('%s')" % data_uri(path, "font/woff2")

    return font_pattern.sub(replace, css)


def main() -> None:
    html = read_text(ROOT / "index.html")
    css = inline_fonts(read_text(ROOT / "assets" / "css" / "app.css"))
    js = read_text(ROOT / "assets" / "js" / "app.js")
    icon = data_uri(ROOT / "assets" / "icons" / "icon.svg", "image/svg+xml")

    html = html.replace(
        '<link rel="stylesheet" href="assets/css/app.css">',
        "<style>\n%s\n</style>" % css,
    )
    html = html.replace(
        '<script src="assets/js/app.js" defer></script>',
        "",
    )
    # An inline script in <head> would run before the body exists. Place the
    # build's script at the end of the document, like a deferred source script.
    html = html.replace(
        "</body>",
        "<script>\n%s\n</script>\n</body>" % js,
    )

    html = re.sub(
        r"\n  <!-- build:remove:start -->.*?<!-- build:remove:end -->",
        "",
        html,
        flags=re.DOTALL,
    )
    html = re.sub(r'\n  <link rel="manifest"[^>]*>', "", html)
    html = re.sub(r'\n  <link rel="apple-touch-icon"[^>]*>', "", html)
    html = html.replace(
        '<link rel="icon" href="assets/icons/icon.svg" type="image/svg+xml">',
        '<link rel="icon" href="%s" type="image/svg+xml">' % icon,
    )

    DIST.mkdir(exist_ok=True)
    OUTPUT.write_text(html, encoding="utf-8")

    size_kb = OUTPUT.stat().st_size / 1024
    print("Generado: %s (%.1f KB)" % (OUTPUT, size_kb))
    print("Ábrelo con doble clic; no necesita servidor ni conexión.")


if __name__ == "__main__":
    main()
