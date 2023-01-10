#!/bin/bash
screen -S DexWsApi -X quit
screen -dmS DexWsApi
screen -x -S DexWsApi -p 0 -X stuff $'/usr/local/bin/node /opt/build/ws.js'
screen -x -S DexWsApi -p 0 -X stuff $'\n'

echo "重启ws"