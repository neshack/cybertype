# CyberType — Design system

## Direction

**A tactile school typing desk, not a dashboard.** The keyboard is the main object: chunky keycaps, a warm paper surface, a visible finger map and a coach that reacts to the student. Aula is the daylight version; Arcade is the same desk under a dark training lamp.

The product is an **Operate** surface: the student completes a task. Expression lives in the keycaps, the mascot, the finger colors and the motion; it never hides the next key, the current character or the exit.

The generated `design-system/cybertype/MASTER.md` is the input. This document records the decisions that were actually built and the deliberate deviations:

- Fredoka + Nunito are kept, but both are self-hosted (no Google Fonts request).
- The accent is darkened to `#C2410C` so 12 px text on the accent-soft surface clears 4.5:1.
- Arcade is an intentional second product mode, not the OS dark mode. The MASTER's “avoid dark modes” note applies to a single default theme; here the dark world is a feature and it is contrast-tested.
- The landing-page “Feature-Rich Showcase” pattern does not apply. The app uses one workspace, not a marketing page.

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

The finger palette is functional information. Color is never the only cue: every key has a label, the finger cue names the hand and finger, and the hand diagram highlights the same finger.

| Finger | Aula | Arcade |
| --- | --- | --- |
| Pinky | `#BE185D` | `#F472B6` |
| Ring | `#1D4ED8` | `#60A5FA` |
| Middle | `#0F766E` | `#2DD4BF` |
| Left index | `#C2410C` | `#FB923C` |
| Right index | `#A16207` | `#FACC15` |
| Thumbs | `#0E7490` | `#22D3EE` |

`tests/check_contrast.py` is the source of truth for the contrast pairs. It covers body text, muted text, badges, buttons, key labels and key tints in both themes. Current status: **OK** for every tested pair.

Themes are selected with `<html data-theme="aula|arcade">`; there are no `@media (prefers-color-scheme: dark)` rules and no Tailwind `dark:` variants. The operating system can be light or dark without changing the selected world.

## Typography

- **Display:** Fredoka variable (300–700), self-hosted `assets/fonts/fredoka-latin.woff2`. Used for the wordmark, section titles, level names, stat values and key labels.
- **Body/UI:** Nunito variable (200–900), self-hosted `assets/fonts/nunito-latin.woff2`. Used for instructions, badges, buttons, labels and dialogs.
- **Typing surface:** the system mono stack (`ui-monospace`, Cascadia Mono, Consolas, DejaVu Sans Mono). The exercise characters need a stable advance width, not a brand face.
- Body text is 16 px with 1.5 line-height. Secondary labels are 10–12 px but always bold enough and contrast-checked. Key labels are 14 px on desktop, 13 px on small screens.
- `font-display: swap`; both fonts are local, so there is no network flash.

## Layout

- Max content width 1280 px; page padding 24 px desktop, 16 px mobile.
- Top bar: brand, Aula/Arcade segmented control, sound, voice, help. Sticky with a solid surface and a hairline bottom border. It wraps at 560 px instead of clipping.
- Learning path: five level cards in a 5-column grid. Below 900 px the rail becomes horizontally scrollable and snaps; the current level is scrolled into view without moving the page vertically.
- Workspace: `1fr 300px` on desktop (practice + keyboard on the left, session + settings on the right). Below 980 px it becomes one column.
- Practice card: title and exercise badge, actions (listen, hint, restart), prompt tape, progress, finger/shift/caps cues, coach.
- Keyboard card: finger legend, keyboard, scroll hint on small screens, hands.
- Short netbooks: under 700 px height and above 900 px width, cards tighten, level descriptions hide and the keyboard comes into view sooner.
- Mobile: the top bar uses two rows, the level rail scrolls, the keyboard scrolls inside its own frame (never the page), and the hands shrink.
- At 360 px the page has no horizontal body scroll; `scrollWidth` is below the viewport width in the tested captures.

## Components

### Keycaps

