const EXPIRATION = 10 * 60 * 1000; // 10 min

export function saveCache(key, data) {
  const payload = {
    data,
    time: Date.now()
  };
  localStorage.setItem(key, JSON.stringify(payload));
}

export function getCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (Date.now() - parsed.time > EXPIRATION) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data;

  } catch {
    return null;
  }
}