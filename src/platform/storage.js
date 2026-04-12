function getStorage() {
  if(typeof localStorage === 'undefined') return null;
  return localStorage;
}

function readText(key, fallback = '') {
  const storage = getStorage();
  if(!storage) return fallback;
  try {
    const value = storage.getItem(key);
    return typeof value === 'string' ? value : fallback;
  } catch {
    return fallback;
  }
}

function writeText(key, value) {
  const storage = getStorage();
  if(!storage) return false;
  try {
    storage.setItem(key, String(value));
    return true;
  } catch {
    return false;
  }
}

function readJson(key, fallback = null) {
  const raw = readText(key, '');
  if(!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  const storage = getStorage();
  if(!storage) return false;
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function removeKey(key) {
  const storage = getStorage();
  if(!storage) return false;
  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export { readText, writeText, readJson, writeJson, removeKey };
