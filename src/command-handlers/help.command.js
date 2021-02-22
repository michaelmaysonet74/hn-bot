const fs = require("fs/promises");
const { MessageEmbed } = require("discord.js");

const getAvailableCommands = async () => {
    const data = await fs.readFile(`${__dirname}/../../available-commands.json`, "utf-8");
    return JSON.parse(data);
};

module.exports = {
    "!help": async (msg, flags = []) => {
        console.log("Command: !help");

        const availableCommands = await getAvailableCommands();
        const commandArg = flags.find(({ flag }) => flag === "c")?.arg;
        const fields = !commandArg
            ? availableCommands
                .map(({ Command, Description }) => ({
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
