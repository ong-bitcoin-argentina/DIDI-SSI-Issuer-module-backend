FROM node:10-alpine as build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

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

COPY . .
RUN npm run build

FROM node:10-alpine

RUN npm install http-server-spa -g
COPY docker-start.sh /entrypoint.sh
COPY --from=build /usr/src/app/build /var/www

COPY ./scripts/create-config-file.sh /var/www
COPY .env /var/www

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x /var/www/create-config-file.sh

EXPOSE 8088

#CMD ["http-server-spa", "/var/www", "index.html", "8080"]
CMD ["ash", "entrypoint.sh"]