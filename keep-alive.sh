#!/bin/bash
while true; do
  node .next/standalone/server.js -p 3000 2>/dev/null
  sleep 1
done
