#!/bin/bash
set -euo pipefail

# Start script for production Gunicorn server
# Uses environment variables to configure worker count and bind port

PORT=${PORT:-5000}
WORKERS=${WORKERS:-2}

echo "Starting Gunicorn on 0.0.0.0:${PORT} with ${WORKERS} workers"

exec gunicorn --bind 0.0.0.0:${PORT} \
  --workers ${WORKERS} \
  --worker-class gthread \
  --threads 4 \
  --log-level info \
  --access-logfile '-' \
  --error-logfile '-' \
  "app:app"
