# Ownership Slices

This project is organized by runtime responsibility rather than file type.

## Path ownership

- `src/core/`: game loop, state progression, collision orchestration, room flow.
- `src/entities/`: player, enemies, bullets, orbitals, and other runtime actors.
  Current owned scripts include `enemyTypes.js`.
- `src/data/`: balance constants, scripted room data, version metadata.
  Current owned scripts include `boons.js`, `gameData.js`, and `version.js`.
- `src/ui/`: HUD, overlays, leaderboard rendering, DOM-only presentation logic.
  Current owned scripts include `boonSelection.js` and `versionTag.js`.
- `src/input/`: touch, keyboard, joystick, and future controller handling.
  Current owned scripts include `joystick.js`.
- `src/platform/`: browser-specific behavior such as viewport fixes, storage, analytics hooks.
- `assets/`: production-ready art/audio assets.
- `example.assets/`: scratch assets and profiling samples only.
- `docs/`: release rules, ownership, and mobile design targets.

## Working rules

- Shared constants should enter through `src/data/`, not be redefined in feature files.
- DOM mutations should stay in `src/ui/` unless they are entrypoint bootstrapping.
- Browser/device quirks belong in `src/platform/` so gameplay code stays portable.
- New features should declare their owning slice before expanding the entrypoint.
