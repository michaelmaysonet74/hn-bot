const HackerNewsAPI = require("../api/hacker-news.api");
const { getArgByFlag, sanitizeNumber } = require("../helpers");
const { MessageEmbed } = require("discord.js");

const getIndexArg = (flags) => getArgByFlag(flags, "i") * 1;

const getFilterArg = (flags) => getArgByFlag(flags, "f");

const getCategory = (flags) =>
  flags.map(({ flag }) => flag).find((_) => _.match(/t|b|n/)) ?? "t";

const getResolverByCategory = (category = "t") => {
  return {
    t: {
      icon: "🥇",
      title: "Top Stories",
      resolver: HackerNewsAPI.getTopStories,
    },
    b: {
      icon: "👌🏻",
      title: "Best Stories",
      resolver: HackerNewsAPI.getBestStories,
    },
    n: {
      icon: "✨",
      title: "New Stories",
      resolver: HackerNewsAPI.getNewStories,
    },
  }[category];
};

module.exports = {
  "!hn": async (msg, flags = []) => {
    const indexArg = sanitizeNumber(getIndexArg(flags));
    const filterArg = getFilterArg(flags);
    const category = getCategory(flags);

    const { icon, title, resolver } = getResolverByCategory(category);
    const stories = await resolver(indexArg);

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
          footer: {
            text: `Next 10 ${title}: !hn -${category} -i ${indexArg + 10}`,
          },
          title: `${icon} ${title}`,
          fields,
        })
      );
    } else {
      msg.reply(
        `Bummer! Couldn't find any stories with a title that matches "${filterArg}". 😭`
      );
    }
  },
};
