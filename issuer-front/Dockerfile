FROM node:10-alpine

WORKDIR /usr/src/app
COPY ["package.json","package-lock.json","./"]
RUN npm install --no-optional
COPY . .
EXPOSE 3502

CMD npm run start