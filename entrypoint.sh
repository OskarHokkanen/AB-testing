#!/bin/sh
set -e

# Create screenshots directory if it doesn't exist and fix permissions
mkdir -p /app/public/screenshots
chmod -R 777 /app/public/screenshots

# Execute the main command
exec "$@"
