# Boon Expansion — Design Specification
> Reference document for the Phase 2+ boon overhaul. All new boons, the Evolution system, and the Legendary Sequence system are defined here. Implement in phases; do not ship partial systems.

---

## Design Goals

1. **More viable build identities.** Every tag (OFFENSE / UTILITY / SURVIVE) should support at least two distinct archetypes with dedicated synergy boons.
2. **Order matters.** Picking Boon A before Boon B can produce an evolved result. Certain 3-boon sequences unlock a Legendary offer.
3. **Meaningful tradeoffs.** New boons should create real tension against existing ones (Dense Core vs. Deep Reserve, Berserker vs. Titan Heart, etc.).
4. **Discoverable complexity.** Evolution and Legendary hints appear in the UI — players are never flying blind, but the depth rewards curiosity.

---

## Target Build Archetypes

| Archetype | Identity | Key Boons |
|---|---|---|
| **Gunboat** | Fire fast, many lanes, volume wins | Rapid Fire, Ring Blast, Twin Lance, Echo Fire |
| **Precision** | Few shots, each one devastating | Dense Core, Snipe Shot, Bigger Bullets, Crit, Overcharge Vent |
| **Fortress** | Never die, shields reflect damage back | Tempered Shield, Mirror Shield, Shield Burst, Barrier Pulse, Armor Weave |
| **Harvester** | Move to charge, absorb everything, fire huge bursts | Kinetic Harvest, Slipstream, Resonant Absorb, Chain Magnet |
| **Glass Cannon** | 1 HP, max output, dodge or die | Berserker, Dead Man's Trigger, Lifeline, MINI |
| **Scavenger** | Charge economy — bank it, vent it, weaponize it | Charged Armor, Overcharge Vent, Charge Cap Up, Deep Reserve |
| **Speed Ghost** | Movement converts to everything | Ghost Velocity, Sliver, MINI, Slipstream, Kinetic Harvest |

---

## New Boons

### OFFENSE

---

**Dense Core**
- Tag: `OFFENSE`
- Icon: `◈`
- Max stacks: 3
- Desc: `−2 charge cap, but each output bullet hits harder.`
- Mechanic: Each pick removes 2 from max charge cap (floor: 3). Adds `+20% damage` per pick to all output bullets via `denseDamageMult`. At 3 stacks: −6 cap, ×1.6 damage.
- New UPG fields: `denseTier` (0–3), `denseDamageMult` (1 + denseTier × 0.2)
- Hard conflicts: warns player at cap floor (boon greyed out when cap ≤ 3)
- Synergies: Snipe Shot, Bigger Bullets, Overcharge Vent, Crit
- Anti-synergies: Deep Reserve, Charge Cap Up, Ring Blast, Twin Lance

---

**Echo Fire**
- Tag: `OFFENSE`
- Icon: `↺`
- Max stacks: 1
- Desc: `Every 5th shot fires a free echo — no charge cost.`
- Mechanic: Track `echoCounter` per fire cycle. Every 5th trigger fires a duplicate output burst for free (does not consume charge). Echo inherits all output stats.
- New UPG fields: `echoFire` (bool), runtime `echoCounter`
- Synergies: all OFFENSE boons (free shots inherit upgrades)

---

**Split Shot**
- Tag: `OFFENSE`
- Icon: `⋔`
- Max stacks: 1
- Desc: `Output bullets split in two on their first wall bounce.`
- Requires: Ricochet already taken (otherwise no effect — `boonHasEffect` returns false if `bounceTier === 0`)
- Mechanic: On first bounce of an output bullet, spawn a second output bullet at the bounce point traveling at ±20° from the reflection angle.
- New UPG fields: `splitShot` (bool)
- Synergies: Ricochet (prerequisite), Long Reach, Bigger Bullets
- Evolution: Ricochet → Split Shot = **Fracture** (see Evolution section)

---

**Volatile Rounds**
- Tag: `OFFENSE`
- Icon: `💢`
- Max stacks: 1
- Desc: `Piercing bullets trigger a burst on their final target.`
- Requires: `pierceTier > 0`
- Mechanic: The last enemy hit by a piercing output bullet (pierce count exhausted) takes a small radial burst (4 mini-output bullets at 90° spacing from impact point).
- New UPG fields: `volatileRounds` (bool)
- Synergies: Pierce, Bigger Bullets, Faster Bullets
- Evolution: Pierce → Volatile Rounds = **Chain Reaction** (see Evolution section)

