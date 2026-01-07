## SSSMS Academic Portal - Phase 5 Documentation
**Module:** Attendance Management (Faculty Operations)
**Date:** January 07, 2026
**Status:** Complete & Stable

## 1. Executive Summary & Context
In Phase 5, we implemented the core operational workflow: **Daily Attendance Tracking**.
Prior to this phase, the system could manage users (Admin) and define academic structures (Allocations), but it lacked daily utility. Phase 5 enabled Faculty members to view their specific class rosters, mark students as Present/Absent, and persist this data to the database.

## 2. Technical Architecture Updates

### 2.1. Database Schema Extensions (MySQL)
We added two normalized tables to handle attendance data efficiently.

*   **`attendance_sessions`**: Represents the "Header" of a lecture.
    *   **Fields:** `id` (PK), `date`, `allocation_id` (FK to `subject_allocations`).
    *   **Purpose:** Groups individual student records under one specific lecture event.
*   **`attendance_records`**: Represents individual student status.
    *   **Fields:** `id` (PK), `session_id` (FK), `student_id` (FK), `status` (Enum).
*   **`AttendanceStatus` (Enum):** Defined as `PRESENT`, `ABSENT`, `LATE`, `EXCUSED`.

### 2.2. Backend Logic (`FacultyService.java`)
Location: `backend/src/main/java/com/sssms/portal/service/FacultyService.java`

We implemented complex business logic to ensure data integrity:
1.  **Roster Filtering:** When a Faculty requests a student list, the service doesn't just return "All Students". It looks up the `ClassBatch` associated with the `SubjectAllocation` ID and filters students who match that specific Year and Department.
2.  **Transactional Batch Save:** The `markAttendance` method is annotated with `@Transactional`. It performs two DB writes (Session + Records list) atomically. If saving records fails, the Session creation is rolled back to prevent orphaned data.

### 2.3. API Endpoints (`FacultyController.java`)
Location: `backend/src/main/java/com/sssms/portal/controller/FacultyController.java`

*   **`GET /api/faculty/allocation/{id}/students`**
    *   **Input:** Allocation ID from the URL path.
    *   **Security:** Only accessible by `ROLE_FACULTY` or `ROLE_ADMIN`.
    *   **Output:** List of `Student` entities (ID, Name, PRN) for the UI roster.
*   **`POST /api/faculty/attendance`**
    *   **Input:** JSON payload with Date, Allocation ID, and List of `{studentId, status}`.
    *   **Output:** Success message string.

## 3. Frontend Implementation (React)

### 3.1. Attendance Sheet UI (`AttendanceSheet.jsx`)
Location: `frontend/src/pages/faculty/AttendanceSheet.jsx`

We built a sophisticated UI component to replace standard HTML forms:
*   **State Management:** Uses local state to map `studentId -> Status`. Defaults all students to `PRESENT` for speed.
*   **Toggle Interaction:** Implemented a one-click toggle button that switches styles (Green/Check vs Red/X) instantly.
*   **User Feedback:** Replaced browser alerts with a custom **Status Banner (Toast)** component that shows success/error messages inline with Lucide icons.

### 3.2. Router Integration (`App.jsx`)
We updated the React Router structure to support dynamic nested routes for the Faculty module.
*   **Route:** `/faculty/attendance/:id`
*   **Logic:** The `:id` parameter captures the `allocationId`, allowing the `AttendanceSheet` component to know which subject/class data to fetch on mount.

## 4. Critical Troubleshooting Log (Context for Future Debugging)

This phase encountered specific integration hurdles. Here is how they were resolved.

### Issue 1: Compiler Error `cannot find symbol class FacultyService`
*   **Context:** After creating the Service and Controller, the backend build failed.
*   **Root Cause:** The `FacultyService` class was either placed in the wrong package path (`controller` instead of `service`) or the `package` declaration at the top of the file did not match the directory structure.
*   **Solution:** Verified file location (`src/main/java/com/sssms/portal/service/`) and corrected package imports.

### Issue 2: `403 Forbidden` on GET Requests
*   **Context:** Testing the new API in Postman returned 403 despite the code looking correct.
*   **Root Cause:** Postman was retaining an old **Cookie (jwt-token)** belonging to the Admin user. The Admin user (depending on strict config) may not have access to Faculty endpoints, or the cookie was stale.
*   **Solution:** Explicitly deleted the cookie in Postman and performed a fresh Login as the Faculty user (`prof.grant`) to generate a correct Role Token.

### Issue 3: Faculty Dashboard Empty
*   **Context:** The UI loaded, but showed "No subjects assigned".
*   **Root Cause:** Docker containers were reset (or `mysql_data` wiped), which deleted the **Allocation Record** linking the Professor to the Subject.
*   **Solution:** Re-ran the Admin Workflow: `POST /api/admin/allocate-subject` to restore the link in the database.

## 5. Current Project State Checklist

| Component | Status           | Details |
| :--- |:-----------------| :--- |
| **Authentication** | Stable           | HttpOnly Cookies, RBAC (Admin/Faculty/Student). |
| **Database** | Persisted      | Users, Profiles, Academic Structure, Attendance Tables active. |
| **Backend** |  Build Passing | Java 25 / Spring Boot 4. All Controllers wired. |
| **Frontend** |  Integrated    | Tailwind UI. Admin & Faculty Dashboards fully functional. |

