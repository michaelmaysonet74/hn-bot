const CommandHandlers = require("./command-handlers");
const Discord = require("discord.js");
const client = new Discord.Client();

client.on("message", (msg) => {
    const { content } = msg;
    const [command, ...args] = content.split(/\<.*\>/).slice(1);
    try {
        CommandHandlers[command?.trim()?.toLowerCase()](msg);
    }
    catch (err) {
        console.error(err);
    }
});

require("dotenv").config();
client.login(process.env.DISCORD_TOKEN);
