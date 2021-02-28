const fs = require("fs/promises");

const EXPIRATION_TIME = 60_000; // One Minute in Milliseconds
const CACHE_PATH = `${__dirname}/../../cache-store.json`;

const readCache = async () => {
  const data = (await fs.readFile(CACHE_PATH, "utf-8")) || "{}";
  return JSON.parse(data);
};

const writeCache = (data) =>
  fs.writeFile(CACHE_PATH, JSON.stringify(data), "utf-8");

const CacheStore = {
  store: {},
  setCacheByKey(key, item) {
    if (process.env.NODE_ENV === "dev") return;
    this.store[key] ??= {};
    this.store[key].value = item;
    this.store[key].createdAt = Date.now();
    writeCache(this.store);
  },
  async getCacheByKey(key) {
    if (process.env.NODE_ENV === "dev") return;
    const cache = await readCache();
    const { createdAt = 0, value } = cache?.[key] ?? {};
    if (createdAt + EXPIRATION_TIME < Date.now()) {
      this.clearCacheByKey(key);
      return;
    }
    return value;
  },
  clearCacheByKey(key) {
    this.store[key] = undefined;
    writeCache(this.store);
  },
};

module.exports = CacheStore;
