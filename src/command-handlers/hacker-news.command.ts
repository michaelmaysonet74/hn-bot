/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { Message, MessageEmbed } from "discord.js";

/* --------------------------------- CUSTOM --------------------------------- */
import HackerNewsAPI, { Story } from "../api/hacker-news.api";
import {
  Flag,
  STORY_LIMIT_SIZE,
  getArgByFlag,
  sanitizeNumber,
} from "../helpers";

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
const getIndexArg = (flags: Flag[]) => Number(getArgByFlag(flags, "i") ?? 0);

const getFilterArg = (flags: Flag[]) => getArgByFlag(flags, "f");

const getCategory = (flags: Flag[]) =>
  flags.map(({ flag }) => flag).find((_: string) => _.match(/t|b|n/)) ?? "t";

const getResolverByCategory = (
  category: Category
): ResolverByCategory | undefined =>
  ({
    t: {
      icon: "🥇",
      title: "🥇 Top Stories",
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

const getFilteredStories = (stories: Story[], filterArg?: string) =>
  filterArg
    ? stories.filter(
        ({ title, storyUrl }) =>
          title && storyUrl && title.match(new RegExp(filterArg, "gi"))
      )
    : stories.filter(({ title, storyUrl }) => title && storyUrl);

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

    const { icon, title, resolver } =
      getResolverByCategory(category as Category) ?? {};

    if (!resolver) {
      throw new Error("Category not found");
    }

    const stories = await resolver(indexArg);

    const filteredStories = getFilteredStories(stories, filterArg);

    if (filteredStories.length < 1) {
      msg.reply(
        `Bummer! Couldn't find any stories with a title that matches "${filterArg}". 😭`
      );
      return;
    }

    const fields = filteredStories.map(({ title, storyUrl, threadUrl }) => ({
      name: title,
      value: [`Story: ${storyUrl}`, `Comments: ${threadUrl}`],
    }));

    const footer = {
      text: `Next ${STORY_LIMIT_SIZE} ${title}: !hn -${category} -i ${
        indexArg + STORY_LIMIT_SIZE
      }`,
    };

    const embed = new MessageEmbed({
      title: `${icon} ${title}`,
      fields,
      footer,
    });

    msg.reply(embed);
  },
};
