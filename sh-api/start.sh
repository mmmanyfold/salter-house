#!/bin/sh

echo "starting redis server..."
redis-server --daemonize yes
echo "starting java server..."
java -jar /usr/src/app/sh-api.jar
