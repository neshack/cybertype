# CyberType — Design system

## Direction

**A tactile school typing desk, not a dashboard.** The keyboard is the main object: chunky keycaps, a warm paper surface, a visible finger map and a coach that reacts to the student. Aula is the daylight version; Arcade is the same desk under a dark training lamp.

The product is an **Operate** surface. Expression lives in the keycaps, the mascot, the finger colors and the motion; it never hides the next key, the current character or the exit. The main stage is one column: practice card first, keyboard and hands second. The learning path and settings live in dialogs so they do not compete with the task.

The generated `design-system/cybertype/MASTER.md` is input, not the runtime contract. Fredoka/Nunito are self-hosted, the theme is selected with `data-theme`, and Arcade is an intentional product mode.

## Color

### Aula

| Role | Token | Value |
| --- | --- | --- |
| Background | `--bg` | `#F4EFE6` |
| Raised background | `--bg-2` | `#EAE1D0` |
| Surface | `--surface` | `#FFFCF6` |
| Secondary surface | `--surface-2` | `#F7F1E5` |
| Ink | `--ink` | `#1E1B32` |
| Soft ink | `--ink-soft` | `#4E4863` |
| Muted ink | `--ink-muted` | `#6B6478` |
| Border | `--border` | `#DDD3C2` |
| Strong border | `--border-strong` | `#C9BDAA` |
| Primary | `--primary` | `#4F46E5` |
| On primary | `--on-primary` | `#FFFFFF` |
| Accent | `--accent` | `#C2410C` |
| Accent soft | `--accent-soft` | `#FFEDD5` |
| Success | `--success` | `#15803D` |
| Danger | `--danger` | `#B91C1C` |
| Focus | `--focus` | `#4F46E5` |

### Arcade

| Role | Token | Value |
| --- | --- | --- |
| Background | `--bg` | `#080B14` |
| Raised background | `--bg-2` | `#0D1220` |
| Surface | `--surface` | `#111827` |
| Secondary surface | `--surface-2` | `#172033` |
| Ink | `--ink` | `#F8FAFC` |
| Soft ink | `--ink-soft` | `#C9D4E5` |
| Muted ink | `--ink-muted` | `#9AA8BE` |
| Border | `--border` | `#263248` |
| Strong border | `--border-strong` | `#3A4A66` |
| Primary | `--primary` | `#22D3EE` |
| On primary | `--on-primary` | `#052A33` |
| Accent | `--accent` | `#FBBF24` |
| Accent soft | `--accent-soft` | `#3A2E05` |
| Success | `--success` | `#4ADE80` |
| Danger | `--danger` | `#FB7185` |
| Focus | `--focus` | `#FBBF24` |

### Finger colors

| Finger | Aula | Arcade |
| --- | --- | --- |
| Pinky | `#BE185D` | `#F472B6` |
| Ring | `#1D4ED8` | `#60A5FA` |
| Middle | `#0F766E` | `#2DD4BF` |
| Left index | `#C2410C` | `#FB923C` |
| Right index | `#A16207` | `#FACC15` |
| Thumbs | `#0E7490` | `#22D3EE` |

`tests/check_contrast.py` is the objective source of truth. It covers body text, muted text, badges, buttons, key labels, key tints and state colors in both themes. Current status: **OK**.

Themes use `<html data-theme="aula|arcade">`. There are no `prefers-color-scheme` rules and no Tailwind `dark:` variants; the OS light/dark setting cannot break the selected world.

## Typography

- **Display:** Fredoka variable (300–700), self-hosted.
- **Body/UI:** Nunito variable (200–900), self-hosted.
- **Typing surface:** the system mono stack, for stable character width.
- Body text 16 px, line-height 1.5. Labels 10–12 px but bold and contrast-checked. Key labels 14 px desktop / 13 px small screens.
- `font-display: swap`; both fonts are local.

## Layout

- Max content width 1180 px; page padding 24 px desktop, 16 px mobile.
- Top bar: brand, Aula/Arcade switch, **Ruta** button with star count, **Ajustes** gear, help. Sticky with a solid surface and a hairline bottom border.
- Main stage: one column. Practice card first (title, exercise badge, actions, prompt, cues, coach, compact metrics strip), then the keyboard card (legend, keyboard, hands).
- Learning path: **hidden dialog** with six level cards, total stars and current level. Clicking a level closes the dialog and starts it.
- Settings: **hidden dialog** with sound, voice guide, voice selection, voice test, static language/keyboard rows and reset progress.
- Breakpoints: compact netbook mode under 700 px height; 2-column level dialog under 900 px; mobile adaptations under 720/560/480/400 px. The product focus is desktop/netbook, not mobile-first.
- At 360 px the page has no horizontal body scroll; the keyboard scrolls inside its own frame and the target key is brought into view.

## Components

### Keycaps

