#!/bin/bash

/usr/lib/postgresql/14/bin/postgres -D /var/lib/postgresql/14/main -c config_file=/etc/postgresql/14/main/postgresql.conf &
sleep 2
java -jar edi.jar &
sleep 2
node src/index.js
