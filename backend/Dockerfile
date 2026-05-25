# =====================================================
# Dockerfile – Spring Boot Backend
# =====================================================
# Place this file inside the /backend directory.
# Render uses this to build and run your Java app.
# =====================================================

# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies first (cached layer)
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests -B

# Stage 2: Run (slim image)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Expose the port Spring Boot listens on
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