- 44 px minimum target, 46 px desktop, 44 px mobile.
- Radius 8 px, 1 px key border, 3 px inset bottom edge, soft outer shadow.
- Finger tint on the cap and a stronger finger color on the bottom edge.
- Target: 3 px focus outline plus a pulsing ring pseudo-element. The ring is disabled by reduced motion.
- Pressed: 2 px translate, reduced shadow, success/danger fill. The success and danger text tokens keep the label readable in both themes.
- Decor keys (Tab, Bloq Mayús) are non-interactive spans and are hidden from assistive technology. Shift keys are real buttons with `aria-pressed`; clicking or tapping toggles a sticky shift for the next character.

### Prompt tape

- One box per character, mono type, 2.8rem tall desktop / 2.4rem mobile.
- States: pending (muted), current (surface, primary border, slight scale), done (success soft), wrong (danger soft plus a shake that respects reduced motion).
- Spaces are visible as `␣` with an accessible name. Dictation hides upcoming letters behind `?` until the hint is shown.
- A 6 px progress bar uses `transform: scaleX()` rather than width animation.

### Coach

- 56 px mascot, name (Tico/CyberBot), one short message.
- `aria-live="polite"` on the message; it announces errors, streak milestones and completion.
- The mascot has happy, focused, celebrate and oops faces. The celebrate face has one short animation; reduced motion removes it.

### Dialogs

- Native `<dialog>` with `showModal()`.
- `role` is implicit; titles are linked with `aria-labelledby`; the summary is described by its message.
- Close buttons are 44 px on mobile. Escape and the close button work. The summary cannot be dismissed by clicking the backdrop; it closes through its actions or Escape.
- Focus moves to the safe primary action on open (the cancel action in the reset dialog) and returns to the practice area on close.

### Stats and actions

- Four stats in a 2×2 grid: velocidad (PPM), precisión, combo (multiplier · streak) and puntos.
- Primary buttons use the primary token; soft buttons use surface-2 plus a border; ghost buttons are for secondary actions. Every button has a 40 px minimum height, 44 px on mobile.
- Toggles use `aria-pressed` and a visible icon/label change.

## Motion

- Base duration 220 ms, fast 120 ms, slow 420 ms; `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- One authored moment: the target key ring. Secondary moments: key press, error shake, dialog entrance, star pop.
- Transforms and opacity only; no layout animation. The progress bar uses a transform.
- `prefers-reduced-motion: reduce` collapses durations, iteration counts and scroll behavior, and leaves the target ring visible but static.

## Accessibility

- Semantic landmarks: header, main, sections with headings, aside, footer.
- Skip link to the practice area.
- Visible `:focus-visible` ring on every focusable control, including dialog buttons.
- `scroll-padding-top` avoids the sticky top bar covering focused content.
- Native dialogs provide a focus trap; focus is restored after close.
- `aria-live` for coach feedback; `aria-pressed` for toggles; `aria-current="step"` for the current level; `aria-label` includes the finger for virtual keys.
- Keyboard handling: modifiers (Ctrl/Cmd/Alt), key repeat, composition and form controls are ignored; CapsLock is normalized; Shift is required for uppercase and accepted from the opposite hand; virtual keys are not in the tab order because the physical keyboard is the primary input.
- Touch: 44 px targets on mobile, sticky Shift for uppercase, keyboard horizontal scrolling with the target key brought into view.
- Color is not the only cue; every finger color has a text label and the active hand finger is highlighted.

## Content

- Spanish, warm but concise. No exclamation mark on every line; no emoji icons.
- “Presiona”, “Escucha”, “Mostrar pista”, “Sigue con el siguiente ejercicio” name the action or the outcome.
- The content avoids accents in this version because dead-key composition is not implemented. Words that would need an accent were replaced rather than misspelled. Accent drills are listed as a next step.

## Known limits

- No teacher profiles or export.
- No accent/dead-key drills.
- No native `.exe`/AppImage; the portable file is the zero-install distribution.
- The service worker cache must be versioned on release (`CACHE_NAME`).
- The Impeccable detector ran in degraded regex mode because its HTML parser modules were unavailable; the offline and contrast checks are the objective evidence here.
