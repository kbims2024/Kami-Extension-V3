#!/bin/bash
cd /home/z/my-project
NODE_OPTIONS='--max-old-space-size=1024' bun run dev &
BUN_PID=$!
echo "Server PID: $BUN_PID"

# Wait for server to be ready
for i in $(seq 1 60); do
  if curl -s -m 2 http://localhost:3000/ > /dev/null 2>&1; then
    echo "Server ready after ${i}s"
    break
  fi
  sleep 2
done

# Keepalive loop
while kill -0 $BUN_PID 2>/dev/null; do
  curl -s -m 5 http://localhost:3000/ > /dev/null 2>&1
  sleep 5
done
echo "Server died, exiting"
