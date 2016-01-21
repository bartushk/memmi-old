#!/bin/bash
cd `dirname $0`

cd app
npm install
./node_modules/forever/bin/forever stopall
CONFIG=dev ./node_modules/forever/bin/forever start ./app.js
