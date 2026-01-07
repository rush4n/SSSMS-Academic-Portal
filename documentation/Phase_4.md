## SSSMS Academic Portal - Phase 4: Academic Structure & Faculty Workload

**Module:** Academic Management & Resource Allocation
**Date:** January 07, 2026
**Status:** Backend Complete | Frontend Integration Complete

## 1. Executive Summary
Phase 4 marked the transition from "User Management" to "Academic Management." We moved beyond simply creating users to defining the **Academic Structure** of the college.

We modeled Classes, Subjects, and the critical **Allocation Logic** that links a Faculty member to specific subjects. This allows the system to answer the question: *"Who teaches what?"*—the foundation for the upcoming Attendance module.

## 2. Backend Architecture (Data & Logic)

### 2.1. The Academic Data Model
We introduced three new entities to represent the college curriculum:

1.  **`ClassBatch`**: Represents a physical group of students (e.g., "Second Year B.Arch - Div A").
2.  **`Subject`**: Represents the course content (e.g., "History of Architecture", Code: "ARC-201").
3.  **`SubjectAllocation` (The Pivot)**: This is the most critical table. It creates a **Many-to-One** relationship between:
    *   A Faculty Member
    *   A Subject
    *   A Class Batch
    *   *Business Logic:* This allows one professor to teach multiple subjects across different classes.

### 2.2. Automated Data Seeding
To avoid the tedious task of manually creating Classes and Subjects via SQL every time we reset Docker, we implemented **`DataSeeder.java`**.
*   **Mechanism:** Implements `CommandLineRunner`.
*   **Trigger:** Runs automatically when the Spring Boot application starts.
*   **Logic:** Checks if the `subjects` table is empty. If yes, it pre-populates it with standard Architectural subjects and Classes.

### 2.3. The Allocation APIs
We built two specific endpoints to handle workload management:

**A. Admin Endpoint (`POST /api/admin/allocate-subject`)**
*   **Input:** `facultyId`, `subjectId`, `classId`.
*   **Process:** Validates all IDs exist -> Creates a `SubjectAllocation` record -> Saves to DB.

**B. Faculty Endpoint (`GET /api/faculty/my-subjects`)**
*   **Input:** The HttpOnly Cookie (User Context).
*   **Process:**
    1.  Extracts the User ID from the Security Context.
    2.  Queries `SubjectAllocationRepository` for that specific ID.
    3.  Returns a streamlined JSON list (Subject Name, Class Name) for the Dashboard.

## 3. Frontend Implementation (React)

### 3.1. Faculty Dashboard UI
We created a dedicated **Faculty Layout** and **Dashboard** mirroring the Admin's design language.
*   **`FacultyLayout.jsx`:** Provides sidebar navigation specific to professors (Attendance, Uploads).
*   **`FacultyDashboard.jsx`:** A dynamic page that fetches data from `/api/faculty/my-subjects` and renders a **Card Grid**. If a professor has 3 subjects, they see 3 actionable cards.

### 3.2. Router Architecture Repair
We encountered a major structural issue in `App.jsx` where Faculty routes were nested *inside* Admin routes.
*   **The Fix:** We completely decoupled the routing logic. Now, `/admin` and `/faculty` are sibling routes, each protected by their specific `ProtectedRoute` guards.

## 4. Critical Troubleshooting Log (The "Battle Scars")

Phase 4 involved significant debugging of the Security Layer and Docker environment.

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **`403 Forbidden` on Admin Actions** | The JWT Token generation logic was flawed. We were passing `new HashMap<>()` to the generator, so the **Role** was never actually saved inside the Token. | Updated `JwtUtil.java` to explicitly extract the Authority from `UserDetails` and inject it into the Token claims map. |
| **`hasAuthority` Compilation Error** | We tried to use `.hasAuthority("ROLE_A", "ROLE_B")` in `SecurityConfig`. The method only accepts one argument. | Switched to **`.hasAnyAuthority(...)`** which accepts multiple roles (Varargs). |
| **`404 Not Found` on New APIs** | After creating `FacultyController`, Postman returned 404. Docker was using a cached build of the JAR file that didn't contain the new class. | Forced a clean build using `docker-compose up --build` to recompile the Java code. |
| **`Incompatible Types` (Lambda)** | The Java compiler could not infer the type of `Map.of()` inside a Stream being returned as `ResponseEntity`. | Refactored the Controller to use an explicit `List<Map<String, Object>>` construction instead of inline streams. |
| **Database Role Drift** | Due to manual database resets, the User `prof.grant` existed but had `role=NULL` or `STUDENT`, causing Access Denied errors. | Created **`RoleFixer.java`**, a startup script that forces specific email addresses to have the correct `ADMIN` or `FACULTY` role every time the server starts. |

## 5. Security & Stability Improvements

### 5.1. Strict Role Checking
We moved away from the "Magic Prefix" logic of `.hasRole()` (which automatically adds `ROLE_`) to the explicit **`.hasAuthority()`**.
*   **Why:** This eliminates ambiguity. We know exactly what string is in the database (`ROLE_ADMIN`) and we check for exactly that string.

### 5.2. Docker Persistence
We switched the Database Volume mapping from an internal Docker Volume to a local folder (`./mysql_data`).
*   **Benefit:** We can now visualize the database size and state directly from the file explorer, and "wiping" the database is as simple as deleting this folder.

## 6. Current System Status

*   **Academic Structure:** Defined and Seeded.
*   **Faculty-Subject Linking:** Functional.
*   **Faculty Dashboard:** Visualizes real data from the DB.
*   **Security:** Robust (HttpOnly Cookies + Explicit Authority Checks).

