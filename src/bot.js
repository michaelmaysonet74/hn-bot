const CommandHandlers = require("./command-handlers");
const { extractCommandAndFlags, processFlags } = require("./helpers");

const { config } = require("dotenv");
config();

const Discord = require("discord.js");
const client = new Discord.Client();

client.on("message", (msg) => {
  if (msg.author.id === process.env.BOT_ID) return;
  try {
    const { content } = msg;
    const { command, flags } = extractCommandAndFlags(content);
    const processedFlags = processFlags(flags);
    CommandHandlers[command?.toLowerCase()](msg, processedFlags);
  } catch (err) {
    console.error(err);
    msg.reply("Oops! Something went wrong 💔");
  }
});

client.login(process.env.DISCORD_TOKEN);
