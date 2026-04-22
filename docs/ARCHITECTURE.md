# Phantom Rebound Architecture

## Overview

**Phantom Rebound** is a ghost-themed reverse bullet-hell arcade shooter for mobile (web-based). Players control a ghost sprite that absorbs enemy fire bouncing off walls, storing charge to fire back.

**Tech Stack:**
- **Vanilla JavaScript** (ES modules, no bundler or framework)
- **Canvas 2D** for rendering
- **localStorage** for player profiles and leaderboards
- **Optional remote leaderboard** via Supabase (graceful fallback to local)
- **Responsive viewport** targeting 60 fps on midrange Android (API 31) and iOS 15+

**Play Pattern:** ~30 plays/day, 5–10 minute runs. Current version: **v1.19.11**.

---

## Entry Points

### index.html
- Single-page container with modal screens (main menu, game over, settings, leaderboards, patch notes).
- Sets `window.__APP_BUILD__` to the current version string.
- Loads two stylesheets and the main script with cache-bust query params (`?v=1.19.11`).
- The `<canvas id="cv">` is the game surface; overlays are DOM layers above it.

### script.js
- Main game loop: 60 fps `requestAnimationFrame` tick.
- Imports ~70 modules from `src/` and wires them into a global game state object.
- Contains the mutable run state: enemies, bullets, player, score, room progress.
- Calls system functions (damage, spawning, UI rendering) in order each frame.
- **Known tech debt:** All mutable state lives in script.js (globals and object properties). Refactoring to a dedicated store is planned.

### Cache-Bust Scheme
Assets and JS files use `?v=X.Y.Z` query strings to force fresh downloads after deployment:
- `styles.css?v=1.19.11`
- `script.js?v=1.19.11`
- Icon and manifest links also versioned.

---

## Directory Map

| Path | Role |
|------|------|
| `src/data/` | Constants, configs, game rules (boons, enemy types, color schemes, version). |
| `src/systems/` | Pure logic modules (damage calc, scoring, bullet physics, particles, progression). |
| `src/core/` | Core runtime state factories (player, run metrics, timers). |
| `src/entities/` | Actor types: enemies, bullets, player projectiles, defenses (shields, orbits). |
| `src/ui/` | DOM rendering (HUD, panels, modals). |
| `src/ui/drawing/` | Canvas 2D renderers (ghost, bullets, particles, hats). |
| `src/input/` | Input handlers (joystick, touch, keyboard). |
| `src/platform/` | Cross-platform concerns (storage, viewport, leaderboard sync, diagnostics). |

---

## Module Categories

### data/ — Rules & Constants
Immutable game definitions. No side effects.

- **gameData.js**: Room layouts (ROOM_SCRIPTS, BOSS_ROOMS), global constants (C).
- **boons.js**: Boon mechanics (upgrade effects, stat scaling, legendary sequences).
- **boonConstants.js**: Tuning knobs (damage multipliers, cooldowns, capacity caps).
- **enemyTypes.js**: Enemy type definitions (speed, HP, fire rate, spawn value).
- **constants.js**: Shared magic numbers (MAX_BULLETS, SHIELD_HALF_W, etc.).
- **colorScheme.js**: Threat palette, player color options, accessibility modes.
- **version.js**: VERSION object ({num, label}) and formatting helper.
- **patchNotes.js**: Release notes and archive.
- **hats.js**: Hat cosmetics and rendering hints.

### systems/ — Pure Logic
Functions that compute outcomes from inputs. No global state reads (passed as arguments).

- **damage.js**: `computeProjectileHitDamage()` – scales by room and modifiers.
- **scoring.js**: `computeKillScore()`, `computeFiveRoomCheckpointBonus()`.
- **bulletRuntime.js**: Bounce logic, expiry checks, border clipping.
- **particles.js**: Spark, explosion, dissipate burst effects.
- **damageNumbers.js**: Floating damage numbers (spawn, update, draw).
- **sustain.js**: Kill-sustain heal cap and application.
- **progression.js**: Damageless room tracking and reward logic.
- **killRewards.js**: Boon effect triggers (kill-based procs).
- **dangerHit.js**: Player hit consequences (lifeline, slip, rusher contact).
- **outputHit.js**: Enemy hit outcomes, sanguine burst.
- **spawnBudget.js**: Weighted enemy wave generation.
- **telemetry.js**: Diagnostics and crash reporting.

### core/ — State Factories
Initialize and manage run-level state.

- **runState.js**: `createInitialPlayerState()`, `createInitialRunMetrics()`, `createInitialRuntimeTimers()`.
- **roomRuntime.js**: Room progression, enemy queues, spawn timing.
- **roomFlow.js**: Orchestrates room intro → enemy waves → room clear → boon selection.

