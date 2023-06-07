FROM node:16-alpine
WORKDIR /app
ADD main.mjs wallet.mjs package.json /app/

RUN npm install --production

CMD [ "npm", "start" ]