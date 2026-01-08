## SSSMS Academic Portal - Phase 11: Result Processing & Python Integration

**Module:** Automated Result Parsing & GPA Management
**Date:** January 08, 2026
**Status:** Complete & Stable

## 1. Executive Summary
Phase 11 introduced the most advanced technical feature of the portal: **Automated PDF Parsing**.
Instead of forcing Admins to manually enter grades for hundreds of students, we implemented a hybrid architecture where the Java Backend orchestrates a **Python Sub-process**. This allows the system to read the University's raw PDF Result Ledgers, extract SGPA/Grades via Regex, and update student records instantly.

## 2. Technical Architecture

### 2.1. Hybrid Microservice Strategy
Since Java libraries (PDFBox) are cumbersome for complex layout extraction, we leveraged **Python's ecosystem** (`pdfplumber`, `pandas`) inside the Java environment.
*   **Containerization:** We updated the `Dockerfile` to install Python 3.11, Pip, and required libraries inside the same Alpine Linux container running Spring Boot.
*   **Orchestration:** Java uses `ProcessBuilder` to spawn a Python shell, executes the script, and captures `stdout` as a JSON stream.

### 2.2. The Result Parser Logic (`result_parser.py`)
*   **Location:** `/app/result_parser.py` (Inside Container).
*   **Logic:**
    1.  Opens the PDF.
    2.  Iterates through pages.
    3.  Uses Regex `r"PRN No\.-(\d+)"` to identify the student.
    4.  Uses Regex `r"SGPA:(\d+\.\d+)"` to extract the Grade Point Average.
    5.  Outputs a JSON Array: `[{"prn": "...", "sgpa": 8.5, "status": "PASS"}]`.

### 2.3. Data Integration (`AdminService.java`)
The Java Service acts as the bridge:
1.  **File I/O:** Saves the uploaded MultipartFile to the persistent `/uploads` volume.
2.  **Execution:** Triggered the Python script on the saved file.
3.  **Mapping:** Deserialized the JSON output.
4.  **Persistence:** Looked up `Student` entities by PRN. If found, created an `ExamResult` record. If PRN not found, skipped gracefully.

## 3. Frontend Implementation (React)

### 3.1. Admin Upload Interface (`GPALedger.jsx`)
*   **Feature:** A dedicated drag-and-drop zone for PDF files.
*   **Feedback:** Displays a "Processing..." state while the Python script runs (which can take 5-10 seconds for large ledgers) and returns a summary count ("Processed 50 records successfully").

### 3.2. Student Result View (`StudentResults.jsx`)
*   **Feature:** A read-only table displaying the student's academic history.
*   **Security:** Uses the `/api/student/my-results` endpoint, ensuring students cannot see peers' grades.

## 4. Critical Troubleshooting Log

Phase 11 involved complex "Cross-Language" debugging.

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **`package com.fasterxml.jackson... does not exist`** | The `jackson-databind` library was available at runtime but not exposed to the compiler for the Service layer. | Explicitly added the Jackson dependency to `pom.xml` to fix the build path. |
| **`cannot find symbol MultipartFile`** | Missing imports in `AdminController` and `AdminService`. | Added `import org.springframework.web.multipart.MultipartFile;`. |
| **Python Script "File Not Found"** | The Java ProcessBuilder couldn't find the python script because the path was relative. | Hardcoded the absolute path `/app/result_parser.py` in the Java Service and ensured `Dockerfile` copies it to the root level. |
| **"No results found" after Upload** | The PDF contained PRNs that did not exist in the database (e.g., `202403...`). | Enrolled dummy students with the **Exact Matching PRNs** from the PDF sample to validate the linkage logic. |

## 5. Final System Status Checklist

With Phase 11 complete, the SSSMS Portal is now **Feature Complete** according to the SRS.

| Pillar | Features | Status |
| :--- | :--- |:-------|
| **Data Ingestion** | PDF Parsing (Python integration) | Done   |
| **Persistence** | Result Storage & History | Done   |
| **Access** | Student GPA Visibility | Done   |
| **Infrastructure** | Hybrid Java+Python Container | Done   |

