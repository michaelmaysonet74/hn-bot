const axios = require("axios");

const baseURL = "https://hacker-news.firebaseio.com";
const apiVersion = "v0";

const getItem = async (id) =>
  axios.get(`${baseURL}/${apiVersion}/item/${id}.json?print=pretty`);

const getStories = async (cursor = 0, limit = 10, category) => {
  const { data: storiesIds } = await axios.get(
    `${baseURL}/${apiVersion}/${category}.json?print=pretty`
  );

  const index =
    Math.abs(cursor) > storiesIds.length
      ? storiesIds.length - limit
      : Math.abs(cursor);

  const stories = await Promise.all(
    storiesIds?.slice(index, index + limit)?.map((id) => getItem(id))
  );

  return stories.map(({ data: { title, url } }) => ({ title, url }));
};

module.exports = {
  getTopStories: (cursor, limit) => getStories(cursor, limit, "topstories"),
  getBestStories: (cursor, limit) => getStories(cursor, limit, "beststories"),
  getNewStories: (cursor, limit) => getStories(cursor, limit, "newstories"),
};
