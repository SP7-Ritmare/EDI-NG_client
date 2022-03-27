#!/bin/bash

read message
git add . && \
git commit -m "$message" && \
IMAGE_NAME=fabiopav/edi-ng_client && \
npm version patch && \
VERSION=$(cat package.json | jq -r ".version") && \
docker build -t $IMAGE_NAME:$VERSION -t $IMAGE_NAME:latest && \
docker push $IMAGE_NAME:$VERSION
docker push $IMAGE_NAME:latest