- 44 px minimum target, 46 px desktop, 44 px mobile.
- Radius 8 px, 1 px key border, 3 px inset bottom edge, soft outer shadow.
- Finger tint on the cap and a stronger finger color on the bottom edge.
- Target: 3 px focus outline plus a pulsing ring pseudo-element. Reduced motion leaves the ring static.
- Pressed: 2 px translate, reduced shadow, success/danger fill with readable text.
- Decor keys (Tab, Bloq Mayús) are non-interactive spans. Shift keys are real buttons with `aria-pressed`; they toggle a sticky shift for the next character.
- The dead acute key (`´`) is a real button with `aria-pressed`. Clicking it arms the next vowel; the letter A–U is then converted to its accented form.

### Prompt tape

- One box per character, mono type, 2.8rem tall desktop / 2.4rem mobile.
- States: pending, current, done, wrong. Spaces are `␣` with an accessible name.
- Dictation hides upcoming letters behind `?` until the hint is shown.
- Progress is a 6 px bar animated with `transform: scaleX()`.

### Hands

- Two mirrored SVG hands: palm, five rounded fingers and an angled thumb.
- Fingers are ordered pinky → ring → middle → index on the left hand, and thumb → index → middle → ring → pinky on the right.
- Inactive fingers are pastel; the active finger uses its full color, a dark outline and a soft glow.
- When the target is accented, the vowel finger and the dead-key pinky are both highlighted. The dead key gets a dashed accent outline.
- Hands are decorative (`aria-hidden`); the text cue names the hand and finger.

### Coach and metrics

- 56 px mascot with happy, focused, celebrate and oops faces; `aria-live="polite"` on the message.
- Metrics are a compact strip inside the practice card: speed, accuracy, combo/streak, points. They are secondary to the prompt and keyboard.

### Dialogs

- Native `<dialog>` with `showModal()`, `aria-labelledby`, and a 44 px close button on mobile.
- Path and settings are opened from header buttons with `aria-haspopup="dialog"` and `aria-controls`.
- Summary cannot be dismissed by clicking the backdrop; it closes through its actions or Escape.
- Focus moves to a safe action on open and returns to the practice area on close, unless another dialog is open.

### Voice controls

- Automatic option: **Automática · chica latina**.
- Only Latin American Spanish voices are listed: es-MX, es-US, es-419, es-AR, es-CO and other Latin variants. Spain Spanish is not offered.
- Voice candidates are sorted: Mexico bonus, female-name heuristic before unknown/male.
- The settings dialog shows the automatic voice and whether it is Latin/feminine by heuristic. If no Latin voice exists, the voice guide is disabled and the dialog explains why.
- Pitch is raised (1.12 in Aula, 1.06 in Arcade) and rate is slightly slowed for a youthful, friendly tone. The actual voice depends on the OS.

## Motion

- Base 220 ms, fast 120 ms, slow 420 ms; `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- One authored moment: the target key ring. Secondary moments: key press, error shake, dialog entrance, star pop.
- Transforms and opacity only; no layout animation.
- `prefers-reduced-motion: reduce` collapses durations and iterations, disables smooth scroll and leaves the target ring static.

## Accessibility

- Semantic landmarks: header, main, sections with headings, footer.
- Skip link to the practice area.
- Visible `:focus-visible` ring; `scroll-padding-top` avoids the sticky top bar covering focused content.
- Native dialogs trap focus; focus returns to practice after close.
- `aria-live` for coach feedback; `aria-pressed` for toggles and Shift/dead key; `aria-current="step"` for the current level; key labels include the finger name.
- Keyboard handling ignores Ctrl/Cmd/Alt, key repeat, form controls and open dialogs; CapsLock is normalized; Shift is required for uppercase; the physical dead key composes accents.
- Touch: 44 px targets on mobile, sticky Shift, dead-key accent button, keyboard horizontal scrolling with the target key brought into view.
- Color is never the only cue.

## Content

- Mexican Spanish only: `lang="es-MX"`, speech `es-MX`, keyboard labels `Ñ`, `´`, `{`.
- Six levels, four exercises each. Level 6 covers á, é, í, ó, ú.
- Copy names the action or outcome: “Escuchar”, “Mostrar pista”, “Siguiente ejercicio”, “Volver al inicio”.
- No emoji used as icons.

## Desktop

- Electron wrapper in `desktop/` loads the self-contained `dist/CyberType.html`.
- Window 1366×900, min 1024×600; `nodeIntegration: false`, `sandbox: true`, context isolation.
- Linux AppImage and Windows portable executable are built in CI; signing requires `CSC_LINK`/`CSC_KEY_PASSWORD`.
- The wrapper has no remote content and blocks external navigation.

## Known limits

- No teacher profiles or export.
- Voice gender is a name heuristic, not a platform API.
- No signed binaries without a certificate.
- Service worker cache must be versioned on release.
- The Impeccable detector runs in degraded regex mode when its HTML parser modules are unavailable; offline, contrast and Playwright tests are the objective evidence.
