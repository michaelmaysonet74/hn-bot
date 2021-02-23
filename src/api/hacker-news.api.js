const axios = require("axios");

const baseURL = "https://hacker-news.firebaseio.com";
const apiVersion = "v0";

const getItem = async (id) =>
    axios.get(`${baseURL}/${apiVersion}/item/${id}.json?print=pretty`);

const getNews = async (
    cursor = 0,
    limit = 10,
    category
) => {
    const { data: newsIds } = await axios.get(
        `${baseURL}/${apiVersion}/${category}.json?print=pretty`
    );

    const index = cursor > newsIds.length
        ? newsIds.length - limit
        : cursor;

    const news = await Promise.all(
        newsIds
            ?.slice(index, index + limit)
            ?.map((id) => getItem(id))
    );

    return news.map(
        ({ data: { title, url } }) => ({ title, url })
    );
};

module.exports = {
    getTopNews: (cursor, limit) => getNews(cursor, limit, "topstories"),
    getBestStories: (cursor, limit) => getNews(cursor, limit, "beststories"),
    getNewStories: (cursor, limit) => getNews(cursor, limit, "newstories"),
};
