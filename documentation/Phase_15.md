## SSSMS Academic Portal - Phase 15: Timetable Management

**Module:** Scheduling & Time Management
**Date:** January 09, 2026
**Status:** Complete & Stable

## 1. Executive Summary
Phase 15 addressed the requirement for **Academic Scheduling** (SRS 4.3).
Initially planned as a complex database of time slots, we pivoted to a **Document-Centric Approach** (PDFs) to better match real-world college workflows where timetables are often complex visuals. We implemented a system for Admins to upload schedule documents for specific Classes or Faculty members, which are then rendered securely within the user dashboards.

## 2. Backend Architecture (Data & Logic)

### 2.1. Schema Extension
Instead of creating a complex `TimetableSlot` relational table, we extended existing entities to act as file containers.

*   **`ClassBatch` Entity:** Added `private String timetablePdf`. Stores the filename of the class schedule.
*   **`Faculty` Entity:** Added `private String timetablePdf`. Stores the filename of the professor's personal teaching schedule.

### 2.2. API Implementation (`TimetableController`)
We created a dedicated controller to handle the specific logic of linking files to entities.

*   **Admin Uploads:**
    *   `POST /api/timetable/upload/class`: Links a PDF to a Class ID.
    *   `POST /api/timetable/upload/faculty`: Links a PDF to a Faculty ID.
*   **Context-Aware Retrieval:**
    *   `GET /api/timetable/student/me`: Determines the student's current class year, fetches the linked PDF filename.
    *   `GET /api/timetable/faculty/me`: Fetches the PDF linked to the logged-in professor.
*   **Inline Viewing:**
    *   `GET /api/timetable/view/{fileName}`: Serves the file with `Content-Disposition: inline` so it renders in the browser instead of forcing a download.

### 2.3. Security Hardening & Relaxing
To allow the frontend to embed the PDF inside an `<iframe>`, we had to modify **Spring Security**.

*   **The Issue:** Spring Security defaults to `X-Frame-Options: DENY` to prevent Clickjacking. This blocks `<iframe src="...">`.
*   **The Fix:** We updated `SecurityConfig.java` to disable Frame Options and updated CSP (Content Security Policy) to allow `frame-ancestors 'self'`.

## 3. Frontend Implementation (React)

### 3.1. Admin Management UI (`ManageTimetables.jsx`)
A centralized hub for Admins.
*   **Toggle Interface:** Allows switching between "Class Timetable" and "Faculty Timetable" modes.
*   **Dynamic Dropdowns:** Fetches live lists of Faculty or Classes to ensure files are assigned to valid targets.

### 3.2. PDF Viewers
We created specific views for end-users that embed the PDF directly into the dashboard layout.
*   **`StudentTimetable.jsx`**: Fetches the class schedule.
*   **`FacultyTimetable.jsx`**: Fetches the personal schedule.
*   **UI/UX:** Includes a direct "Download PDF" button for offline access.

## 4. Critical Troubleshooting Log

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **`Refused to display ... X-Frame-Options`** | The Browser blocked the `<iframe src="...">` because the Backend sent a security header forbidding embedding. | Updated `SecurityConfig.java` chain to include `.headers(headers -> headers.frameOptions(frame -> frame.disable()))`. |
| **`cannot find symbol TimetableRequest`** | The Controller imported a DTO class that was planned but never created (since we switched to a `Map` payload). | Removed the unused import from `TimetableController.java`. |
| **Syntax Errors in Security Config** | Copy-pasting code fragments resulted in unreachable statements or nested methods inside the wrong block. | Rewrote the entire `SecurityConfig.java` to ensure proper method chaining and placement of the `.headers()` configuration. |

