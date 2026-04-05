# Color Work Continuation — Phase 8+

> **Status as of v1.15.1** — Core color infrastructure is in place. This document describes remaining polish, gaps, and future phases for any AI or developer picking up the work.

---

## Current Architecture (v1.15.1)

### Single Source of Truth
- **`src/data/version.js`** — `VERSION.num` drives: browser tab title, HUD version tag, `version.json`, and `__APP_BUILD__` in `index.html`
- **`src/data/colorScheme.js`** — 8 color palettes. `setPlayerColor()` updates CSS variables AND the JS `C` object getters.
- **`src/data/gameData.js`** — `C` object with dynamic getters (`C.green`, `C.ghost`, `C.danger`, etc.) backed by `getPlayerColorScheme()`.

### CSS Variable Flow
When `setPlayerColor(key)` is called, it sets on `:root`:
```
--accent       → scheme.hex        (primary player color)
--accent2      → scheme.dark       (dark variant)
--ghost        → scheme.light      (light variant)
--accent-rgb   → "R,G,B"          (for rgba() in CSS)
--ghost-rgb    → "R,G,B"
--danger-rgb   → "R,G,B"
--player-accent, --player-accent-light, --player-accent-dark, --player-danger (legacy, still set)
```

### Canvas Color Flow
The `C` object in `gameData.js` provides:
- `C.green` / `C.greenRgb` — player accent (hex / `{r,g,b}`)
- `C.ghost` / `C.ghostRgb` — player light variant
- `C.dark` / `C.darkRgb` — player dark variant
- `C.danger` / `C.dangerRgb` — enemy bullet color (contrasts with player color)
- `C.dangerCore` — rgba string for bullet cores
- `C.shieldActive` / `C.shieldEnhanced` — shield visual colors
- `C.getRgba(hex, alpha)` — generic helper

### Color Picker UI
- Single circular button inline with name input (`src/ui/colorSelector.js`)
- Click cycles through 8 colors in order
- Calls `cyclePlayerColor()` which calls `setPlayerColor()` internally
- Color persisted to `localStorage` key `phantom-player-color`

### 8 Color Palettes
| Key    | Name          | Hex     | Light   | Dark    | Danger  | Icon |
|--------|---------------|---------|---------|---------|---------|------|
| green  | Ghostly Green | #4ade80 | #b8ffcc | #22c55e | #60a5fa | 🟢   |
| blue   | Azure         | #60a5fa | #93c5fd | #2563eb | #f87171 | 🔵   |
| purple | Phantom       | #c084fc | #e9d5ff | #9333ea | #fbbf24 | 🟣   |
| pink   | Neon Rose     | #f472b6 | #fbcfe8 | #ec4899 | #22d3ee | 💗   |
| gold   | Gilded        | #fbbf24 | #fef3c7 | #d97706 | #4ade80 | ⭐   |
| red    | Crimson       | #f87171 | #fecaca | #dc2626 | #93c5fd | 🔴   |
| cyan   | Ice           | #67e8f9 | #a5f3fc | #06b6d4 | #f87171 | 🧊   |
| orange | Ember         | #fb923c | #fed7aa | #ea580c | #4ade80 | 🔥   |

---

## What's Already Done (Phases 7.1–7.5)

### CSS (styles.css)
- ✅ All `rgba(74,222,128,...)` replaced with `rgba(var(--accent-rgb),...)`
- ✅ Buttons, charge bar, charge badge, room clear/intro text all themed
- ✅ Title gradient uses `var(--accent)` and `var(--ghost)`
- ✅ Leaderboard toggle active state themed
- ✅ Upgrade card hover themed

### Canvas (script.js)
- ✅ Ghost body color from `C.greenRgb` (dynamic)
- ✅ Ghost ambient glow from `C.ghostRgb` (dynamic)
- ✅ Output bullets use `C.green`
- ✅ Crit bullets use `C.ghost`
- ✅ Crit sparks use `C.ghost`
- ✅ Standard danger bullets use `C.danger` / `C.dangerCore`
- ✅ Triangle bullets use `C.danger` / `C.dangerCore`
- ✅ Shield visuals use `C.shieldActive` / `C.shieldEnhanced`

### Leaderboard
- ✅ `boonSelectionOrder` tracked during boon picks
- ✅ Leaderboard entries store `{picks, color, order}`
- ✅ Color-coded left borders on leaderboard entries
- ✅ `supabase/leaderboard.sql` has `player_color` and `boon_order` columns

---

## Phase 8: Remaining Color Polish

### 8.1 — Enemy Body / Danger Color Consistency
**Problem:** Enemy bodies use their own `e.col` from `ENEMY_TYPES`, but danger bullets use `C.danger`. The user expects enemy bodies to match the bullet color they fire.

**Files:** `src/entities/enemyTypes.js`, `script.js` (enemy rendering ~line 1884-1956)

**Current enemy rendering (script.js):**
```js
ctx.fillStyle = e.isElite ? '#ff9500' : e.col;  // line ~1912
```

