#!/bin/bash
while true; do
  if ! curl -s http://localhost:3000 -o /dev/null 2>/dev/null; then
    echo "Server down, restarting..." >> /home/z/my-project/keepalive.log
    npx next dev -p 3000 >> /home/z/my-project/dev.log 2>&1 &
  fi
  sleep 5
done
