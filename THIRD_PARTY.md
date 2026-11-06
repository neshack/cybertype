# Third-party notices

## Fonts

- **Fredoka** — Copyright 2021 The Fredoka Project Authors. SIL Open Font License 1.1. License text: `assets/fonts/OFL-Fredoka.txt`.
- **Nunito** — Copyright 2014 The Nunito Project Authors. SIL Open Font License 1.1. License text: `assets/fonts/OFL-Nunito.txt`.

Both WOFF2 files are subset to Latin and bundled locally. No Google Fonts request is made at runtime.

## Icons

The interface uses 24 px stroke SVG symbols authored for this project. Their geometry and stroke conventions follow the Lucide icon language (ISC license): <https://lucide.dev/license>.

ISC License (Lucide):

```text
Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT).
All other copyright (c) for Lucide are held by Lucide Contributors 2022.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

## Legacy implementation

`legacy/teclamagica-original.html` is the original single-file prototype preserved for reference. It used Tailwind via CDN. That dependency is not present in the current app, the build, or the service worker.

## Desktop and test tooling

- **Electron** (MIT) packages the desktop wrapper under `desktop/`.
- **electron-builder** (MIT) builds the Linux AppImage and Windows portable executable.
- **Playwright** (Apache-2.0) is a development-only test dependency.

These tools are not loaded by the web app at runtime. The portable `dist/CyberType.html` has no runtime dependencies.

## Browser APIs

- Web Audio API for synthesized key sounds.
- Web Speech API for the optional voice guide.
- `localStorage` for local progress.
- `<dialog>` for native modal behavior.

No analytics, cookies, remote fonts, CDNs, or third-party runtime packages are used by the web app.
