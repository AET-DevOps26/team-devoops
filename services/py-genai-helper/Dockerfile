# Stage 1: builder
FROM python:3.12.9-slim-bookworm AS builder
WORKDIR /code

# Installs gcc and other dependencies (libpq-dev provides libpq + pg_config for psycopg2)
RUN apt-get update && apt-get install --no-install-recommends -y gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: run
FROM python:3.12.9-slim-bookworm
WORKDIR /code

# Runtime shared library for psycopg2 (libpq) and wget for the healthcheck
RUN apt-get update && apt-get install --no-install-recommends -y libpq5 wget \
    && rm -rf /var/lib/apt/lists/*

# Copy installed python packages from builder stage
COPY --from=builder /install /usr/local

# Copy current directory into working directory
COPY . .

# Switch user for increased security
RUN adduser --disabled-password --gecos "" user
# The persisted vector store (see rag.py) is written at runtime, so the app user needs write
# access to it; everything else stays read-only to that user.
RUN mkdir -p vector-store && chown -R user:user vector-store
USER user

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_DEBUG=0

# Configure network
EXPOSE 5000

# Healthcheck for orchestration
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s CMD wget -qO- http://127.0.0.1:5000/health || exit 1

# Run app
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