### entities/ — Actors & Projectiles
Constructors and runtime logic for game objects.

- **enemyTypes.js**: `ENEMY_TYPES` object (type definitions), `createEnemy()` factory, color resolution.
- **enemyRuntime.js**: Enemy state updates (movement, combat, separation, orbit sphere).
- **projectiles.js**: Enemy bullet spawners (aimed, radial, bursts, triangle, elite variants).
- **playerFire.js**: Player shot planning (lanes, volley specs, charge mechanics).
- **playerProjectiles.js**: Player bullet spawners (grey, output, splits, radial bursts).
- **defenseRuntime.js**: Shields, orbit slots, charged orbs, mirror reflections.

### ui/ — DOM Rendering
Render UI panels, modals, and in-game text.

- **hud.js**: Top HUD (room counter, score, charge badge, SPS display).
- **boonSelection.js**: Boon choice cards (shown after room clear).
- **boonsPanel.js**: View active boons or run loadout.
- **gameOver.js**: Final score screen and name entry.
- **leaderboard.js**: Leaderboard display (daily/all-time, everyone/personal).
- **patchNotes.js**: Release notes panel.
- **colorSelector.js**: Player color picker.
- **sessionFlow.js**: Name input, run continuation logic.
- **roomOverlays.js**: Room intro ("READY?"), room clear ("ROOM CLEAR"), boss defeated overlays.
- **shell.js**: App chrome visibility, color-driven text updates.
- **appChrome.js**: Modal bindings (open/close patch notes, leaderboards, boons panel).
- **iconRenderer.js**: SVG icon helpers (boon icons, threat colors).
- **versionTag.js**: Version banner rendering.

### ui/drawing/ — Canvas Renderers
Pure canvas 2D functions (no mutable state, all params passed in).

- **ghostRenderer.js**: `drawGhostSprite()` – player sprite, eyes, HP bar, charge ring, death anim.
- **bulletRenderer.js**: `drawBulletSpriteImpl()`, `drawGooBall()`, bounce ring rendering.
- **hatRenderer.js**: `drawGhostHatLayer()` – cosmetic hat layers.

### input/ — Input Handlers
Player control bindings.

- **joystick.js**: Virtual joystick, deadzone, button bindings (touch, keyboard, gamepad).

### platform/ — Cross-Platform Concerns
Storage, networking, viewport, diagnostics.

- **storage.js**: `readText()`, `writeText()`, `readJson()`, `writeJson()` (localStorage wrappers).
- **leaderboardController.js**: Leaderboard sync state machine.
- **leaderboardLocal.js**: Local leaderboard parsing, entry insertion, name sanitization.
- **leaderboardService.js**: Remote API calls to Supabase.
- **leaderboardRuntime.js**: Sync scheduling and fallback logic.
- **viewport.js**: `bindResponsiveViewport()` – screen resize handling.
- **gestureGuards.js**: Touch gesture validation (prevent unintended inputs).
- **diagnostics.js**: Crash report generation.

---

## State Ownership

**Current Design (Tech Debt):**

Most mutable state is stored in `script.js` as object properties:
```javascript
// In script.js:
let playerState = { x, y, r, vx, vy, hp, ... };
let runMetrics = { score, kills, charge, hp, ... };
let enemies = [];
let dangerBullets = [];
let outputBullets = [];
let particles = [];
// ... ~20 more global-ish structures
```

**Why:**
- Direct property access is fast on 60-fps game loops.
- No serialization overhead.
- Minimal framework coupling.

**Planned Refactoring (see [agents.md](agents.md)):**
- Phase 3: Introduce a dedicated game state module (immutable snapshots or event-sourced updates).
- Phase 4: Decouple rendering from state mutation.
- Phase 5: Enable pause/resume and replay capture.

---

## Versioning

**The 5-place rule:** When bumping version, update all five locations:

1. **src/data/version.js**: `VERSION.num` and `VERSION.label`
2. **version.json**: JSON object with `version` and `label`
3. **index.html**: `window.__APP_BUILD__` string literal (line ~16)
4. **index.html**: `?v=X.Y.Z` on stylesheet and script tags (lines 31, 261)
5. **src/data/patchNotes.js**: Add entry to `PATCH_NOTES` array

Failure to sync all five can cause:
- Stale cache serving old code.
- Version check showing mismatched numbers.
- QA/mobile store unable to confirm fresh builds.

**Example workflow:**
```bash
# Bump from 1.19.11 to 1.20.0 with label "FEATURE_X_RELEASE"
# Edit the 5 files above, then commit:
git add -A && git commit -m "v1.20.0: FEATURE_X_RELEASE"
```

