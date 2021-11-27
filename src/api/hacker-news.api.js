const axios = require("axios");
const CacheStore = require("../cache");

const Category = {
  BEST: "beststories",
  NEW: "newstories",
  TOP: "topstories",
};

const baseURL = "https://hacker-news.firebaseio.com";
const apiVersion = "v0";

const getItem = async (id) =>
  axios.get(`${baseURL}/${apiVersion}/item/${id}.json?print=pretty`);

const getStoriesIds = async (category) => {
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

const getStories = async (cursor = 0, limit = 10, category) => {
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
    return { title, url };
  });
};

module.exports = {
  getTopStories: (cursor, limit) => getStories(cursor, limit, Category.TOP),
  getBestStories: (cursor, limit) => getStories(cursor, limit, Category.BEST),
  getNewStories: (cursor, limit) => getStories(cursor, limit, Category.NEW),
};
