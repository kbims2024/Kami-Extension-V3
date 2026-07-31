#!/bin/bash
while true; do
  node .next/standalone/server.js -p 3000
  echo "Server crashed, restarting in 2s..."
  sleep 2
done
