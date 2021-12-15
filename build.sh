#!/bin/bash
set -xeo pipefail

rm -rf target

(cd api && npm install --only=prod)

if [ "$CI" == "true" ]
then
	(cd api && npm install --only=dev)
fi

cp -r api target

(cd front && npm install --only=prod)
(cd front && npm install --only=dev)
(cd front && npm run build)

rm -rf target/public/*
cp -r front/dist/* target/public/

if [ "$NODE_ENV" == "production" ]
then
	# Only keep target and package.json because that's all we need, and clean up tests from it
	rm -rf .git .github api front .gitignore README.md target/package-lock.json target/tests target/.eslintrc build.sh
fi
