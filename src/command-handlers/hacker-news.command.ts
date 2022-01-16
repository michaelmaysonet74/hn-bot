/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { Message, MessageEmbed } from "discord.js";

/* --------------------------------- CUSTOM --------------------------------- */
import HackerNewsAPI, { Story } from "../api/hacker-news.api";
import { Flag, getArgByFlag, sanitizeNumber } from "../helpers";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */
type Category = "t" | "b" | "n";

interface ResolverByCategory {
  icon: string;
  title: string;
  resolver: (cursor: number, limit?: number) => Promise<Story[]>;
}

/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */
const getIndexArg = (flags: Flag[]) => getArgByFlag(flags, "i") ?? 0 * 1;

const getFilterArg = (flags: Flag[]) => getArgByFlag(flags, "f");

const getCategory = (flags: Flag[]) =>
  flags.map(({ flag }) => flag).find((_: string) => _.match(/t|b|n/)) ?? "t";

const getResolverByCategory = (category: Category): ResolverByCategory =>
  ({
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
  }[category]);

/* -------------------------------------------------------------------------- */
/*                               COMMAND HANDLER                              */
/* -------------------------------------------------------------------------- */
export default {
  "!hn": async (msg: Message, flags = []) => {
    const [indexArg, filterArg, category] = [
      sanitizeNumber(getIndexArg(flags)),
      getFilterArg(flags),
      getCategory(flags),
    ];

    const { icon, title, resolver } = getResolverByCategory(
      category as Category
    );
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
