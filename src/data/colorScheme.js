// Player color customization system
// 8 player-selectable color schemes with full theme adaptation

const PLAYER_COLORS = {
  green: {
    name: 'Ghostly Green',
    hex: '#4ade80',
    light: '#b8ffcc',
    dark: '#22c55e',
    icon: '🟢'
  },
  blue: {
    name: 'Azure',
    hex: '#60a5fa',
    light: '#93c5fd',
    dark: '#2563eb',
    icon: '🔵'
  },
  purple: {
    name: 'Phantom',
    hex: '#c084fc',
    light: '#e9d5ff',
    dark: '#9333ea',
    icon: '🟣'
  },
  pink: {
    name: 'Neon Rose',
    hex: '#f472b6',
    light: '#fbcfe8',
    dark: '#ec4899',
    icon: '💗'
  },
  gold: {
    name: 'Gilded',
    hex: '#fbbf24',
    light: '#fef3c7',
    dark: '#d97706',
    icon: '⭐'
  },
  red: {
    name: 'Crimson',
    hex: '#f87171',
    light: '#fecaca',
    dark: '#dc2626',
    icon: '🔴'
  },
  cyan: {
    name: 'Ice',
    hex: '#67e8f9',
    light: '#a5f3fc',
    dark: '#06b6d4',
    icon: '🧊'
  },
  orange: {
    name: 'Ember',
    hex: '#fb923c',
    light: '#fed7aa',
    dark: '#ea580c',
    icon: '🔥'
  }
};

// Color key order for cycling
const COLOR_KEYS = Object.keys(PLAYER_COLORS);
const COLOR_ASSIST_MODES = {
  off: {
    name: 'Off',
    shortLabel: 'Off',
    description: 'Default live palette.',
    colors: {},
  },
  protanopia: {
    name: 'Protanopia',
    shortLabel: 'Protan',
    description: 'Separates red-green conflicts with stronger cyan, blue, and amber spacing.',
    colors: {
      green: '#2dd4bf',
      blue: '#60a5fa',
      purple: '#8b5cf6',
      pink: '#ec4899',
      gold: '#fde047',
      red: '#f97316',
      cyan: '#7dd3fc',
      orange: '#fb923c',
    },
  },
  deuteranopia: {
    name: 'Deuteranopia',
    shortLabel: 'Deutan',
    description: 'Pushes green-family tones toward teal and warms reds into orange for clearer separation.',
    colors: {
      green: '#14b8a6',
      blue: '#3b82f6',
      purple: '#a78bfa',
      pink: '#f472b6',
      gold: '#facc15',
      red: '#fb923c',
      cyan: '#67e8f9',
      orange: '#ea580c',
    },
  },
  tritanopia: {
    name: 'Tritanopia',
    shortLabel: 'Tritan',
    description: 'Reduces blue-yellow overlap by leaning blues into teal and yellows into warmer coral tones.',
    colors: {
      green: '#4ade80',
      blue: '#14b8a6',
      purple: '#c084fc',
      pink: '#f472b6',
      gold: '#fb7185',
      red: '#f87171',
      cyan: '#34d399',
      orange: '#fb923c',
    },
  },
};
const COLOR_ASSIST_KEYS = Object.keys(COLOR_ASSIST_MODES);
const THREAT_WHEEL = ['green', 'cyan', 'blue', 'purple', 'pink', 'red', 'orange', 'gold'];
const THREAT_ROLE_OFFSETS = {
  danger: 2,
  advanced: 3,
  aggressive: 4,
  elite: 7,
};

let activePlayerColor = 'green';
let activeColorAssistMode = 'off';

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `${r},${g},${b}`;
}

function _hexToRgbObject(hex) {
  return {
    r: parseInt(hex.slice(1,3), 16),
    g: parseInt(hex.slice(3,5), 16),
    b: parseInt(hex.slice(5,7), 16),
  };
}

function _mixHex(baseHex, tintHex, amount) {
  const base = _hexToRgbObject(baseHex);
  const tint = _hexToRgbObject(tintHex);
  const mix = (from, to) => Math.round(from + (to - from) * amount).toString(16).padStart(2, '0');
  return `#${mix(base.r, tint.r)}${mix(base.g, tint.g)}${mix(base.b, tint.b)}`;
}

function _buildSwatch(hex, lightMix = 0.28, darkMix = 0.24) {
  return {
    hex,
    light: _mixHex(hex, '#ffffff', lightMix),
    dark: _mixHex(hex, '#000000', darkMix),
  };
}

function _getThreatWheelKey(baseKey, offset = 0) {
  const start = THREAT_WHEEL.indexOf(baseKey);
  if (start === -1) return 'blue';
  return THREAT_WHEEL[(start + offset + THREAT_WHEEL.length) % THREAT_WHEEL.length];
}

function getColorAssistProfile() {
  return COLOR_ASSIST_MODES[activeColorAssistMode] || COLOR_ASSIST_MODES.off;
}

function getColorSchemeForKey(colorKey) {
  const base = PLAYER_COLORS[colorKey] || PLAYER_COLORS.green;
  const overrideHex = getColorAssistProfile().colors?.[colorKey];
  if(!overrideHex) return base;
  return {
    ...base,
    ..._buildSwatch(overrideHex, 0.28, 0.24),
  };
}

