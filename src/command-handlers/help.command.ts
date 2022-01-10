import { getArgByFlag } from "../helpers";
import fs from "fs/promises";
import { Message, MessageEmbed } from "discord.js";

const getCommandArg = (flags) => getArgByFlag(flags, "c");

const getAvailableCommands = async () => {
  const data = await fs.readFile(
    `${__dirname}/../../available-commands.json`,
    "utf-8"
  );
  return JSON.parse(data);
};

export default {
  "!help": async (msg: Message, flags: string[] = []) => {
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
