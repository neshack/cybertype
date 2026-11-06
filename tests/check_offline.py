#!/usr/bin/env python3
"""Fail when the app references a remote asset or a missing local file."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ALLOWED_HTTP = {
    "http://www.w3.org/2000/svg",
    "https://www.w3.org/2000/svg",
}
IGNORED_PREFIXES = ("data:", "mailto:", "tel:", "#", "javascript:")


def local_references(text: str) -> list[str]:
    references: list[str] = []
    for match in re.finditer(r'(?:src|href)=["\']([^"\']+)["\']', text):
        value = match.group(1).strip()
        if value.startswith(IGNORED_PREFIXES):
            continue
        references.append(value)
    return references


def check_html(path: Path, base: Path, allow_assets: bool = True) -> list[str]:
    errors: list[str] = []
    text = path.read_text(encoding="utf-8")

    for reference in local_references(text):
        if reference.startswith(("http://", "https://")):
            if reference not in ALLOWED_HTTP:
                errors.append("%s: referencia remota %s" % (path.name, reference))
            continue
        if not allow_assets and reference.startswith("assets/"):
            errors.append("%s: referencia a assets/ en el build de un solo archivo: %s" % (path.name, reference))
            continue
        target = (base / reference).resolve()
        if not target.exists():
            errors.append("%s: no existe %s" % (path.name, reference))

    if "cdn.tailwindcss.com" in text or "fonts.googleapis.com" in text:
        errors.append("%s: todavía contiene un CDN" % path.name)

    return errors


def check_css(path: Path) -> list[str]:
    errors: list[str] = []
    text = path.read_text(encoding="utf-8")
    for match in re.finditer(r"url\(['\"]?([^'\")]+)['\"]?\)", text):
        value = match.group(1).strip()
        if value.startswith(IGNORED_PREFIXES):
            continue
        if value.startswith(("http://", "https://")):
            errors.append("%s: recurso remoto %s" % (path.name, value))
            continue
        target = (path.parent / value).resolve()
        if not target.exists():
            errors.append("%s: no existe %s" % (path.name, value))
    return errors


def main() -> int:
    errors: list[str] = []
    errors.extend(check_html(ROOT / "index.html", ROOT))
    errors.extend(check_css(ROOT / "assets" / "css" / "app.css"))

    dist = ROOT / "dist" / "CyberType.html"
    if dist.exists():
        errors.extend(check_html(dist, dist.parent, allow_assets=False))
        dist_text = dist.read_text(encoding="utf-8")
        remote = [
            match.group(0)
            for match in re.finditer(r"(?:src|href)=[\"']https?://[^\"']+", dist_text)
            if "www.w3.org/2000/svg" not in match.group(0)
        ]
        errors.extend("dist/CyberType.html: referencia remota %s" % item for item in remote)
    else:
        errors.append("dist/CyberType.html no existe; ejecuta python3 build.py")

    if errors:
        print("OFFLINE CHECK: FAIL")
        for error in errors:
            print(" -", error)
        return 1

    print("OFFLINE CHECK: OK")
    print(" - index.html y CSS no usan recursos remotos")
    print(" - dist/CyberType.html no depende de assets/ ni de la red")
    return 0


if __name__ == "__main__":
    sys.exit(main())
