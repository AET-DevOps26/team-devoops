# Stage 1: builder
FROM eclipse-temurin:21.0.3_9-jdk-alpine AS builder
WORKDIR /app

# Copy dependencies
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Install dependencies
RUN chmod +x ./gradlew
RUN --mount=type=cache,target=/root/.gradle ./gradlew dependencies --no-daemon

# Copy application
COPY src src

# Build application
RUN --mount=type=cache,target=/root/.gradle ./gradlew bootJar --no-daemon

# Stage 2: run
FROM eclipse-temurin:21.0.3_9-jre-alpine
WORKDIR /app

# Copy artifact from stage 1
COPY --from=builder /app/build/libs/*.jar app.jar

# Switch user for increased security
RUN adduser -D user
USER user

# Healthcheck for orchestration
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/actuator/health || exit 1

# Network
EXPOSE 8080

# Run app
ENTRYPOINT ["java", "-jar", "app.jar"]