---

### UTILITY

---

**Slipstream**
- Tag: `UTILITY`
- Icon: `〜`
- Max stacks: 3
- Desc: `Near-miss a danger bullet to gain charge. Diminishes.`
- Mechanic: When a danger bullet passes within 10px of the player without hitting, gain `slipChargeGain` charge (starts 0.3, hyperbolic diminish per tier). 150ms cooldown per trigger to prevent spam in dense rooms.
- New UPG fields: `slipTier`, `slipChargeGain`, runtime cooldown timer
- Synergies: MINI (smaller = more near-misses), Ghost Velocity, Kinetic Harvest
- Evolution: Kinetic Harvest → Slipstream = **Flux State** (see Evolution section)

---

**Resonant Absorb**
- Tag: `UTILITY`
- Icon: `≋`
- Max stacks: 1
- Desc: `Absorbing 3 grey bullets within 1.5s multiplies the last.`
- Mechanic: Track a rolling absorb counter with 1500ms window. On the 3rd+ absorb in window, the absorbed charge is ×1.5. Counter resets after triggered.
- New UPG fields: `resonantAbsorb` (bool), runtime `absorbComboCount`, `absorbComboTimer`
- Synergies: Quick Harvest, Wider Absorb, Chain Magnet, Kinetic Harvest
- Evolution: Quick Harvest → Resonant Absorb = **Flux State** alternate path

---

**Chain Magnet**
- Tag: `UTILITY`
- Icon: `⤥`
- Max stacks: 2
- Desc: `Absorbing a grey bullet doubles pull range for 0.5s.`
- Mechanic: After each absorb event, multiply `absorbRange` by 2 for 500ms. Stacking adds 250ms duration per additional pick.
- New UPG fields: `chainMagnetTier`, runtime `chainMagnetTimer`
- Synergies: Wider Absorb, Resonant Absorb, Quick Harvest

---

**Overcharge Vent**
- Tag: `UTILITY`
- Icon: `⬆`
- Max stacks: 1
- Desc: `Firing at full charge gives +40% damage on that burst.`
- Mechanic: On fire event, if `charge >= maxCharge`, apply ×1.4 multiplier to all output bullets in that burst. No UPG fields needed — just a flag read at fire time.
- New UPG fields: `overchargeVent` (bool)
- Synergies: Charge Cap Up, Deep Reserve, Kinetic Harvest, Dense Core
- Evolution: Dense Core → Snipe Shot = **Railgun Mode** (see Evolution section)

---

**Gravity Well**
- Tag: `UTILITY`
- Icon: `⊙`
- Max stacks: 1
- Desc: `Danger bullets within 80px move 30% slower.`
- Mechanic: In bullet update loop, danger bullets within 80px of player have their velocity scaled by 0.70 each tick (multiplicative, so they slow on approach). Output bullets unaffected.
- New UPG fields: `gravityWell` (bool)
- Synergies: Slipstream (slower = easier near-misses), Wider Absorb, Quick Harvest
- Note: Performance check — only apply to bullets within bounding check, not all bullets each frame.

---

### SURVIVE

---

**Tempered Shield**
- Tag: `SURVIVE`
- Icon: `🛡️+`
- Max stacks: 1
- Desc: `Your shields become 2-stage. Purple absorbs first hit, blue second.`
- Mechanic: If player has `shieldTier > 0`, each shield in the orbit gets a `hardened` flag. First hit: `hardened → false` (shield turns blue, visual color change only). Second hit: shield pops normally.
- New UPG fields: `shieldTempered` (bool)
- Synergies: Protective Shield (prerequisite in spirit), Mirror Shield, Shield Burst
- Requires: `shieldTier > 0` to show effect

---

