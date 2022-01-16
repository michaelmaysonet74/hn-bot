/* -------------------------------------------------------------------------- */
/*                                   IMPORTS                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- THIRD PARTY ------------------------------ */
import fs from "fs/promises";
import { Message, MessageEmbed } from "discord.js";

/* --------------------------------- CUSTOM --------------------------------- */
import { Flag, getArgByFlag } from "../helpers";

/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */
const getCommandArg = (flags: Flag[]) => getArgByFlag(flags, "c");

const getAvailableCommands = async () => {
  const data = await fs.readFile(
    `${__dirname}/../../available-commands.json`,
    "utf-8"
  );
  return JSON.parse(data);
};

/* -------------------------------------------------------------------------- */
/*                               COMMAND HANDLER                              */
/* -------------------------------------------------------------------------- */
export default {
  "!help": async (msg: Message, flags: Flag[] = []) => {
    const availableCommands = await getAvailableCommands();
    const commandArg = getCommandArg(flags);

    const fields = !commandArg
      ? availableCommands.map(({ Command, Description }) => ({
          name: Command,
          value: Description,
        }))
      : availableCommands
          .filter(({ Command }) => Command === commandArg)
          .flatMap(({ Flags }) => Flags)
          .map(({ Usage, Description }) => ({
            name: Usage,
            value: Description,
          }));

    msg.reply(
      new MessageEmbed({
        title: commandArg || "🚀 Available Commands",
        fields,
      })
    );
  },
};
