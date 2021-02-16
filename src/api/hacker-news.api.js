const axios = require("axios");

const baseURL = "https://hacker-news.firebaseio.com";
const apiVersion = "v0";

const getItem = async (id) => {
    return axios.get(
        `${baseURL}/${apiVersion}/item/${id}.json?print=pretty`
    );
};

const getTopNews = async (cursor = 0, limit = 5) => {
    const { data: topNewsIds } = await axios.get(
        `${baseURL}/${apiVersion}/topstories.json?print=pretty`
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

module.exports = {
    getTopNews,
};
