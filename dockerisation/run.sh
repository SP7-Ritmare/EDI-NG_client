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
template_dir=$(cat config.json | jq -r ".template_dir")
if [ $registry == "null" ]; then
  registry=""
else
  registry="${registry}/"
fi

echo "Registry is ${registry}"

if [ $template_dir != "" ]
then
  template_dir="-v ${template_dir}:/app/src/static/templates"
fi

echo Template dir is $template_dir

cd ..
echo docker run --rm \
  $template_dir \
  --name $imageName \
  ${registry}$imageName

docker run --rm \
  $template_dir \
  --name $imageName \
  ${registry}$imageName \
