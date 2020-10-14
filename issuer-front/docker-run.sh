#! /usr/bin/env bash

echo "> Updating .env"
echo $REACT_APP_API_URL >> .env
echo $REACT_APP_VERSION >> .env
cat .env

echo "> Building the app"
npm run build

cd build

http-server-spa . index.html 8088