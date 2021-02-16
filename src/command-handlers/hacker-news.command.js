const HackerNewsAPI = require("../api/hacker-news.api");
const { MessageEmbed } = require("discord.js");

module.exports = {
    "!hacker-news": async (msg) => {
        const topNews = await HackerNewsAPI.getTopNews();
        topNews
            .filter(({ title, url }) => title && url)
            .map(({ title, url }) =>
                new MessageEmbed().setTitle(title).setURL(url)
            )
            .forEach((embed) => msg.channel.send(embed));
    },
};
