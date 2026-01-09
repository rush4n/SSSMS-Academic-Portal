## SSSMS Academic Portal - Phase 17: Student Profile Management

**Module:** Identity & Personal Data
**Date:** January 09, 2026
**Status:** Complete

## 1. Executive Summary
Phase 17 addressed the need for students to verify and view their own academic record. We implemented a dedicated **Student Profile** page that aggregates personal information (Name, Contact, PRN) with calculated academic metrics (CGPA, Attendance).

This phase reinforced the principle of **Data Isolation**—students can only view their own profile, and cannot modify sensitive fields (like PRN or CGPA) directly, ensuring data integrity.

## 2. Backend Architecture (Data & Logic)

### 2.1. The Profile API (`StudentController`)
We created a specialized endpoint to serve aggregated profile data.
*   **Endpoint:** `GET /api/student/profile`
*   **Access:** `ROLE_STUDENT` only.
*   **Security:** Uses `@AuthenticationPrincipal` to derive the Student ID from the session cookie, preventing IDOR (Insecure Direct Object Reference) attacks.

### 2.2. Service Logic (`StudentService.java`)
The `getProfile()` method performs a multi-step aggregation:
1.  **Identity Fetch:** Retrieves the `Student` entity for personal details (Name, Address, PRN).
2.  **Attendance Calc:** Reuses the logic from Phase 6 (`getMyAttendance`) to calculate an average attendance percentage across all enrolled subjects.
3.  **CGPA Calc:** Queries the `ExamResultRepository` to fetch all historical grades and calculates the mathematical average (SGPA -> CGPA).

### 2.3. Data Transfer Object (`StudentProfileResponse`)
We created a flat DTO to send this combined data to the frontend, keeping the internal entity structure hidden.
*   Fields: `firstName`, `lastName`, `email`, `prn`, `department`, `currentYear`, `phoneNumber`, `address`, `dob`, `overallAttendance`, `cgpa`.

## 3. Frontend Implementation (React)

### 3.1. Profile UI (`StudentProfile.jsx`)
We built a read-only dashboard view following the established design language.
*   **Hero Section:** Displays the student's avatar and primary identity.
*   **Stats Grid:** Two cards showing "Current GPA" and "Overall Attendance" for quick status checks.
*   **Detail Form:** A structured, read-only layout displaying contact and academic details.

### 3.2. Integration
*   Updated `StudentLayout.jsx` to link the "My Profile" sidebar item to the new route.
*   Updated `App.jsx` to register the route `/student/profile`.

## 4. Critical Troubleshooting Log

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **`package ... does not exist`** | The `StudentProfileResponse` DTO was created in a nested sub-package `dto.response` which Docker failed to pick up due to caching or path issues. | Moved the file to the main `dto` package and updated imports in `StudentService`. |
| **`cannot find symbol ExamResultRepository`** | The `StudentService` logic for CGPA calculation required the Exam Repo, but it wasn't injected into the class constructor. | Added `private final ExamResultRepository examResultRepository;` to the Service class. |
| **Missing "My Profile" Link** | The page was created but unreachable because the Sidebar item was commented out or missing `href`. | Updated `StudentLayout.jsx` to uncomment and correctly link the "My Profile" item to `/student/profile`. |

