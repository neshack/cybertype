# CyberType — Product truth

## What it is

CyberType is an offline typing tutor for **Mexican Spanish** students in primary and secondary school. It runs in the browser or as an Electron desktop app, stores progress on the local device, and needs no account, server, or internet connection.

The same product has two learning atmospheres:

- **Aula** — a warm, calm, tactile interface.
- **Arcade** — a dark, high-contrast training interface.

The atmosphere changes the visual treatment and sound character. The learning model stays the same.

## Who it is for

- **Students (8–16 years old)** learning touch typing in Mexican Spanish, often on shared school netbooks.
- **Teachers** who need a resource that can be copied to a folder, a USB stick, or a local server and used without installing anything.
- **Families** who want a low-friction practice tool on a Windows or Linux computer.

## The job

A student should be able to:

1. Understand within seconds which key to press and which finger to use.
2. Practice short, achievable exercises with immediate visual, audio, and voice feedback.
3. See speed, accuracy, streak, points, and stars without the metrics getting in the way.
4. Finish an exercise and know exactly what to do next.
5. Practice Spanish accents with the dead acute key and a dedicated level.
6. Understand what the non-typing keys do: Space, Enter, Backspace, Supr, Shift, Bloq Mayús, Tab, Ctrl, Alt, Esc, arrows, Windows/Command and F1–F12.

A teacher should be able to open the app, hand the keyboard to a student, adjust sound/voice, and reset progress without reading a manual.

## Product constraints

- **Offline first.** No CDN, no remote fonts, no analytics, no network request required at runtime.
- **Portable.** A single-file build must work by double-clicking on Windows and Linux.
- **Desktop focus, responsive fallback.** The interface is designed for 1024×600 and larger desktop/netbook screens; it still adapts down to 360 px.
- **Mexican Spanish only.** Interface, keyboard labels, exercises, speech language, and content use `es-MX`. There is no Spanish-from-Spain or English mode.
- **Local-only progress.** `localStorage` (or Electron's local storage) is the only persistence; there is no student data on a server.
- **Keyboard-first, touch-capable.** Physical keyboard is the primary input; the on-screen keyboard must allow uppercase letters, the dead acute key, and accents on touch devices.
- **Accessible.** Keyboard navigation, visible focus, semantic dialogs, live feedback, reduced motion, and WCAG AA contrast in both themes.
- **Low-end friendly.** The app must stay usable on 1024×600 school netbooks and at 360 px browser widths when needed.

## Learning model

Six levels, four exercises each:

1. Home row (guide row).
2. Top row.
3. Bottom row.
4. Sentences and capital letters.
5. Audio dictation.
6. Accents (á, é, í, ó, ú) with the dead acute key.

Stars are awarded per exercise from accuracy (3 stars at 95 %+, 2 at 85 %+, otherwise 1). The best result per level is kept. The combo multiplier adds points while the streak is alive.

## Interface model

- The practice card and keyboard are the main stage. Tico sits in a dedicated right-side coach panel; it is not a navigation rail and collapses below the practice card on narrow screens.
- The learning path is a **hidden dialog** opened from the **Ruta** button in the header.
- Settings are a **dialog** opened from the gear button in the header: sound, voice selection, voice test, and progress reset.
- Tico lives in a **right-side coach panel** next to the practice card on desktop; on narrow screens it becomes a compact row below the practice card. The practice card keeps the prompt, cues and metrics; the mascot no longer sits inside the instructions.
- The learning path also contains a **Guía de teclas** card that opens an interactive lab built on the same on-screen keyboard.
- The keyboard includes a dead acute key (`´`) that works as a two-step accent input on screen; physical keyboards use the system dead-key composition.

## Key guide

The guide is not a starred level; it is a reference lesson. It shows the same keyboard used for practice, with every key as a button:

- Tapping a key opens a detail screen with its name, purpose, the finger that presses it and an example.
- If a Latin American voice is available, the explanation is spoken automatically; the **Escuchar** button repeats it.
- A second row adds the keys that are not drawn on the practice keyboard: Enter, Backspace, Supr, Ctrl, Alt, Esc, arrows, Windows/Command and F1–F12.
- The selected key stays outlined in the keyboard so the student can connect the explanation with the layout.
- The guide does not alter stars or progress.

## Voice

- The app prefers a **Latin American female** voice, based on language tags and conservative voice-name heuristics.
- `es-MX` is preferred first, then `es-US`, `es-419`, and other Latin American variants; Spain Spanish is a fallback, not the default.
- Only Latin American Spanish voices are offered. Spain Spanish is not an option.
- The teacher can choose any available Latin American voice and test it. If no Latin American voice exists, the settings dialog says so and the voice guide is disabled.
- Pitch and rate are tuned for a friendly, youthful tone, but the actual timbre depends on the operating system.

## Desktop packaging

An Electron wrapper is included in `desktop/` and loads the self-contained `dist/CyberType.html`.

- Linux AppImage and Windows portable executable are built by GitHub Actions.
- The pipeline supports signing via `CSC_LINK` and `CSC_KEY_PASSWORD`, but no certificate is included; unsigned builds work with platform warnings.
- The wrapper keeps `nodeIntegration: false` and `sandbox: true`, and blocks external navigation.

## Success signals

- A first-time student starts typing without asking for help.
- The next key and the recommended finger are always obvious.
- The app is fully usable with the network cable unplugged.
- Both themes pass contrast and keyboard checks.
- A teacher can reset a student's progress in two clicks, with a confirmation.
- Accented words can be completed with both the physical dead key and the on-screen accent key.

## Non-goals (for this version)

- User accounts, cloud sync, or a teacher dashboard.
- Advertising, tracking, or any third-party runtime dependency.
- Signed binaries without a user-provided code-signing certificate.
- Automatic gender detection for voices; the voice heuristic is a convenience, not a guarantee.

## Assumptions

- School computers have a modern Chromium, Firefox, or Safari-based browser (2023 or newer).
- A physical keyboard is available for the main learning experience.
- The app may be served from `file://`, a local HTTP server, or Electron. The portable HTML and Electron builds are the zero-install/folder distributions.
- Progress is per browser profile or Electron profile, not per student. Shared devices need the reset action between students.
