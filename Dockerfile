FROM node:10-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Update and install some node dependencies
RUN apk update && apk upgrade && \
    apk add --no-cache --virtual .gyp \
        build-base \
        bash \
        git \
        openssh \
        python \
        make \
        g++ \
        && npm --build-from-source install bcrypt \
        && npm ci \
        && apk del .gyp

# Bundle app source
COPY . .

EXPOSE 3500

CMD sleep 10 && npm run start