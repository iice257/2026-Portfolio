export const safeStorage = {
  get(storage, key) {
    try {
      return storage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },
  set(storage, key, value) {
    try {
      storage?.setItem(key, value);
    } catch {
      // Browser privacy modes can block storage; preferences still work in memory.
    }
  },
};
