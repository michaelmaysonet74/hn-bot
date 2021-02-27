const CommandHandlers = require("./command-handlers");
const { extractCommandAndFlags, processFlags } = require("./helpers");

const { config } = require("dotenv");
config();

const Discord = require("discord.js");
const client = new Discord.Client();

client.on("message", (msg) => {
  if (!process.env.BOT_ID || msg.author.id === process.env.BOT_ID) return;
  try {
    const { content } = msg;
    const { command, flags } = extractCommandAndFlags(content);
    const processedFlags = processFlags(flags);

    if (process.env.NODE_ENV === "dev") {
      console.log(`Command: ${command}`);
      console.log(
        processedFlags ? `Flags: ${JSON.stringify(processedFlags)}` : ""
      );
    }

    CommandHandlers[command?.toLowerCase()](msg, processedFlags);
  } catch (err) {
    console.error(err);
    msg.reply("Oops! Something went wrong 💔");
  }
});

client.login(process.env.DISCORD_TOKEN);
