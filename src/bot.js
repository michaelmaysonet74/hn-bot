const Discord = require("discord.js");
const client = new Discord.Client();

require("dotenv").config();

client.on("ready", () => {
    console.log("beep boop! 🤖");
});

client.on("message", (msg) => {
    const { author, content, reply } = msg;

    if (content.match(/ping/gi)) {
        console.log(author);
        reply("pong...beep boop! 🤖");
    }
});

client.login(process.env.DISCORD_TOKEN);