**Mirror Shield**
- Tag: `SURVIVE`
- Icon: `🪞`
- Max stacks: 1
- Desc: `Shields reflect absorbed bullets back as player output.`
- Mechanic: When a shield absorbs a danger bullet, spawn an output bullet at the shield's position traveling in the *incoming bullet's direction* (reflected angle). Inherits player's current output stats. 300ms cooldown per shield to prevent rapid-fire reflection spam.
- New UPG fields: `shieldMirror` (bool)
- Synergies: Protective Shield, Tempered Shield, Shield Burst, Bigger Bullets
- Evolution: Mirror Shield → Shield Burst = **Aegis Nova** (see Evolution section)

---

**Shield Burst**
- Tag: `SURVIVE`
- Icon: `💠`
- Max stacks: 1
- Desc: `When a shield breaks, fire a 4-way output burst from your position.`
- Mechanic: On shield pop event, spawn 4 output bullets from player position at N/S/E/W angles. Bullets inherit current output stats (size, speed, damage).
- New UPG fields: `shieldBurst` (bool)
- Synergies: Protective Shield, Mirror Shield, Tempered Shield

---

**Barrier Pulse**
- Tag: `SURVIVE`
- Icon: `⬡`
- Max stacks: 1
- Desc: `Shield break grants 1.5 charge and pulses grey bullet magnet.`
- Mechanic: On shield pop: add 1.5 charge instantly + trigger a 600ms ×2 absorb range pulse (same as Chain Magnet mechanic). Stacks with Chain Magnet duration.
- New UPG fields: `barrierPulse` (bool)
- Synergies: Protective Shield, Wider Absorb, Chain Magnet, Quick Harvest

---

**Sliver**
- Tag: `SURVIVE`
- Icon: `◌`
- Max stacks: 1
- Desc: `At ≤25% HP, gain +30% speed and shrink 25%.`
- Mechanic: Each frame, check `hp / maxHp <= 0.25`. If true: apply ×1.3 speed multiplier and ×0.75 size multiplier (on top of base). Not permanent — turns off when HP recovers.
- New UPG fields: `sliver` (bool)
- Synergies: MINI (stack size reduction), Ghost Velocity, Slipstream, Berserker
- Note: Visual — player flickers a slightly different tint when Sliver is active

---

**Vampiric Return**
- Tag: `SURVIVE`
- Icon: `🩸`
- Max stacks: 1
- Desc: `Output bullets that land killing blows restore 2 HP.`
- Mechanic: On enemy death caused by player output bullet, restore 2 HP (capped at `maxHp`). Max 3 triggers per room to prevent trivialization vs. weak enemy swarms.
- New UPG fields: `vampiric` (bool), runtime `vampiricRestoresThisRoom`
- Synergies: Pierce (multiple kills per shot), Ring Blast, Rapid Fire
- Reset: `vampiricRestoresThisRoom = 0` on room start

---

**Lifeline**
- Tag: `SURVIVE`
- Icon: `♾`
- Max stacks: 1
- Desc: `Once per run: a killing blow leaves you at 1 HP instead.`
- Mechanic: Passive flag `lifeline: true`. On player death check: if `lifeline` is true and hasn't triggered this run (`lifelineUsed: false`), set `hp = 1` and `lifelineUsed = true` instead of dying. Flash a distinct "LIFELINE TRIGGERED" visual.
- New UPG fields: `lifeline` (bool), `lifelineUsed` (bool)
- Synergies: Berserker (critical combo), Dead Man's Trigger, Emergency Capacitor

---

**Berserker**
- Tag: `SURVIVE`
- Icon: `🔴`
- Max stacks: 1
- Desc: `Max HP drops to 10. Gain +3 SPS tiers, +30% speed. Exclusive.`
- Mechanic: On pick: set `maxHp = 10`, `hp = min(hp, 10)`. Advance `spsTier` by 3 (capped at ladder max). Apply ×1.3 to `speedMult`. Set `berserker: true`.
- New UPG fields: `berserker` (bool)
- Hard exclusions: cannot be offered if player has `titanTier > 0`, `extraLifeTier > 0`, or `regenTick > 0`
- Synergies: Lifeline, Dead Man's Trigger, Sliver, MINI

---

