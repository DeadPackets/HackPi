#!/bin/bash

echo "This script assumes you are inside the directory scripts/ !!"
echo "WARNING: If you arent in the scripts/ directory, it wont work!"
sleep 4
cd ../
mkdir config
cd config/
touch config.json
echo '{ "test": "hello" }' > config.json
sleep 2
echo "Config created but you need to edit it yourself, sorry :/"