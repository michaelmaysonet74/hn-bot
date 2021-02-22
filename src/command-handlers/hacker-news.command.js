const HackerNewsAPI = require("../api/hacker-news.api");
const { MessageEmbed } = require("discord.js");

module.exports = {
    "!hn": async (msg) => {
        console.log("Command: !hn");

        const topNews = await HackerNewsAPI.getTopNews();
        const fields = topNews
            .filter(({ title, url }) => title && url)
            .map(({ title, url }) => ({
                name: title,
                value: `${url}`,
            }));

        msg.reply(new MessageEmbed({
            title: "✨ Top Stories",
            fields,
        }));
    },
};