**Dead Man's Trigger**
- Tag: `SURVIVE`
- Icon: `☠`
- Max stacks: 1
- Desc: `At exactly 1 HP: output bullets deal ×3 damage and pierce freely.`
- Mechanic: Each frame, check `hp === 1`. If true, set `deadManActive: true`. Output bullets read this flag for triple damage and infinite pierce (ignores `pierceTier`, always pierces all enemies). Flag turns off the moment HP is no longer 1.
- New UPG fields: `deadManTrigger` (bool), runtime `deadManActive`
- Synergies: Berserker, Lifeline, Sliver, Emergency Capacitor
- Note: Intentionally powerful at 1 HP — this is the reward for the risk

---

## Evolution System (Option A)

### Architecture

Each boon in `BOONS` array gets two optional fields:

```js
evolvesWith: ['BoonName', ...],   // if any of these are already in UPG when this boon is picked
evolvedVersion: { /* override fields */ }  // name, icon, desc, apply() overrides
```

When `applyBoon(boon, upg, state)` is called, check if any `evolvesWith` boon is active. If yes, merge `evolvedVersion` onto `boon` before applying.

UI: When a boon eligible for evolution is shown in the selection panel and the player already has a qualifying partner, show a `✦` badge and the evolved name on the card.

### Evolution Pairs

| Prerequisite | Boon Picked | Evolved Name | What Changes |
|---|---|---|---|
| Ricochet | Split Shot | **Fracture** | Splits into 3, not 2. Bounced fragments also have ×1.2 damage. |
| Homing | Pierce | **Seeking Lance** | Homing bullets don't stop seeking after pierce — rehome to next target. |
| Kinetic Harvest | Slipstream | **Flux State** | Near-miss AND moving in same moment gives ×2 combined charge tick. |
| Quick Harvest | Resonant Absorb | **Surge Harvest** | Resonant combo window extends to 2.5s and multiplier increases to ×2. |
| Mirror Shield | Shield Burst | **Aegis Nova** | Reflected bullets also trigger the 4-way burst at reflection point. |
| Titan Heart | Armor Weave | **Living Fortress** | Armor reduction scales with HP% — full HP = double the flat reduction. |
| Dense Core | Snipe Shot | **Railgun Mode** | First shot of each burst deals ×3 damage (not ×1.6). Visible charge-up glow. |
| Berserker | Lifeline | **Last Stand** | Lifeline triggers automatically AND fires a full-charge burst on activation. |
| Orbit Spheres | Volatile Orbs | **Nova Cage** | Sphere explosions leave a 1s slow field. Spheres respawn after 5s. |

### Implementation Notes

- `boonHasEffect` already checks UPG state — extend it to also factor in evolution eligibility
- `buildMainCards()` in `boonSelection.js` needs to read `evolvesWith` and set an `evolved` flag on the card data
- Evolution is purely cosmetic in the card (different name/icon/badge) but the `apply()` runs the evolved version
- Store evolved boon name in `getActiveBoonEntries` output so leaderboard boon viewer shows "Fracture" not "Split Shot"

---

## Legendary Sequences (Option B)

### Architecture

Track `boonHistory: []` array in game state — append boon name on every pick (including Recover).

After every boon pick, run `checkLegendarySequences(boonHistory)`. Returns the first matching legendary definition or null.

If a legendary is found and `legendaryOffered: false`, flag `pendingLegendary: true`. On the *next* room clear, inject the legendary as a 4th option alongside the standard 3 + Recover. Once offered (accepted or declined), `legendaryOffered = true` for that run.

Legendary boons are not in the normal `BOONS` pool — they can only appear via sequence trigger.

### Sequence Definitions

```
Sequence: Mirror Shield → Shield Burst → Tempered Shield (any order)
Legendary: AEGIS TITAN
Effect: All shields become permanent (never break). Instead of popping,
        they go on a 6s cooldown then return. Mirror and Burst effects
        still trigger on "would-break" event.
Icon: 🏛️
```

```
Sequence: Kinetic Harvest → Slipstream → Quick Harvest (any order)
Legendary: GHOST FLOW
Effect: Moving through any grey bullet auto-absorbs it without needing
        to be within absorbRange. Pull range still applies for passive absorb.
Icon: 🌊
```

```
Sequence: Ring Blast picked 3 times
Legendary: CORONA
Effect: All ring shots become homing. Ring shot count caps raised to 12.
Icon: ☀️
```

