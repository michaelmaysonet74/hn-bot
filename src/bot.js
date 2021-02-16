const CommandHandlers = require("./command-handlers");
const Discord = require("discord.js");
require("dotenv").config();

const client = new Discord.Client();

client.on("message", (msg) => {
    if (msg.author.id === process.env.BOT_ID) return;
    try {
        const { content } = msg;
        const [command] = content.split(/\<.*\>/).slice(1);
        CommandHandlers[command?.trim()?.toLowerCase()](msg)
    }
    catch (err) {
        console.error(err);
        msg.reply("Oops! Something went wrong 💔");
    }
});

client.login(process.env.DISCORD_TOKEN);
