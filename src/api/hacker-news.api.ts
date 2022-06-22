/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import axios from "axios";

/* --------------------------------- CUSTOM --------------------------------- */
import CacheStore from "../cache";
import { DEFAULT_STORY_BATCH_SIZE } from "../helpers";

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
  comments: Thread;
}

export interface Thread {
  url?: string;
}

/* -------------------------------------------------------------------------- */
/*                                  CONSTANTS                                 */
/* -------------------------------------------------------------------------- */
const baseURL = "https://hacker-news.firebaseio.com";
const hackerNewsUrl = "https://news.ycombinator.com";
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

const getStories = async (
  cursor = 0,
  limit = DEFAULT_STORY_BATCH_SIZE,
  category: Category
) => {
  const storiesIds = await getStoriesIds(category);

  const index =
    Math.abs(cursor) > storiesIds.length
      ? storiesIds.length - limit
      : Math.abs(cursor);

  const stories = await Promise.all(
    storiesIds?.slice(index, index + limit)?.map((id) => getItem(id))
  );

  return stories.map((story) => {
    const { id, title, url } = story?.data ?? {};
    return {
      title,
      url,
      comments: {
        url: title && url ? `${hackerNewsUrl}/item?id=${id}` : undefined,
      },
    } as Story;
  });
};

/* -------------------------------------------------------------------------- */
/*                                     API                                    */
/* -------------------------------------------------------------------------- */
export default Object.freeze({
  /**
   * @param cursor Index that determines from which point on to start creating the list of stories
   * @param limit Determines the size of the list of stories to be returned
   * @returns List of Top HackerNews Stories
   */
  getTopStories: (cursor: number, limit?: number) =>
    getStories(cursor, limit, Category.TOP),

  /**
   * @param cursor Index that determines from which point on to start creating the list of stories
   * @param limit Determines the size of the list of stories to be returned
   * @returns List of Best HackerNews Stories
   */
  getBestStories: (cursor: number, limit?: number) =>
    getStories(cursor, limit, Category.BEST),

  /**
   * @param cursor Index that determines from which point on to start creating the list of stories
   * @param limit Determines the size of the list of stories to be returned
   * @returns List of New HackerNews Stories
   */
  getNewStories: (cursor: number, limit?: number) =>
    getStories(cursor, limit, Category.NEW),
});
