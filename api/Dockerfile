# Bakes the OpenAPI spec into the Swagger UI image so it can be pulled like any
# other service (no runtime volume/ConfigMap needed).
FROM swaggerapi/swagger-ui:latest

# Served by swagger-ui from this path; SWAGGER_JSON points at it.
COPY openapi.yaml /app/openapi.yaml

ENV SWAGGER_JSON=/app/openapi.yaml
ENV BASE_URL=/docs
