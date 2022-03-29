/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import fs from "fs/promises";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */
interface Store {
  [key: string]:
    | {
        createdAt: number;
        expTime: number;
        value: string[];
      }
    | undefined;
}

/* -------------------------------------------------------------------------- */
/*                                  CONSTANTS                                 */
/* -------------------------------------------------------------------------- */
const EXPIRATION_TIME = 60_000; // One Minute in Milliseconds
const CACHE_PATH = `${__dirname}/../../cache-store.json`;

/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */
const readCache = async () => {
  const data = (await fs.readFile(CACHE_PATH, "utf-8")) || "{}";
  return JSON.parse(data) as Store;
};

const writeCache = (data: Store) =>
  fs.writeFile(CACHE_PATH, JSON.stringify(data), "utf-8");

/* -------------------------------------------------------------------------- */
/*                                     API                                    */
/* -------------------------------------------------------------------------- */
class CacheStore {
  private store = {} as Store;

  clearCacheByKey(key: string) {
    this.store[key] = undefined;
    writeCache(this.store);
  }

  setCacheByKey(key: string, data: string[], expTime = EXPIRATION_TIME) {
    if (process.env.NODE_ENV === "dev") return;

    this.store[key] ??= {
      value: data,
      createdAt: Date.now(),
      expTime,
    };

    writeCache(this.store);
  }

  async getCacheByKey(key: string) {
    if (process.env.NODE_ENV === "dev") return [];

    const cache = await readCache();
    const { createdAt = 0, expTime = EXPIRATION_TIME, value } =
      cache?.[key] ?? {};

    if (createdAt + expTime < Date.now()) {
      this.clearCacheByKey(key);
      return [];
    }

    return value ?? [];
  }
}

export default new CacheStore();