```
Sequence: Berserker → Dead Man's Trigger → Lifeline (any order)
Legendary: FINAL FORM
Effect: Lifeline now has 2 uses. Dead Man's Trigger activates at ≤2 HP
        (not just 1). Berserker speed bonus increased to ×1.5.
Icon: 💀
```

```
Sequence: Titan Heart × 3 (picked 3 times)
Legendary: COLOSSUS
Effect: Your body becomes a hitbox for enemy projectiles — danger bullets
        that hit you deal 0 damage and are destroyed (not reflected, not
        blocked by shield — just nullified by mass). HP regenerates 1/sec.
Icon: ⬡⬡
```

### Implementation Notes

- `boonHistory` stores boon *names* as strings — check against sequence arrays
- Sequences that require N picks of same boon just check `filter(x => x === name).length >= N`
- "Any order" sequences: check that all required names are present in history, regardless of position
- "Ordered" sequences (if any future ones are added): check that names appear in correct index order
- Legendary cards get a distinct gold border + "LEGENDARY" eyebrow label in the selection UI
- Legendary boons have their own `apply()` and appear as special entries in `getActiveBoonEntries`

---

## Orbit Sphere Upgrades

These are standalone boons that require `orbitSphereTier > 0`:

**Volatile Orbs** — Orbit spheres explode on contact with danger bullets (sphere consumed, small radial output burst). Sphere count decreases; orb count recovers on next room clear.
- UPG field: `volatileOrbs` (bool)

**Charged Orbs** — Orbit spheres fire a mini-shot at nearest enemy every 3s. Inherits output stats.
- UPG field: `chargedOrbs` (bool), runtime `orbFireTimers[]`

**Absorb Orbs** — Grey bullets that cross an orbit sphere's path are absorbed (grants charge).
- UPG field: `absorbOrbs` (bool)

---

## Implementation Phases

### Phase 1 — Dense Core (standalone)
No new systems. Single new boon, new UPG fields, applied in bullet damage calculation.

### Phase 2 — Shield Expansion
Four new boons: Tempered Shield, Mirror Shield, Shield Burst, Barrier Pulse.
Requires: extending shield data structure to carry `hardened` flag, adding reflection + burst logic to shield hit handler.

### Phase 3 — New General Boons (no new systems)
Slipstream, Resonant Absorb, Chain Magnet, Overcharge Vent, Gravity Well, Sliver, Vampiric Return, Lifeline, Berserker, Dead Man's Trigger, Echo Fire, Split Shot, Volatile Rounds.
These only require new UPG fields and additions to boons.js + game loop checks.

### Phase 4 — Evolution System
Extend boon schema with `evolvesWith` + `evolvedVersion`. Update `applyBoon` and `buildMainCards`. Define all pairs from this doc.

### Phase 5 — Legendary Sequences
Add `boonHistory`, `pendingLegendary`, `legendaryOffered` to game state. Implement `checkLegendarySequences`. Add legendary card rendering to `boonSelection.js`. Define all sequences from this doc.

### Phase 6 — Orbit Sphere Upgrades
Requires extending sphere rendering and orbit tick loop. Do last since spheres need the most rendering work.

---

## UPG Fields Summary (new additions)

```js
// Dense Core
denseTier: 0,
denseDamageMult: 1,

// Echo Fire
echoFire: false,

// Split Shot
splitShot: false,

// Volatile Rounds
volatileRounds: false,

// Slipstream
slipTier: 0,
slipChargeGain: 0,

// Resonant Absorb
resonantAbsorb: false,

// Chain Magnet
chainMagnetTier: 0,

// Overcharge Vent
overchargeVent: false,

// Gravity Well
gravityWell: false,

// Tempered Shield
shieldTempered: false,

// Mirror Shield
shieldMirror: false,

// Shield Burst
shieldBurst: false,

// Barrier Pulse
barrierPulse: false,

// Sliver
sliver: false,

// Vampiric Return
vampiric: false,

// Lifeline
lifeline: false,
lifelineUsed: false,

// Berserker
berserker: false,

// Dead Man's Trigger
deadManTrigger: false,

// Orbit Sphere Upgrades
volatileOrbs: false,
chargedOrbs: false,
absorbOrbs: false,
```
