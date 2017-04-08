#!/bin/bash

echo "Starting to get tools, this may take a while...."
sleep 2
sudo apt update
sudo apt install macchanger crunch hostapd libpcap-dev libnl-3-dev -y
sudo npm install -g tty.js
cd ../
mkdir tools
cd tools/

