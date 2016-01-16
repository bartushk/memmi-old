#!/bin/sh

ssh bartushk@dev.memmi.net <<EOF
    cd ~/memmi
    git pull
    cd app
    npm install --production
    ./node_modules/forever/bin/forever restartall
    exit
EOF
