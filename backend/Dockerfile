# Multistage Dockerfile for Flask backend (production-ready)
# - Builder stage creates wheels to keep final image small
# - Final stage installs only wheels and runs Gunicorn as unprivileged user

FROM python:3.11-slim AS builder

# Install build tools and pip helpers
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
 && rm -rf /var/lib/apt/lists/*

RUN python -m pip install --upgrade pip setuptools wheel

WORKDIR /wheels
COPY requirements.txt ./requirements.txt

# Build wheels for all requirements (faster repeat builds and smaller final image)
RUN pip wheel --no-cache-dir -r requirements.txt -w /wheels

########################################
FROM python:3.11-slim

RUN adduser --disabled-password --gecos "" appuser || true

WORKDIR /app

# Copy the pre-built wheels from builder
COPY --from=builder /wheels /wheels
COPY requirements.txt ./requirements.txt

# Install from wheels only
RUN python -m pip install --no-cache-dir --no-index --find-links /wheels -r requirements.txt

# Copy application code
COPY . /app

# Add start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Default production port can be overridden with the PORT env var
ENV PORT=5000

# Run as non-root user
USER appuser

# Expose container port (docker run -P or docker-compose with a single port will map it to a random host port)
EXPOSE 5000

CMD ["/start.sh"]
