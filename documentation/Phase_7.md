## SSSMS Academic Portal - Phase 7: Resource Sharing & File Management

**Module:** Content Distribution
**Date:** January 08, 2026
**Status:** Complete

## 1. Executive Summary
Phase 7 introduced **File Handling capabilities** to the portal. We enabled Faculty members to upload academic materials (PDFs, notes) linked to specific subjects. Students (and Faculty) can then download these resources securely. This moves the portal from just "Tracking Data" to "Distributing Content".

## 2. Technical Architecture

### 2.1. File Storage Strategy
We chose a **Local File System** approach for simplicity and speed, mapped via Docker Volumes for persistence.
*   **Container Path:** `/uploads` (Inside the Spring Boot container).
*   **Host Path:** `./uploads_data` (On your physical machine).
*   **Benefit:** Files survive container restarts, and you can backup/inspect files easily without needing cloud storage credentials (AWS S3) for the demo.

### 2.2. Backend Logic (`ResourceController` + `FileStorageService`)
*   **Upload Logic:**
    1.  Receives `MultipartFile`.
    2.  Generates a unique filename (`UUID + Extension`) to prevent overwrites.
    3.  Saves the physical file to disk.
    4.  Saves metadata (Title, Original Name, Uploader ID) to MySQL.
*   **Download Logic:**
    1.  Validates the file exists on disk.
    2.  Streams the file bytes back to the client with `MediaType.APPLICATION_OCTET_STREAM`.
    3.  Sets `Content-Disposition` headers so the browser treats it as a download attachment.

## 3. Frontend Implementation

### 3.1. Resource Center UI (`ResourceCenter.jsx`)
We built a unified interface for uploading and listing files.
*   **Drag & Drop Style Input:** A styled file picker that accepts standard document formats.
*   **Dynamic List:** Fetches resources linked specifically to the current Subject Allocation.
*   **Download Handler:** Uses Blob URL creation `window.URL.createObjectURL(blob)` to trigger a browser download without navigating away from the page.

## 4. Troubleshooting Log

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **Files disappearing on Restart** | The backend was saving files to the container's temporary filesystem. | Added a Docker Volume mapping `./uploads_data:/uploads` to persist files on the host machine. |
| **`403 Forbidden` on Upload** | CSRF or Multipart configuration issues. | Updated `SecurityConfig` to allow all headers and verified `content-type: multipart/form-data` was being sent by Axios. |
| **"Toast" Styling Inconsistency** | The initial implementation used native `window.alert()`, breaking the UI flow. | Refactored `ResourceCenter.jsx` to use the standardized **Status Banner** component (Green/Red colored box) used elsewhere in the app. |

