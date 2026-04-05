const PATCH_NOTES = [
  {
    version: '1.16.4',
    label: 'BALANCE PASS',
    summary: [
      'This build is a direct balance response to late-run telemetry showing that a few stacked systems were overwhelming the room curve long before enemy pressure had a chance to matter. The reserve economy was pulled back so oversized charge pools stop snowballing into permanent uptime, Deep Reserve and Charge Cap Up now top out far earlier, Kinetic Harvest grants flat movement charge instead of multiplying off giant reserves, and Dense Core no longer turns low-cap builds into quite such a reckless damage spike.',
      'The passive safety package was also tightened so survival tools stay valuable without quietly becoming a second primary weapon. Mirror Shield countershots and Aegis Nova bursts now fire as partial-damage responses instead of full-value inherited offense, Charged Orbs fire more slowly, Volatile Orbs have both longer recovery and a shared detonation lockout, and rooms above 80 now answer back with more elites, faster firing enemies, denser reinforcement flow, and a stronger late-game health and speed ramp.'
    ],
    highlights: [
      'Reserve growth reduced: Charge Cap Up is +15% per pick with a hard ceiling, and Deep Reserve now grows slower and caps at +180 flat charge.',
      'Dense Core damage was lowered, the one-cap desperation spike was reduced, and movement charging no longer scales off max charge.',
      'Mirror Shield, Shield Burst, and Aegis Nova still work, but they no longer get to act like free full-power copies of the main gun.',
      'Room 80+ and 120+ now scale harder through elite chance, firing cadence, on-screen count, and reinforcement timing.'
    ]
  },
  {
    version: '1.16.3',
    label: 'HAPPY EASTER',
    summary: [
      'The bloom system was expanded from a single runaway power pick into a cleaner trio of mutually exclusive long-run identities. Late Bloom stayed as the damage route, Swift Bloom became the movement route, and Guard Bloom became the defensive route, with each version carrying a small downside so the payoff reads as a deliberate build direction instead of a free universal upgrade.',
      'This gave long runs a more readable arc. If a run is scaling damage, speed, or defense hard into the late rooms, the player can now see exactly which bloom path is doing the work, what the tradeoff is, and why that build lane was chosen instead of the others.'
    ],
    highlights: [
      'Added three exclusive bloom variants: power, speed, and defense.',
      'Each bloom now carries a subtle tax so the choice has texture instead of only upside.',
      'The active-boon display reports the current bloom bonus and its attached drawback.'
    ]
  },
  {
    version: '1.16.2',
    label: 'THREAT CLEANUP',
    summary: [
      'This patch focused on readability, threat identity, and pruning mechanics that were muddying the arena instead of strengthening it. Transmute and Pulse Mine were removed from the ecosystem, enemy families were pushed back onto the shared hue-shift rules so the selected player color consistently creates the intended visual offset across mobs and hostile projectiles, and triangle shots were enlarged to read faster under pressure.',
      'It also cleaned up a dangerous edge case where triangle wall bursts were visually breaking into harmless-looking grey shots even though they were supposed to stay threatening. Those spawned shots now keep their danger state, which keeps the combat language cleaner and prevents the game from teaching the wrong visual rule.'
    ],
    highlights: [
      'Removed Transmute and Pulse Mine from the boon pool.',
      'Forced enemy and projectile threat palettes to respect the player-color offset everywhere they should.',
      'Triangle projectiles were made larger and their wall-burst followups now remain active danger bullets.',
      'Mirror Tide and Phase Dash were converted into room-limited abilities with cooldowns, preventing infinite abuse loops.'
    ]
  },
  {
    version: '1.16.1',
    label: 'HP COLOR',
    summary: [
      'This update was small but important for cohesion. The player HP presentation stopped using the same hard-coded green for every run and began inheriting the currently selected player accent instead, which keeps the HUD aligned with the chosen character color and makes the whole run presentation feel more intentional.',
      'The warning readability was preserved, so medium and critical health still transition into the existing caution colors rather than becoming too decorative to parse in motion.'
    ],
    highlights: [
      'Player HP now inherits the active player color instead of defaulting to green.',
      'Low-health warning states still shift into yellow and red for clarity.'
    ]
  }
];

const PATCH_NOTES_ARCHIVE_MESSAGE = 'In-client notes currently begin at v1.16.1. Older builds were not archived in this panel.';

export { PATCH_NOTES, PATCH_NOTES_ARCHIVE_MESSAGE };
