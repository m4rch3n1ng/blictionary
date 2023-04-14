#!/usr/bin/env bash

WEB_NAME="blictionary"
DATE=$(date -u +"%Y-%m-%dT%H-%M-%SZ")

[ ! -d ~/.log/$WEB_NAME ] && mkdir -p ~/.log/$WEB_NAME

npm install
npm run web &> ~/.log/$WEB_NAME/$DATE.txt &

echo -e "\n\033[0;36mlog\033[0m" ~/.log/$WEB_NAME/$DATE.txt "\n"
