# Raspberry Piscord 🤖

A HackerNews Discord.js bot that lives in a Raspberry Pi ❤️

![Top Stories](/assets/top-stories.png)

## Getting Started

Pre-requisites

- [node >=15.10](https://nodejs.org/en/)
- [Discord Dev Account](https://discord.com/developers/docs/intro)

Create an `.env` file at the root level of the directory, with the following fields:

```
DISCORD_TOKEN=<Obtainable in the Discord Developers Portal>
BOT_ID=<Raspberry Piscord ID, used to prevent the bot to reply to itself>
```

### Bring the `Raspberry Piscord` Online ⚡️

```
$ npm i
$ npm start
```

### Local Development 💻

```
$ npm run dev
```

## Available Commands 🚀

### !help

Shows available commands.

| Flag | Argument        | Description                                |
| ---- | --------------- | ------------------------------------------ |
| -c   | \<Command Name> | Show more details about specified command. |

### !hn

Get top 10 recent Hacker News stories.

| Flag | Argument           | Description                                         |
| ---- | ------------------ | --------------------------------------------------- |
| -t   | -                  | Get HackerNews Top Stories (Default).               |
| -b   | -                  | Get HackerNews Best Stories.                        |
| -n   | -                  | Get HackerNews NewStories.                          |
| -i   | \<Numerical Index> | Starting point to fetch next 10 HackerNews Stories. |
| -f   | \<Filter>          | Filter HackerNews Stories by title with provided text.  |
