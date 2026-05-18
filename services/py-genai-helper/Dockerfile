# Stage 1: builder
FROM python:3.12.9-alpine3.21 AS builder
WORKDIR /code

# Installs gcc and other dependencies
RUN apk add --no-cache gcc musl-dev linux-headers

# Install dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: run
FROM python:3.12.9-alpine3.21
WORKDIR /code

# Copy installed python packages from builder stage
COPY --from=builder /install /usr/local

# Copy current directory into working directory
COPY . .

# Switch user for increased security
RUN adduser -D user
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
