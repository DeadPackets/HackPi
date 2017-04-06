#!/bin/bash

sleep 2
ifconfig wlan0 up
ifconfig wlan0 192.168.69.1
tty.js --config /home/pi/HackPi/config/tty-config.json --daemonize
service dhcpd start
sleep 2
service hostapd start