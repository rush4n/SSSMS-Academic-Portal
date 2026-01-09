## SSSMS Academic Portal - Phase 14: Internal Assessment & Grading Module

**Module:** Academic Evaluation System
**Date:** January 09, 2026
**Status:** Complete & Stable

## 1. Executive Summary
Phase 14 introduced the **Internal Assessment Module**, a critical feature allowing Faculty to digitize student performance data.
Previously, the system only displayed final GPA results uploaded by Admins. We have now empowered Faculty to record **continuous assessment scores** (Unit Tests, Internals, Assignments) directly into the portal. This data is instantly available to students, providing real-time academic feedback.

## 2. Backend Architecture (Data & Logic)

### 2.1. New Entity (`ClassAssessment.java`)
We created a dedicated table `class_assessments` to store granular marks.
*   **Relationships:** Links a `Student` to a `SubjectAllocation` (Subject + Class Batch).
*   **Fields:** `examType` (e.g., "Unit Test 1"), `marksObtained` (Double), `maxMarks` (Double).

### 2.2. Data Transfer Objects (DTOs)
To handle batch submission of marks (multiple students in one request), we structured the data explicitly:
*   `AssessmentSubmissionRequest`: Contains Exam Type, Max Marks, and Allocation ID.
*   `StudentMarkDTO`: A simple key-value pair of Student ID and Marks.

### 2.3. Repository & Query Logic (`ClassAssessmentRepository`)
We defined custom JPA queries to support both user roles:
*   **Faculty View:** `findByAllocationIdAndExamType` (To edit/view class sheets).
*   **Student View:** `findByStudentId` (To fetch a personal academic history).

### 2.4. Controller Logic
*   **Faculty:** Added `POST /api/faculty/assessment/save` to iterate through the student list and persist marks.
*   **Student:** Added `GET /api/student/my-assessments` to fetch and group marks by Subject.

## 3. Frontend Implementation (React)

### 3.1. Faculty Grading Interface
*   **Subject Selection (`FacultyResultsSubjects.jsx`):** A dedicated view to select subjects specifically for grading (separate from Attendance).
*   **Grading Sheet (`GradingSheet.jsx`):** A dynamic spreadsheet-like interface.
    *   **Validation:** Prevents entering marks higher than the defined "Max Marks".
    *   **Name Logic:** Implemented a fallback check to resolve student names correctly (`user.name` vs `firstName` + `lastName`).
    *   **UX:** Replaced browser alerts with professional **Toast Notifications** (Success/Error banners).

### 3.2. Student Results View
*   **`StudentResults.jsx`:** Updated to include an "Accordion" style view.
*   **Logic:** Fetches raw assessment data and programmatically groups it by `Subject Name` for cleaner display.

## 4. Critical Troubleshooting Log

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **`cannot find symbol ClassAssessmentRepository`** | The Repository file was missing (or not saved) when the Controller tried to inject it. | Created the interface `ClassAssessmentRepository.java` in the correct package. |
| **"Routes not matched"** | The new Grading pages were created but not registered in the Router. | Updated `App.jsx` to include `/faculty/results` and `/faculty/grading/:id` endpoints. |
| **Missing Student Names** | The frontend tried to access `student.name`, but the Entity stores names in the linked `User` table or splits them into `firstName`/`lastName`. | Implemented a helper function `getStudentName()` to check multiple fields and render the correct name. |
| **`cannot find symbol findByStudentId`** | The Student Controller called a repository method that hadn't been defined in the Interface yet. | Updated `ClassAssessmentRepository` to include the `findByStudentId` method signature. |

## 5. Final System Status

The **Grading Module** is fully operational.

*   **Faculty:** Can select any assigned subject, choose an exam type (Internal/External), and digitally record marks for the entire batch.
*   **Students:** Can view a detailed breakdown of their scores grouped by subject.
*   **Data Integrity:** Marks are linked to specific Subject Allocations, ensuring historical accuracy even if teachers change.