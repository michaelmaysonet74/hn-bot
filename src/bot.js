const CommandHandlers = require("./command-handlers");
const Discord = require("discord.js");
require("dotenv").config();

const client = new Discord.Client();

client.on("message", async (msg) => {
    if (msg.author.id === process.env.BOT_ID) return;

    const { content } = msg;
    const [command] = content.split(/\<.*\>/).slice(1);

    try {
        await CommandHandlers[command?.trim()?.toLowerCase()](msg);
    }
    catch (err) {
        console.error(err);
        msg.reply("Oops! Something went wrong 💔");
    }
});

client.login(process.env.DISCORD_TOKEN);