---

## Testing

### Test Runner
Single file: `scripts/test-systems.mjs`

**Run:**
```bash
node scripts\test-systems.mjs
```

**Imports:** Direct ESM from `src/`, no bundler. Tests pure functions (damage, scoring, spawn logic, bullet physics).

**Examples tested:**
- Projectile damage scaling by room and modifiers.
- Kill score computation with boon bonuses.
- Bullet bounce and expiry.
- Leaderboard entry parsing and sanitization.
- Boon mechanic combinations.

**No UI tests:** Canvas and DOM rendering are visual and logic-free (params → output).

---

## Common Recipes

### Adding a New Boon

1. **Edit `src/data/boons.js`**: Add entry to `BOONS` array with properties:
   ```javascript
   {
     id: 'my-boon',
     name: 'My Boon',
     description: 'Does something cool.',
     tier: 1,
     rarity: 'common',
     // ... more properties (see existing entries)
   }
   ```

2. **Implement effect in `script.js`**: In the game loop tick, check `hasUpgrade('my-boon')` and apply side effects:
   ```javascript
   if (hasUpgrade('my-boon')) {
     // Apply logic to player, enemies, bullets, etc.
   }
   ```

3. **Test:** Run `node scripts\test-systems.mjs` to verify no regressions.

### Adding a New Enemy Type

1. **Edit `src/entities/enemyTypes.js`**: Add entry to `ENEMY_TYPES`:
   ```javascript
   my_enemy: {
     label: 'My Enemy',
     colorRole: 'danger',
     r: 12,
     hp: 3,
     spd: 50,
     fRate: 2000,
     // ... more properties
   }
   ```

2. **Update spawn budget** in `src/systems/spawnBudget.js` if needed (adjust weights).

3. **Add rendering hook** in `script.js` if the enemy has a unique visual (e.g., spikes, wings). Otherwise use default circle.

4. **Add to `gameData.js` ROOM_SCRIPTS** to unlock at a specific room:
   ```javascript
   { enemies: ['my-enemy'], ... }
   ```

---

## Naming Conventions

Use these prefixes to signal intent:

| Prefix | Meaning | Example |
|--------|---------|---------|
| `draw*` | Canvas 2D renderer (pure, receives params, no reads from globals) | `drawGhostSprite`, `drawBulletSpriteImpl` |
| `render*` | DOM renderer (returns HTML or mutates DOM) | `renderHud`, `renderLeaderboard` |
| `get*` | Compute a value (pure, no side effects) | `getActiveBoonEntries`, `getPayloadBlastRadius` |
| `apply*` | Mutate state in place | `applyOrbitSphereContact`, `applyKillSustainHeal` |
| `spawn*` | Factory that creates and pushes to a buffer | `spawnAimedEnemyBullet`, `spawnDmgNumber` |
| `resolve*` | Process a state transition or collision | `resolveDangerBounceState`, `resolveEnemyKillEffects` |
| `build*` | Construct a spec/plan without side effects | `buildPlayerShotPlan`, `buildAegisBatteryBoltSpec` |
| `sync*` | Synchronize UI/state with external data | `syncLeaderboardStatusBadge`, `syncColorDrivenCopy` |

---

## Known Refactoring Work

See [agents.md](agents.md) for the full 5-phase plan. High-level:

- **Phase 1 (current):** Modularize UI and rendering (✓ mostly done).
- **Phase 2:** Decouple input from game loop.
- **Phase 3:** Centralize run state.
- **Phase 4:** Immutable rendering layer.
- **Phase 5:** Replay and pause/resume support.

Key areas for future contributors:
- **Global state in script.js**: Migrate to a store module for easier testing and serialization.
- **Canvas rendering**: Already modular; consider adding a sprite atlas if particle count grows.
- **Leaderboard sync:** Currently on-demand; could batch syncs to reduce API calls.
- **Mobile performance:** Profile on low-end devices; consider adaptive quality tiers (reduced particle count, lower res sprites).

---

## Quick Links

- **Game Rules:** See `src/data/gameData.js` (room/boss layouts) and `src/data/boons.js` (upgrade mechanics).
- **Balance Tuning:** `src/data/boonConstants.js` (damage, cooldowns, caps) and `src/entities/enemyTypes.js` (enemy stats).
- **Performance Targets:** `src/data/constants.js` (MAX_PARTICLES, MAX_BULLETS).
- **Patch Notes:** `src/data/patchNotes.js`.
- **Version Check:** `index.html` inline script (~line 15) and `src/ui/versionTag.js`.

---

**Last updated:** v1.19.11  
**Maintainers:** Whynchu and community contributors
