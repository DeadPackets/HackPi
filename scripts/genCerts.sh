#!/bin/bash

echo "Remember the passphrase you set here!"
echo "This script assumes you are inside the directory scripts/ !!"
echo "WARNING: If you arent in the scripts/ directory, it wont work!"
sleep 5
cd ../
mkdir ssl
cd ssl/
openssl req -new > new.ssl.csr
sudo openssl rsa -in privkey.pem -out server.key
sudo openssl x509 -in new.ssl.csr -out server.cert -req -signkey server.key -days 365
