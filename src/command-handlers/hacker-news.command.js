const HackerNewsAPI = require("../api/hacker-news.api");
const { getArgByFlag } = require("../helpers");
const { MessageEmbed } = require("discord.js");

const getIndexArg = (flags) => getArgByFlag(flags, "i") * 1;

const getFilterArg = (flags) => getArgByFlag(flags, "f");

const getCategory = (flags) =>
  flags.map(({ flag }) => flag).find((_) => _.match(/t|b|n/)) ?? "t";

module.exports = {
  "!hn": async (msg, flags = []) => {
    console.log("Command: !hn");

    const indexArg = getIndexArg(flags);
    const filterArg = getFilterArg(flags);
    const category = getCategory(flags);

    const topNews = await HackerNewsAPI.getTopNews(
      typeof indexArg === "number" && !isNaN(indexArg) ? indexArg : undefined
    );

    const filteredNews = filterArg
      ? topNews.filter(
          ({ title, url }) =>
            title && url && title.match(new RegExp(filterArg, "gi"))
        )
      : topNews.filter(({ title, url }) => title && url);

    if (filteredNews.length) {
      const fields = filteredNews.map(({ title, url }) => ({
        name: title,
        value: url,
      }));

      msg.reply(
        new MessageEmbed({
          title: "✨ Top Stories",
          fields,
        })
      );
    } else {
      msg.reply(
        `Bummer! Couldn't find any stories with a title that would match with "${filterArg}". 😭`
      );
    }
  },
};
