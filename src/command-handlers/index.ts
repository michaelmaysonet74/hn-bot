/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import { Message } from "discord.js";

/* --------------------------------- CUSTOM --------------------------------- */
import { Flag } from "../helpers";
import HackerNewsCommand from "./hacker-news.command";
import HelpCommand from "./help.command";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */
enum Command {
  HACKER_NEWS = "!hn",
  HELP = "!help",
}

export type CommandHandler = {
  [command in Command]: (msg: Message, flags: Flag[]) => Promise<void>;
};

/* -------------------------------------------------------------------------- */
/*                                     API                                    */
/* -------------------------------------------------------------------------- */
export default {
  ...HackerNewsCommand,
  ...HelpCommand,
} as CommandHandler;
