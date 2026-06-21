# Multi-stage build for Spring Boot application
# Stage 1: Build stage with Maven
FROM eclipse-temurin:21-jdk-alpine AS builder

# Set working directory
WORKDIR /build

# Copy Maven wrapper scripts and POM file
COPY mvnw mvnw.cmd pom.xml ./

# Copy source code
COPY src ./src

# Build the application using Maven wrapper
# Skip tests for faster builds and use Maven cache optimization
RUN chmod +x mvnw && \
    ./mvnw clean package -DskipTests -q

# Stage 2: Runtime stage
FROM eclipse-temurin:21-jre-alpine

# Create a non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring

# Set working directory
WORKDIR /app

# Copy the built JAR file from the builder stage
COPY --from=builder /build/target/*.jar app.jar

# Change ownership of the application to the non-root user
RUN chown spring:spring /app/app.jar

# Switch to non-root user
USER spring

# Expose the default Spring Boot port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health/liveness || exit 1

# Run the application
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "app.jar"]
