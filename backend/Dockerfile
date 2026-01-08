# Stage 1: Build (No changes here)
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime with Python Support
FROM eclipse-temurin:25-jdk-alpine
WORKDIR /app

# 1. Install Python 3 and Pip
RUN apk add --no-cache python3 py3-pip

# 2. Setup Virtual Environment (Best practice for Alpine)
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# 3. Install Python Dependencies
# We install pandas and pdfplumber
RUN pip3 install --no-cache-dir pandas pdfplumber openpyxl

# 4. Copy JAR
COPY --from=build /app/target/*.jar app.jar

# 5. Create scripts folder and copy the python script
# (We will create this script in Step 2)
COPY src/main/resources/scripts/result_parser.py /app/result_parser.py

ENTRYPOINT ["java", "-jar", "app.jar"]