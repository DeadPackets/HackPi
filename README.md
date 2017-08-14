# Note: This is unfinished! (Full rewrite of server backend in progress)
# HackPi - Portable Hacking Mothership

### Overview
---
HackPi is a NodeJS project to turn a raspberry pi running kali into a fully portable hacking device.


### Features
---
- Realtime updates using Socket.io
- Online terminal with https (auto starts on boot)
- Access point for connectivity that starts on boot
- System stats
- Map out surrounding network in a network graph
- Listing available network interfaces
- Nmap scans (all kinds of them)

### Todo
---
- Work on at least inital client side
- Client side system information (Done, just needs to be inserted into client)
- Listing available WiFi points (90% done)
- Running WPSPixie against WiFi points
- Mass WiFi Jamming
- Ability to track down running processes (If I run a mass wifi jamming attack, I want to be able to stop it even if I refresh the page)
- Listing available bluetooth devices + attacks + functionality (turning bluetooth on/off)
- WiFi interface functionality (bringing interfaces up or down, randomizing mac, etc)
- Bluetooth attacks
- Network attacks (Everything from ping flood to MiTM)
- KarmaAP attack with Captive Portal (Credits to mana-toolkit by SensePost)

