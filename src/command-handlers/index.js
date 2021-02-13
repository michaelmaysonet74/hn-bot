const HackerNewsCommand = require("./hacker-news.command");

module.exports = {
    ...HackerNewsCommand,
    "!ping": (msg) => msg.reply("pong"),
    "!help": (msg) => console.log(msg),
};
