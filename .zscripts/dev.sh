#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

log_step() {
        echo "=========================================="
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
        echo "=========================================="
}

start_mini_services() {
        local mini_services_dir="$PROJECT_DIR/mini-services"
        if [ ! -d "$mini_services_dir" ]; then
                return 0
        fi

        for service_dir in "$mini_services_dir"/*; do
                [ -d "$service_dir" ] || continue
                local service_name
                service_name=$(basename "$service_dir")
                [ -f "$service_dir/package.json" ] || continue
                grep -q '"dev"' "$service_dir/package.json" || continue

                echo "[$service_name] Starting in background..."
                (
                        cd "$service_dir"
                        bun install 2>/dev/null
                        exec bun run dev
                ) >"$PROJECT_DIR/.zscripts/mini-service-${service_name}.log" 2>&1 &
                disown "$!" 2>/dev/null || true
        done
}

cd "$PROJECT_DIR"

# Install dependencies
log_step "Installing dependencies..."
bun install 2>/dev/null

# Start mini-services first (they run on separate ports)
start_mini_services

# Start Next.js dev server with auto-restart
log_step "Starting Next.js dev server (with auto-restart)..."
while true; do
        NODE_OPTIONS='--max-old-space-size=1024' npx next dev -p 3000 >> "$PROJECT_DIR/dev.log" 2>&1
        EXIT_CODE=$?
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Dev server exited (code=$EXIT_CODE), restarting in 3s..." >> "$PROJECT_DIR/dev.log" 2>&1
        sleep 3
done &
DEV_PID=$!
disown "$DEV_PID" 2>/dev/null || true

# Wait for server to be ready
echo "Waiting for Next.js dev server on port 3000..."
for i in $(seq 1 60); do
        if curl -s --connect-timeout 2 --max-time 5 "http://localhost:3000" >/dev/null 2>&1; then
                echo "Next.js dev server is ready!"
                break
        fi
        sleep 1
done

# Keep this script running forever so the dev server stays alive
wait $DEV_PID 2>/dev/null || true
