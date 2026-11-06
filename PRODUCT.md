# CyberType — Product truth

## What it is

CyberType is an offline typing tutor for Spanish-speaking primary and secondary school students. It runs entirely in the browser, stores progress on the local device, and needs no account, server, or internet connection.

The same product has two learning atmospheres:

- **Aula** — a warm, calm, tactile interface for primary school.
- **Arcade** — a dark, high-contrast training interface for secondary school.

The atmosphere changes the visual treatment and sound character. The learning model stays the same.

## Who it is for

- **Students (8–16 years old)** learning touch typing in Spanish, often on shared school netbooks.
- **Teachers** who need a resource that can be copied to a folder, a USB stick, or a local server and used without installing anything.
- **Families** who want a low-friction practice tool on a Windows or Linux computer.

## The job

A student should be able to:

1. Understand within seconds which key to press and which finger to use.
2. Practice short, achievable exercises with immediate visual, audio, and voice feedback.
3. See speed, accuracy, streak, points, and stars without the metrics getting in the way.
4. Finish an exercise and know exactly what to do next.

A teacher should be able to open the app, hand the keyboard to a student, and reset progress without reading a manual.

## Product constraints

- **Offline first.** No CDN, no remote fonts, no analytics, no network request required at runtime.
- **Portable.** A single-file build must work by double-clicking on Windows and Linux.
- **Low-friction.** No install, no account, no permission prompts, no build step for the person using it.
- **Local-only progress.** `localStorage` is the only persistence; there is no student data on a server.
- **Keyboard-first, touch-capable.** Physical keyboard is the primary input; the on-screen keyboard must allow uppercase letters and punctuation on touch devices.
- **Accessible.** Keyboard navigation, visible focus, semantic dialogs, live feedback, reduced motion, and WCAG AA contrast in both themes.
- **Low-end friendly.** The app must stay usable on 1024×600 school netbooks and at 360 px browser widths.

## Learning model

Five levels, three exercises each:

1. Home row (guide row).
2. Top row.
3. Bottom row.
4. Sentences and capital letters.
5. Audio dictation.

Stars are awarded per exercise from accuracy (3 stars at 95 %+, 2 at 85 %+, otherwise 1). The best result per level is kept. The combo multiplier adds points while the streak is alive.

## Success signals

- A first-time student starts typing without asking for help.
- The next key and the recommended finger are always obvious.
- The app is fully usable with the network cable unplugged.
- Both themes pass contrast and keyboard checks.
- A teacher can reset a student's progress in two clicks, with a confirmation.

## Non-goals (for this version)

- User accounts, cloud sync, or a teacher dashboard.
- Accent/dead-key drills. The content avoids words that need accents, and accent support is documented as a future improvement.
- Native `.exe`/AppImage packaging. The portable single-file build is the native-feeling distribution; Electron/Tauri packaging is a separate future step.
- Advertising, tracking, or any third-party runtime dependency.

## Assumptions

- School computers have a modern Chromium, Firefox, or Safari-based browser (2023 or newer).
- A physical keyboard is available for the main learning experience.
- The app may be served from `file://` or from a local HTTP server. The local server is optional; the single-file build is the fallback.
- Progress is per browser profile, not per student. Shared devices need the reset action between students.
