const Discord = require("discord.js");
const client = new Discord.Client();
const botMsg = "beep boop! 🤖";

require("dotenv").config();

client.on("ready", () => {
    console.log(botMsg);
});

client.on("message", (msg) => {
    const { author, content } = msg;
    const commands = content.split(/\<.*\>/).slice(1);

    if (commands.join(", ").toLowerCase().match(/ping$/)) {
        console.log(author);
        msg.reply(`pong...${botMsg}`);
    }
});

client.login(process.env.DISCORD_TOKEN);
