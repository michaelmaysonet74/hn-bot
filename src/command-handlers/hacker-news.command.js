const HackerNewsAPI = require("../api/hacker-news.api");
const { getArgByFlag } = require("../helpers");
const { MessageEmbed } = require("discord.js");

const getIndexArg = (flags) => getArgByFlag(flags, "i") * 1;

const getFilterArg = (flags) => getArgByFlag(flags, "f");

const getCategory = (flags) =>
  flags.map(({ flag }) => flag).find((_) => _.match(/t|b|n/)) ?? "t";

const getResolverByCategory = (category = "t") => {
  return {
    t: {
      handlerTitle: "🥇 Top Stories",
      resolver: HackerNewsAPI.getTopStories,
    },
    b: {
      handlerTitle: "👌🏻 Best Stories",
      resolver: HackerNewsAPI.getBestStories,
    },
    n: {
      handlerTitle: "✨ New Stories",
      resolver: HackerNewsAPI.getNewStories,
    },
  }[category];
};

module.exports = {
  "!hn": async (msg, flags = []) => {
    const indexArg = getIndexArg(flags);
    const filterArg = getFilterArg(flags);
    const category = getCategory(flags);
    const { handlerTitle, resolver } = getResolverByCategory(category);

    const stories = await resolver(
      typeof indexArg === "number" && !isNaN(indexArg) ? indexArg : undefined
    );

    const filteredStories = filterArg
      ? stories.filter(
          ({ title, url }) =>
            title && url && title.match(new RegExp(filterArg, "gi"))
        )
      : stories.filter(({ title, url }) => title && url);

    if (filteredStories.length) {
      const fields = filteredStories.map(({ title, url }) => ({
        name: title,
        value: url,
      }));

      msg.reply(
        new MessageEmbed({
          title: handlerTitle,
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
