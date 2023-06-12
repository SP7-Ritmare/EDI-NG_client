#!/bin/bash

if ! which jq; then
  echo This script requires the jq package installed in your system
  echo e.g.
  echo "   apt install jq on Ubuntu"
  echo "   brew install jq on MacOS"
  echo Please ionstall it and retry
  exit 1
fi

imageName=$(cat config.json | jq -r ".imageName")
registry=$(cat config.json | jq -r ".registry")
if [ $registry == "null" ]; then
  registry=""
else
  registry="${registry}/"
fi

echo "Registry is ${registry}"

cd ..
docker build -t ${registry}$imageName -f dockerisation/Dockerfile.all-inclusive .
if [ ! $registry == "" ]; then
  docker push ${registry}$imageName
fi
