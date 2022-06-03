FROM node:16-alpine

COPY . .

RUN npm ci
RUN npm run compile

CMD ["node", "./dist/src/bot.js"]
