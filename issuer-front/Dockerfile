FROM node:10-alpine as deps

# Create app directory
WORKDIR /usr/src/app

COPY . .

# Update and install some node dependencies
RUN apk update && apk upgrade && \
    apk add --no-cache \
    bash \
    git \
    openssh \
    python \
    make \
    g++ \
    && npm ci


# This stage just builds the app to check it can be build without any errors
FROM deps

WORKDIR /usr/src/app
RUN npm run build

FROM deps

WORKDIR /usr/src/app
RUN npm install http-server-spa -g

EXPOSE 8088

CMD ["bash", "./docker-run.sh"]