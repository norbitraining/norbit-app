#!/usr/bin/env bash

if [ "$1" == "dev" ] || [ "$1" == "prod" ] || [ "$1" == "local" ];
then
  ENV=$1;
  cp -rf ".env.$ENV" .env
  echo "Switching to $ENV"
  echo "Finish"
  else
    echo "Missing paramenter, please execute sh set-enviroment.sh dev"
fi
