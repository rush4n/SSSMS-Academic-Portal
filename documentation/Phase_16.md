## SSSMS Academic Portal - Phase 16: Exam Schedule Management

**Module:** Examination & Scheduling
**Date:** January 09, 2026
**Status:** Complete

## 1. Executive Summary
Phase 16 fulfilled the requirement to distribute **Examination Schedules** digitally. Similar to Phase 15 (Timetables), we opted for a **Document-Centric Approach**. Instead of manually entering every exam date/time into a complex database, Admins and Faculty can upload the official Exam Schedule PDF for a specific class year. Students then view this document embedded directly in their dashboard.

## 2. Backend Architecture (Data & Logic)

### 2.1. Schema Update
We extended the `ClassBatch` entity to store the reference to the exam schedule file.
*   **Field:** `private String examSchedulePdf;`
*   **Purpose:** Stores the unique filename (UUID) of the uploaded PDF stored in the `/uploads` directory.

### 2.2. API Implementation (`ExamController`)
We created a dedicated controller to handle the upload and retrieval logic, separating it from general Timetables for clarity.

*   **`POST /api/exams/upload`**:
    *   **Access:** `ROLE_ADMIN`, `ROLE_FACULTY`.
    *   **Logic:** Receives a file and `classId`. Saves file to disk -> Updates `ClassBatch` record.
*   **`GET /api/exams/student/me`**:
    *   **Access:** `ROLE_STUDENT`.
    *   **Logic:** Determines the student's current academic year -> Fetches the schedule PDF linked to that specific year.
*   **`GET /api/exams/view/{fileName}`**:
    *   **Access:** Public (Protected by random UUID filename).
    *   **Logic:** Streams the PDF content to the browser with `Content-Disposition: inline`.

### 2.3. Security Configuration
Updated `SecurityConfig.java` to whitelist the new endpoints.
*   Allowed `GET /api/exams/classes` (Dropdown population) for Admins/Faculty.
*   Allowed `POST /api/exams/upload` for Admins/Faculty.

## 3. Frontend Implementation (React)

### 3.1. Unified Upload Interface (`UploadExamSchedule.jsx`)
We built a reusable component for both Admins and Faculty.
*   **Class Selection:** Dropdown fetches all active Class Batches from the backend.
*   **File Handling:** Drag-and-drop zone restricted to `.pdf` files.
*   **Feedback:** Toast notifications for success/failure.

### 3.2. Student Viewer (`StudentExamSchedule.jsx`)
*   **Context-Aware:** Automatically fetches the schedule relevant to the logged-in student.
*   **Embedded View:** Uses an `<iframe>` to render the PDF directly in the browser (Security headers were relaxed in Phase 15 to allow this).
*   **Fallback:** Displays a clean "No schedule announced" message if no file is found.

### 3.3. Dashboard Integration
*   **Admin Dashboard:** Added "Exam Schedules" card pointing to the upload tool.
*   **Faculty Dashboard:** Updated "Upload Exam Schedule" card to point to the upload tool.
*   **Student Dashboard:** Linked the "Exam Schedule" card to the viewer.

## 4. Critical Troubleshooting Log

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **`403 Forbidden` on Upload** | The new `ExamController` endpoints were not registered in `SecurityConfig`. | Added `.requestMatchers("/api/exams/**")` rules to the security chain. |
| **`cannot find symbol TimetableRequest`** | During code generation, an unused import from a previous phase was copy-pasted into the new controller. | Cleaned up imports in `ExamController.java`. |
| **PDF Download instead of View** | The browser was forcing a download because the `Content-Disposition` header was set to `attachment`. | Changed the header to `inline` in the `viewFile` API method. |





