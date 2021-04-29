#!/bin/bash
set -xeo pipefail

rm -rf target

(cd api && npm install)
cp -r api target

(cd front && npm install --only=prod)
(cd front && npm install --only=dev)
(cd front && npm run build)

rm -rf target/public/*
cp -r front/dist/* target/public/

if [ "$NODE_ENV" == "production" ]
then
	rm -rf api front
fi
