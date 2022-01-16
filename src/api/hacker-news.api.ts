/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import axios from "axios";

/* --------------------------------- CUSTOM --------------------------------- */
import CacheStore from "../cache";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */
enum Category {
  BEST = "beststories",
  NEW = "newstories",
  TOP = "topstories",
}

interface Item {
  data: {
    id: string;
    title?: string;
    url?: string;
  };
}

export interface Story {
  title?: string;
  url?: string;
}

/* -------------------------------------------------------------------------- */
/*                                  CONSTANTS                                 */
/* -------------------------------------------------------------------------- */
const baseURL = "https://hacker-news.firebaseio.com";
const apiVersion = "v0";

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */
const getItem = async (id: string): Promise<Item> =>
  axios.get(`${baseURL}/${apiVersion}/item/${id}.json?print=pretty`);

const getStoriesIds = async (category: Category): Promise<string[]> => {
  const cacheKey = `${category.toUpperCase()}_IDS`;
  const cacheStoriesIds = await CacheStore.getCacheByKey(cacheKey);

  if (cacheStoriesIds?.length > 0) {
    return cacheStoriesIds;
  }

  const { data } = await axios.get(
    `${baseURL}/${apiVersion}/${category}.json?print=pretty`
  );

  CacheStore.setCacheByKey(cacheKey, data, 300_000);
  return data;
};

const getStories = async (cursor = 0, limit = 10, category: Category) => {
  const storiesIds = await getStoriesIds(category);

  const index =
    Math.abs(cursor) > storiesIds.length
      ? storiesIds.length - limit
      : Math.abs(cursor);

  const stories = await Promise.all(
    storiesIds?.slice(index, index + limit)?.map((id) => getItem(id))
  );

  return stories.map((story) => {
    const { title, url } = story?.data ?? {};
    return { title, url } as Story;
  });
};

/* -------------------------------------------------------------------------- */
/*                                     API                                    */
/* -------------------------------------------------------------------------- */
export default {
  getTopStories: (cursor: number, limit?: number) =>
    getStories(cursor, limit, Category.TOP),
  getBestStories: (cursor: number, limit?: number) =>
    getStories(cursor, limit, Category.BEST),
  getNewStories: (cursor: number, limit?: number) =>
    getStories(cursor, limit, Category.NEW),
};