**Fix approach:**
- Standard enemies that fire danger bullets should have body color derived from `C.danger` or a tinted variant
- Elite enemies (`#ff9500` orange) can stay unique
- Boss health bar (`#fbbf24`) can stay gold
- Siphon enemies (`#a78bfa` purple) should stay purple — they're a distinct type
- Key: Only enemies whose bullets are `C.danger` should have matching bodies

**Enemy types in `src/entities/enemyTypes.js`:**
- `chaser`, `rusher`, `sniper`, `zoner`, `disruptor` — all fire danger-colored bullets → bodies should use `C.danger`
- `siphon` — fires purple bullets, body is purple → leave as-is
- `triangle` (room 20+) — fires triangle bullets → should use `C.danger`

**Implementation:**
1. In `createEnemy()` or at render time, set `e.col` = `C.danger` for standard enemy types
2. Keep `siphon` as `C.siphon` (#a78bfa)
3. Keep elite overlay as `#ff9500`
4. The `e.glowCol` should also match

### 8.2 — Double-Bounce Bullet Color
**Current:** Hardcoded `#c084fc` (purple) for double-bounce bullets before their first bounce.
**Location:** `script.js` ~line 1830
```js
bCol = b.doubleBounce && b.bounceCount === 0 ? '#c084fc' : C.danger;
```
**Decision needed:** Should double-bounce bullets also use `C.danger`, or remain a distinct warning color? Purple serves as a visual warning that the bullet will bounce twice. Consider keeping it as a gameplay signal rather than theming it.

### 8.3 — Particle Effect Colors
**Audit needed:** Search `script.js` for `sparks(` and `particles.push(` calls. Some particle colors may still be hardcoded. Each should use the appropriate `C.*` value.

**Known pattern:**
```js
sparks(x, y, COLOR, count, speed);
particles.push({col: COLOR, ...});
```

### 8.4 — Health Dot Rendering
**Current:** `#health-dots` is `display:none` in CSS (line 93). If re-enabled in the future, the dots should use `C.green` or `var(--accent)` for filled hearts and `var(--dim)` for empty ones.

### 8.5 — Legend Dot Colors
**Location:** `index.html` legend section, `script.js` legend rendering
**Check:** The legend dots showing "Danger" / "Grey" / "Output" colors should dynamically use `C.danger`, `C.grey`, `C.green` rather than hardcoded values.

---

## Phase 9: Enhanced Color Picker UX

### 9.1 — Dropdown/Popup Picker (Optional)
Current picker cycles through colors one at a time. If users want to jump to a specific color:
- Add a small popup/modal showing all 8 colors in a grid
- Trigger on long-press or a secondary tap
- Current cycle-on-click behavior is fine for quick use

### 9.2 — Color Preview Before Game Start
When a color is selected, the start screen could briefly flash/pulse the selected color to give visual confirmation beyond just the button changing.

### 9.3 — Color on Game Over Screen
The game over screen (`#s-go`) doesn't currently show the player's color. Consider tinting the score or adding a small color indicator.

---

## Phase 10: Leaderboard Color Features

### 10.1 — Deploy Database Schema
**MANUAL STEP:** Run `supabase/leaderboard.sql` in the Supabase console. This adds:
- `player_color` column (CHECK constraint for 8 valid values)
- `boon_order` column (TEXT, CSV of boon names)
- Updated `submit_score()` and `get_leaderboard()` functions
- Index on `(game_version, player_color, score)`

### 10.2 — Color-Filtered Leaderboard Views
Once the DB schema is deployed, add UI to filter leaderboard by color:
- "Show all blue-themed runs"
- Small color filter dots above the leaderboard list
- Query: `WHERE player_color = 'blue'`

### 10.3 — Boon Order Display
The `boon_order` CSV is stored but not yet displayed in the leaderboard popup. The "Run Boons" popup (`lb-boons-popup`) should show boons in selection order rather than arbitrary order.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/data/colorScheme.js` | Color palette definitions, get/set/cycle/load functions |
| `src/data/gameData.js` | `C` object with dynamic color getters |
| `src/ui/colorSelector.js` | Compact color picker button UI |
| `src/data/version.js` | Single version source of truth |
| `src/ui/versionTag.js` | Renders version to HUD and browser tab |
| `script.js` | Main game loop — ghost rendering, bullet rendering, HUD |
| `styles.css` | All CSS uses `var(--accent)` / `rgba(var(--accent-rgb),...)` |
| `supabase/leaderboard.sql` | DB schema with color support (needs manual deploy) |
| `src/platform/leaderboardService.js` | Remote score submission with color param |
| `src/entities/enemyTypes.js` | Enemy type definitions (body colors) |

---

## Version Bump Checklist

When bumping version, update these files (all driven from `src/data/version.js`):
1. `src/data/version.js` — `VERSION.num` and `VERSION.label`
2. `version.json` — `version` field (for auto-reload detection)
3. `index.html` — `window.__APP_BUILD__` value
4. `index.html` — `styles.css?v=X` and `script.js?v=X` cache busters

The browser tab title updates automatically via `renderVersionTag()` in `src/ui/versionTag.js`.
