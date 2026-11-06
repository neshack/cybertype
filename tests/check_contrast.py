#!/usr/bin/env python3
"""WCAG contrast audit for the two CyberType themes."""

from __future__ import annotations

import sys


def hex_to_rgb(value: str) -> tuple[float, float, float]:
    value = value.lstrip("#")
    if len(value) != 6:
        raise ValueError("Color no válido: %s" % value)
    return tuple(int(value[index:index + 2], 16) / 255 for index in (0, 2, 4))


def luminance(color: str) -> float:
    def channel(value: float) -> float:
        return value / 12.92 if value <= 0.04045 else ((value + 0.055) / 1.055) ** 2.4

    red, green, blue = (channel(value) for value in hex_to_rgb(color))
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue


def contrast(foreground: str, background: str) -> float:
    lighter = max(luminance(foreground), luminance(background))
    darker = min(luminance(foreground), luminance(background))
    return (lighter + 0.05) / (darker + 0.05)


THEMES = {
    "aula": {
        "bg": "#f4efe6",
        "surface": "#fffcf6",
        "surface-2": "#f7f1e5",
        "surface-3": "#efe7d8",
        "ink": "#1e1b32",
        "ink-soft": "#4e4863",
        "ink-muted": "#6b6478",
        "primary": "#4f46e5",
        "primary-soft": "#e5e7ff",
        "on-primary": "#ffffff",
        "accent": "#c2410c",
        "accent-soft": "#ffedd5",
        "success": "#15803d",
        "success-soft": "#dcfce7",
        "on-success": "#ffffff",
        "danger": "#b91c1c",
        "danger-soft": "#fee2e2",
        "on-danger": "#ffffff",
        "focus": "#4f46e5",
        "key-text": "#1f2937",
        "key-pinky": "#fce7f3",
        "key-ring": "#dbeafe",
        "key-middle": "#ccfbf1",
        "key-index-l": "#ffedd5",
        "key-index-r": "#fef3c7",
        "key-thumb": "#cffafe",
    },
    "arcade": {
        "bg": "#080b14",
        "surface": "#111827",
        "surface-2": "#172033",
        "surface-3": "#1e2a42",
        "ink": "#f8fafc",
        "ink-soft": "#c9d4e5",
        "ink-muted": "#9aa8be",
        "primary": "#22d3ee",
        "primary-soft": "#083344",
        "on-primary": "#052a33",
        "accent": "#fbbf24",
        "accent-soft": "#3a2e05",
        "success": "#4ade80",
        "success-soft": "#052e16",
        "on-success": "#052e16",
        "danger": "#fb7185",
        "danger-soft": "#3f0d1a",
        "on-danger": "#2a0a12",
        "focus": "#fbbf24",
        "key-text": "#f8fafc",
        "key-pinky": "#3b1a2e",
        "key-ring": "#172554",
        "key-middle": "#042f2e",
        "key-index-l": "#3a1d0b",
        "key-index-r": "#3a2e05",
        "key-thumb": "#083344",
    },
}

PAIRS = [
    ("ink", "bg", 4.5),
    ("ink", "surface", 4.5),
    ("ink", "surface-2", 4.5),
    ("ink", "primary-soft", 4.5),
    ("ink-soft", "surface", 4.5),
    ("ink-soft", "surface-2", 4.5),
    ("ink-muted", "surface", 4.5),
    ("ink-muted", "surface-2", 4.5),
    ("ink-muted", "bg", 4.5),
    ("on-primary", "primary", 4.5),
    ("accent", "accent-soft", 4.5),
    ("accent", "surface", 3.0),
    ("success", "success-soft", 3.0),
    ("on-success", "success", 4.5),
    ("danger", "danger-soft", 4.5),
    ("on-danger", "danger", 4.5),
    ("primary", "surface-2", 4.5),
    ("focus", "surface", 3.0),
    ("key-text", "key-pinky", 4.5),
    ("key-text", "key-ring", 4.5),
    ("key-text", "key-middle", 4.5),
    ("key-text", "key-index-l", 4.5),
    ("key-text", "key-index-r", 4.5),
    ("key-text", "key-thumb", 4.5),
]


def main() -> int:
    failures = 0

    for theme_name, tokens in THEMES.items():
        print("Tema %s" % theme_name)
        for foreground, background, threshold in PAIRS:
            ratio = contrast(tokens[foreground], tokens[background])
            status = "OK" if ratio >= threshold else "FAIL"
            if status == "FAIL":
                failures += 1
            print("  %-4s %-14s sobre %-14s %5.2f:1 (mínimo %.1f:1)" % (
                status, foreground, background, ratio, threshold
            ))

    if failures:
        print("\nCONTRAST CHECK: FAIL (%d pares)" % failures)
        return 1

    print("\nCONTRAST CHECK: OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
