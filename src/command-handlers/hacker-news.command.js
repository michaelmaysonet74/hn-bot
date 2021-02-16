const HackerNewsAPI = require("../api/hacker-news.api");
const { MessageEmbed } = require("discord.js");

module.exports = {
    "!hn": async (msg) => {
        console.log("Command: !hn");
        const topNews = await HackerNewsAPI.getTopNews();
        const description = topNews
            .filter(({ title, url }) => title && url)
            .reduce(
                (acc, { title, url }) => acc + `${title}\n${url}\n\n`,
                ""
            );
        msg.reply(new MessageEmbed({
            title: "Top Stories",
            description,
        }));
    },
};
