# Accessibility Roadmap

This document captures the accessibility work that extends beyond the first-pass color assist settings added to the main menu.

## Shipped First Pass

- Main menu `Settings` button with color assist access.
- Standard color assist presets:
  - `Off`
  - `Protanopia`
  - `Deuteranopia`
  - `Tritanopia`
- Live preview cards for:
  - player
  - buster
  - chaser
  - phase buster
  - elite threat
  - danger shot
- Palette remapping applied through the shared gameplay color system instead of a post-process screen filter.
- Local persistence so the chosen assist mode survives reloads.

## Why This Is Not Enough

Color presets help, but they do not fully solve readability in a high-speed action game. Players still need secondary recognition cues when the screen is dense, effects overlap, or different threat families share similar brightness values.

## Next Priorities

### 1. Non-color identity cues

- Add subtle shape markers for enemy families.
- Differentiate important hostile projectile tiers by outline/core treatment.
- Add stronger silhouette differences for advanced and elite enemies.

### 2. Contrast pass

- Audit player, danger, advanced, aggressive, and elite palettes for minimum contrast targets.
- Review low-brightness scenes, bloom-heavy moments, and compact viewport readability.
- Tighten the grey bullet / harvest contrast against dark backgrounds.

### 3. Gameplay readability pass

- Identify threat cases where the player color and danger colors still feel too close under assist modes.
- Add optional aim, hit, and status cues that do not depend only on hue.
- Review wall-heavy rooms where bullets and enemies can overlap geometry and lose clarity.

### 4. Settings expansion

- Add short helper copy explaining what each color assist mode is meant to help with.
- Add a direct reset-to-defaults action in settings.
- Consider exposing settings from game over and any future pause/menu layer, not only the main menu.

### 5. Telemetry and QA

- Track which assist mode was active during a run.
- Capture screenshots/video references from testers using each preset.
- Build a small regression checklist for:
  - menu UI
  - gameplay bullets
  - enemy families
  - leaderboard colors
  - patch notes / settings overlap

## Research Follow-up

- Validate the current preset palettes with real player feedback instead of assuming the first pass is correct.
- Compare against accessibility patterns used in other action-heavy mobile games.
- If needed, move from fixed presets to a hybrid model:
  - standard presets
  - plus manual danger/player accent overrides

## Guardrails

- Do not ship future accessibility changes as screen-wide filters unless there is a separate optional visual-effect mode.
- Keep the player-selected theme color intact as a concept; accessibility adjustments should reinterpret the palette, not erase theme identity.
- Prefer gameplay-level readability fixes over cosmetic UI-only fixes.
