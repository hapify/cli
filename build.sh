#!/usr/bin/env bash

DIR=$(cd "$(dirname "$0")"; pwd);

echo "Copy hapify-syntax"
rm -rf $DIR/libs/syntax
mkdir -p $DIR/libs/syntax/src
cp -r $DIR/packages/hapify-syntax/* $DIR/libs/syntax

echo "Build hapify-cli-console..."
echo "... Remove local node_modules"
rm -rf $DIR/node_modules
echo "... Build hapify-cli-console"
cd $DIR/packages/hapify-cli-console
npm install
npm run build-for-cli
echo "... Remove hapify-cli-console node_modules"
rm -rf $DIR/packages/hapify-cli-console/node_modules
echo "... Restore node_modules"
cd $DIR
npm install
