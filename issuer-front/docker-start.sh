# !/usr/bin/env sh

# Copy custom environment, see: 
# https://www.freecodecamp.org/news/how-to-implement-runtime-environment-variables-with-create-react-app-docker-and-nginx-7f9d42a91d70/

cd /var/www;
/bin/bash -c /var/www/create-config-file.sh;
cd /;
http-server-spa /var/www index.html 8088;