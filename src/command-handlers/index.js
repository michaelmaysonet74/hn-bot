const HackerNewsCommand = require("./hacker-news.command");
const HelpCommand = require("./help.command");

module.exports = {
    ...HackerNewsCommand,
    ...HelpCommand,
};
