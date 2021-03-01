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
  /**
   *
   * @param {string} key
   */
  clearCacheByKey(key) {
    this.store[key] = undefined;
    writeCache(this.store);
  },
  /**
   *
   * @param {string} key
   * @param {object} data
   * @param {number} expTime
   */
  setCacheByKey(key, data, expTime = EXPIRATION_TIME) {
    if (process.env.NODE_ENV === "dev") return;
    this.store[key] ??= {
      value: data,
      createdAt: Date.now(),
      expTime,
    };
    writeCache(this.store);
  },
  /**
   *
   * @param {string} key
   */
  async getCacheByKey(key) {
    if (process.env.NODE_ENV === "dev") return;
    const cache = await readCache();
    const { createdAt = 0, expTime = EXPIRATION_TIME, value } =
      cache?.[key] ?? {};

    if (createdAt + expTime < Date.now()) {
      this.clearCacheByKey(key);
      return;
    }

    return value;
  },
};

module.exports = CacheStore;
