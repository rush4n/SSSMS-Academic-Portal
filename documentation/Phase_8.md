## SSSMS Academic Portal - Phase 8: Student Resource Access & Logic Optimization

**Module:** Content Consumption & Data Aggregation
**Date:** January 08, 2026
**Status:** Complete & Stable

## 1. Executive Summary
Phase 8 focused on two key areas:
1.  **Closing the Content Loop:** We enabled Students to access the study materials uploaded by Faculty in Phase 7. This involved complex backend logic to resolve relationships between a Student's Year and the Subject Code without direct ID references.
2.  **Data Integrity Refactor:** We discovered and fixed a logic flaw in the Student Dashboard where subjects appeared as duplicate cards. We implemented an aggregation strategy to merge data points correctly.

## 2. Backend Architecture (Data & Logic)

### 2.1. The Resource Lookup API
We created a specialized endpoint that allows students to fetch files based on context rather than specific IDs.

*   **Endpoint:** `GET /api/student/resources/{subjectCode}`
*   **The Challenge:** A student knows they are studying "ARC-201". They do *not* know the internal `SubjectAllocationID` (e.g., ID 55) that links the Professor to that class.
*   **The Logic:**
    1.  Find the Student's `CurrentYear` (e.g., 3).
    2.  Search `SubjectAllocationRepository` for an allocation that matches **Subject Code "ARC-201"** AND **Class Semester 3**.
    3.  Use that derived Allocation ID to fetch files from `ResourceRepository`.

### 2.2. The Aggregation Refactor (`StudentService.java`)
**Problem:** If a subject was allocated twice (e.g., separate Theory and Lab allocations) or logic overlapped, the Student Dashboard rendered two separate cards for the same subject, crashing the UI with duplicate keys.
**Solution:** We rewrote `getMyAttendance` to use a **HashMap Aggregation Strategy**.
*   **Key:** Subject Code.
*   **Logic:** As we iterate through allocations, we check if the Subject Code already exists in the Map. If yes, we **sum** the total lectures and attended lectures into the existing entry instead of creating a new one.

## 3. Frontend Implementation (React)

### 3.1. Study Materials UI (`StudentResources.jsx`)
We built a dedicated view for students to access files.
*   **Dynamic Routing:** Accessed via `/student/resources/:subjectCode`.
*   **Secure Download:** Uses the same Blob-based download mechanism as the Faculty portal to stream files securely without exposing direct server paths.
*   **Empty States:** Handles scenarios where no files exist with a clean UI message.

### 3.2. Dashboard Integration
*   Updated `StudentDashboard.jsx` to include a "View Materials" button on every subject card.
*   Fixed React `key` prop issues by using index-based keys or unique subject codes.

## 4. Critical Troubleshooting Log

Phase 8 involved significant debugging of Business Logic and Java Compilation.

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **`Duplicate Keys` in React** | The API returned multiple objects for the same Subject Code, causing React to crash when rendering the list. | Refactored `StudentService` to aggregate/merge duplicate subject entries into a single DTO using a HashMap. |
| **"No Materials Found" (Logic Error)** | The Backend returned an empty list because the Student's `CurrentYear` (2) did not match the Class's `CurrentSemester` (3). | Updated the Student's profile in the database to match the academic year of the enrolled course. |
| **`package ... does not exist`** | The `StudentAttendanceDTO` class was moved to the main `dto` package, but the Service was still looking for it in `dto.response`. | Corrected the package declaration inside the DTO file and the import statement in the Service file. |
| **`cannot find symbol` (Repositories)** | `StudentController` attempted to use `ResourceRepository` without declaring it as a `final` field or importing it. | Added the necessary dependency injections and imports to the Controller. |

## 5. Current System Status

*   **File System:** Faculty Upload -> Host Storage -> Student Download (End-to-End working).
*   **Analytics:** Attendance calculation is now robust and handles duplicate allocations gracefully.
*   **Stability:** High. No "Duplicate Key" crashes or "403" errors remaining.

