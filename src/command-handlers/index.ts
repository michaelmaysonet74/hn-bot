import HackerNewsCommand from "./hacker-news.command";
import HelpCommand from "./help.command";

export default {
  ...HackerNewsCommand,
  ...HelpCommand,
};
