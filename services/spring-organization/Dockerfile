# Stage 1: builder
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy dependencies
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Install dependencies
RUN chmod +x ./gradlew
RUN --mount=type=cache,target=/root/.gradle,sharing=locked ./gradlew dependencies --no-daemon

# Copy application
COPY src src

# Build application
RUN --mount=type=cache,target=/root/.gradle,sharing=locked ./gradlew bootJar --no-daemon

# Stage 2: run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy artifact from stage 1
COPY --from=builder /app/build/libs/*.jar app.jar

# Switch user for increased security
RUN adduser -D user
USER user

# Healthcheck for orchestration
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s CMD wget -qO- http://127.0.0.1:8080/actuator/health || exit 1

# Network
EXPOSE 8080

# Run app
ENTRYPOINT ["java", "-jar", "app.jar"]