function getThreatPalette() {
  const playerKey = activePlayerColor;
  const dangerKey = _getThreatWheelKey(playerKey, THREAT_ROLE_OFFSETS.danger);
  const advancedKey = _getThreatWheelKey(playerKey, THREAT_ROLE_OFFSETS.advanced);
  const aggressiveKey = _getThreatWheelKey(playerKey, THREAT_ROLE_OFFSETS.aggressive);
  const eliteKey = _getThreatWheelKey(playerKey, THREAT_ROLE_OFFSETS.elite);

  const danger = _buildSwatch(getColorSchemeForKey(dangerKey).hex, 0.32, 0.28);
  const advanced = _buildSwatch(getColorSchemeForKey(advancedKey).hex, 0.24, 0.22);
  const aggressive = _buildSwatch(getColorSchemeForKey(aggressiveKey).hex, 0.24, 0.22);
  const elite = _buildSwatch(getColorSchemeForKey(eliteKey).hex, 0.22, 0.18);
  const siphonHex = _mixHex(advanced.hex, advanced.light, 0.18);

  return {
    dangerKey,
    dangerLabel: PLAYER_COLORS[dangerKey].name,
    advancedKey,
    aggressiveKey,
    eliteKey,
    danger,
    advanced,
    aggressive,
    elite,
    siphon: {
      hex: siphonHex,
      light: _mixHex(siphonHex, '#ffffff', 0.16),
      dark: _mixHex(siphonHex, advanced.dark, 0.45),
    },
  };
}

function applyThemeToDom() {
  if (typeof document === 'undefined' || !document.documentElement) return;
  const s = getPlayerColorScheme();
  const threat = getThreatPalette();
  const root = document.documentElement.style;
  root.setProperty('--accent', s.hex);
  root.setProperty('--accent2', s.dark);
  root.setProperty('--ghost', s.light);
  root.setProperty('--accent-rgb', hexToRgb(s.hex));
  root.setProperty('--ghost-rgb', hexToRgb(s.light));
  root.setProperty('--danger-rgb', hexToRgb(threat.danger.hex));
  root.setProperty('--player-accent', s.hex);
  root.setProperty('--player-accent-light', s.light);
  root.setProperty('--player-accent-dark', s.dark);
  root.setProperty('--player-danger', threat.danger.hex);
}

function emitThemeChange(reason) {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function' || typeof CustomEvent !== 'function') return;
  const detail = {
    reason,
    key: activePlayerColor,
    scheme: getPlayerColorScheme(),
    assistMode: activeColorAssistMode,
    assistProfile: getColorAssistProfile(),
  };
  window.dispatchEvent(new CustomEvent('phantom:theme-change', { detail }));
  if(reason === 'player-color') {
    window.dispatchEvent(new CustomEvent('phantom:player-color-change', { detail }));
  }
  if(reason === 'color-assist') {
    window.dispatchEvent(new CustomEvent('phantom:color-assist-change', { detail }));
  }
}

function setPlayerColor(colorKey) {
  if (!PLAYER_COLORS[colorKey]) {
    console.warn(`Invalid color: ${colorKey}, using default green`);
    colorKey = 'green';
  }
  activePlayerColor = colorKey;
  applyThemeToDom();
  emitThemeChange('player-color');
}

function setColorAssistMode(modeKey) {
  if(!COLOR_ASSIST_MODES[modeKey]) {
    modeKey = 'off';
  }
  activeColorAssistMode = modeKey;
  applyThemeToDom();
  emitThemeChange('color-assist');
  return getColorAssistProfile();
}

function cyclePlayerColor() {
  const idx = COLOR_KEYS.indexOf(activePlayerColor);
  const next = COLOR_KEYS[(idx + 1) % COLOR_KEYS.length];
  setPlayerColor(next);
  return PLAYER_COLORS[next];
}

function getPlayerColorScheme() {
  return getColorSchemeForKey(activePlayerColor);
}

function getPlayerColor() {
  return activePlayerColor;
}

function getColorAssistMode() {
  return activeColorAssistMode;
}

function getColorAssistOptions() {
  return COLOR_ASSIST_KEYS.map((key) => ({
    key,
    name: COLOR_ASSIST_MODES[key].name,
    shortLabel: COLOR_ASSIST_MODES[key].shortLabel,
    description: COLOR_ASSIST_MODES[key].description,
  }));
}

function getColorOptions() {
  return Object.entries(PLAYER_COLORS).map(([key, scheme]) => ({
    key,
    name: scheme.name,
    hex: getColorSchemeForKey(key).hex,
    icon: scheme.icon
  }));
}

export {
  PLAYER_COLORS,
  COLOR_KEYS,
  COLOR_ASSIST_MODES,
  COLOR_ASSIST_KEYS,
  setPlayerColor,
  setColorAssistMode,
  cyclePlayerColor,
  getPlayerColorScheme,
  getColorSchemeForKey,
  getThreatPalette,
  getPlayerColor,
  getColorAssistMode,
  getColorAssistOptions,
  getColorAssistProfile,
  getColorOptions,
  hexToRgb
};
