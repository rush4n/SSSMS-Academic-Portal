## SSSMS Academic Portal - Phase 1 Documentation
**Module:** Infrastructure & Environment Initialization
**Date:** November 25, 2025
**Status:** Complete & Stable

## 1. Executive Summary
Phase 1 focused on establishing a **containerized, microservices-style architecture**. The objective was to create a "write once, run anywhere" environment where the Frontend (React), Backend (Spring Boot), and Database (MySQL) run in isolated containers but communicate seamlessly via a private Docker network.

## 2. Technology Stack & Versioning
**Note to Future AI:** This project uses "Bleeding Edge" versions. Standard configurations may not apply.

*   **Orchestration:** Docker Compose (v3.8+)
*   **Backend:**
    *   **Language:** Java 25 (LTS) - *Requires specific Docker images.*
    *   **Framework:** Spring Boot 4.0.0 (Snapshot/Milestone) - *Requires custom Maven repositories.*
    *   **Build Tool:** Maven 3.9+
*   **Frontend:**
    *   **Framework:** React 18
    *   **Build Tool:** Vite (v5+)
    *   **Runtime:** Node.js 20 (Alpine Linux)
*   **Database:** MySQL 8.0 Community Server

## 3. Directory Structure & Architecture
We implemented a modular monorepo structure.

```text
sssms-portal/
├── backend/            # Spring Boot Application
│   ├── src/
│   ├── Dockerfile      # Custom Multi-stage Build for Java 25
│   └── pom.xml         # Includes Spring Milestone Repos
├── frontend/           # React Application
│   ├── src/
│   ├── Dockerfile      # Node Alpine Build
│   └── vite.config.js  # Configured for 0.0.0.0 binding
├── mysql_data/         # Host-mapped persistence folder (Do not commit to Git)
├── docker-compose.yml  # The "Brain" of the infrastructure
└── .gitignore          # Ignores target/, node_modules/, and mysql_data/
```

## 4. Implementation Details

### 4.1. Backend Containerization (Java 25 Strategy)
**The Challenge:** Standard Docker images (e.g., `maven:3.8-openjdk-17`) do not support Java 25. Using them results in "Unsupported Class Version" errors.
**The Solution:** We implemented a multi-stage `Dockerfile` using **Eclipse Temurin** images, which provide early access/LTS support for Java 25.

*   **Stage 1 (Build):** `FROM maven:3.9-eclipse-temurin-25 AS build`
*   **Stage 2 (Runtime):** `FROM eclipse-temurin:25-jdk-alpine`
*   **Maven Config:** We modified `pom.xml` to include the `spring-milestones` and `spring-snapshots` repositories, as Spring Boot 4.0.0 is not yet on Maven Central.

### 4.2. Frontend Networking (Vite & Docker)
**The Challenge:** Vite runs on `localhost` (`127.0.0.1`) by default. Inside a Docker container, `localhost` refers to the container itself, not the external world. This made the app inaccessible from the browser.
**The Solution:**
1.  Modified `vite.config.js` to set `server: { host: true }`. This binds the server to `0.0.0.0`, allowing external access.
2.  Configured `docker-compose.yml` to use **Volumes** (`./frontend:/app`). This enables **Hot Reloading** (HMR)—changes made in VS Code are immediately reflected in the running container without rebuilding.

### 4.3. Database Persistence Strategy
**The Challenge:** Docker containers are ephemeral. Restarting the stack destroys the container's internal filesystem, wiping all User and Student data.
**The Solution:** Host Volume Mapping.
*   **Config:** `volumes: - ./mysql_data:/var/lib/mysql`
*   **Impact:** MySQL now stores its binary data files in the local `mysql_data` folder on the host machine. This ensures data persistence across restarts and allows developers to inspect storage usage.

## 5. Critical Issue Resolution: The Race Condition

This was the primary stability blocker encountered in Phase 1.

### The Symptom
On `docker-compose up`, the Backend container would crash immediately with:
`com.mysql.cj.jdbc.exceptions.CommunicationsException: Communications link failure`
or
`org.hibernate.HibernateException: Unable to determine Dialect`

### The Root Cause
1.  **Spring Boot** initializes very fast (~3-5 seconds).
2.  **MySQL** takes significant time (~15-30 seconds) on first launch to initialize the data directory, create the `root` user, and open the port.
3.  Spring Boot attempted to connect at Second 4. MySQL refused the connection. Spring Boot panicked and crashed.

### The Fix: Docker Healthchecks
We modified `docker-compose.yml` to strictly enforce startup order using a **Health Check Dependency**.

**1. Define Healthy for MySQL:**
We told Docker to run a ping command inside the MySQL container every 10 seconds.
```yaml
sssms-db:
  healthcheck:
    test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
    timeout: 10s
    retries: 10
```

**2. Enforce Dependency on Backend:**
We told the Backend *not* to start until MySQL reports "Healthy".
```yaml
backend:
  depends_on:
    sssms-db:
      condition: service_healthy  # <--- Critical Configuration
```

**Result:** The Backend now sits in a "Created" state until MySQL is fully ready to accept connections, guaranteeing a 100% successful startup.

## 6. Infrastructure Configuration (`docker-compose.yml`)

The final, stable configuration established in Phase 1:

```yaml
version: '3.8'

services:
  # --- Database Service ---
  sssms-db:
    image: mysql:8.0
    container_name: sssms_mysql
    restart: always
    environment:
      MYSQL_DATABASE: sssms_portal_db
      MYSQL_ROOT_PASSWORD: root_password
    ports:
      - "3307:3306" # Mapped to 3307 to avoid conflict with local MySQL
    volumes:
      - ./mysql_data:/var/lib/mysql # Host persistence
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 10s
      retries: 10

  # --- Backend Service ---
  backend:
    build: ./backend
    container_name: sssms_backend
    ports:
      - "8080:8080"
    depends_on:
      sssms-db:
        condition: service_healthy # Prevents Race Condition
    environment:
      SPRING_DATASOURCE_PASSWORD: root_password

  # --- Frontend Service ---
  frontend:
    build: ./frontend
    container_name: sssms_frontend
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app       # Syncs code for Hot Reloading
      - /app/node_modules     # Preserves container dependencies
    stdin_open: true
    tty: true
```

