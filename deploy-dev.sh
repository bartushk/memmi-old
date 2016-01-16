#!/bin/sh

ssh bartushk@dev.memmi.net <<EOF
    cd ~/memmi
    git pull
    cd app
    npm install --production
    forever restartall
    exit
EOF
