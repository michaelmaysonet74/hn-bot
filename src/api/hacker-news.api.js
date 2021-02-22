const axios = require("axios");

const baseURL = "https://hacker-news.firebaseio.com";
const apiVersion = "v0";

const getItem = async (id) =>
    axios.get(`${baseURL}/${apiVersion}/item/${id}.json?print=pretty`);

const getNews = async (cursor, limit, category) => {
    const { data: topNewsIds } = await axios.get(
        `${baseURL}/${apiVersion}/${category}.json?print=pretty`
    );
    const topNews = await Promise.all(
        topNewsIds
            ?.slice(cursor, cursor + limit)
            ?.map((id) => getItem(id))
    );
    return topNews.map(
        ({ data: { title, url } }) => ({ title, url })
    );
};

const getTopNews = (
    cursor = 0,
    limit = 10
) => getNews(cursor, limit, "topstories");

const getBestStories = (
    cursor = 0,
    limit = 10
) => getNews(cursor, limit, "beststories");

const getNewStories = (
    cursor = 0,
    limit = 10
) => getNews(cursor, limit, "newstories");

module.exports = {
    getTopNews,
    getBestStories,
    getNewStories,
};
