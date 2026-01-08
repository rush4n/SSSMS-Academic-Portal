## SSSMS Academic Portal - Phase 13: Notice Attachments

**Module:** Advanced Communication & File Handling
**Date:** January 08, 2026
**Status:** Complete & Stable

## 1. Executive Summary
Phase 13 enhanced the Digital Notice Board by adding **Multimedia Capabilities**.
Previously, notices were text-only. We upgraded the system to support **PDF/Image Attachments**, allowing Admins and Faculty to distribute circulars, timetables, and official documents directly through the Notice Board.

## 2. Backend Architecture (Data & Logic)

### 2.1. Schema Update (`Notice` Entity)
We modified the `notices` table to include a file reference.
*   **Field:** `attachment` (String).
*   **Purpose:** Stores the generated filename (UUID) of the uploaded file stored on the disk.

### 2.2. Service Logic (`NoticeService.java`)
We refactored the creation logic to handle `MultipartFile`.
*   **Storage:** Uses the existing `FileStorageService` (from Phase 7) to save the file physically to the `/uploads` directory.
*   **Persistence:** The filename is saved to the database alongside the notice title/content.

### 2.3. API Migration (`NoticeController.java`)
We migrated the `POST /api/notices` endpoint from JSON to **Multipart Form Data**.
*   **Old:** `@RequestBody NoticeRequest` (JSON)
*   **New:** `@RequestParam` for Title, Content, Role, and File.
*   **Download:** Added `GET /api/notices/download/{fileName}` to stream the attachment securely.

## 3. Frontend Implementation (React)

### 3.1. Notices UI Update (`NoticesPage.jsx`)
*   **Form Update:** Converted the form submission to use `FormData()` instead of JSON, enabling file uploads.
*   **Visual Feedback:** Added a "Paperclip" icon input field for better UX.
*   **Download Button:** If a notice has an attachment, a "Download Attachment" button appears dynamically on the card.

## 4. Critical Troubleshooting Log

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **`method createNotice cannot be applied`** | The Controller was trying to call the old Service method signature (using DTO) while the Service had been updated to accept individual parameters (String, File). | Updated `NoticeController` to extract parameters from the Multipart request and pass them individually to match the new Service signature. |
| **`cannot find symbol TargetRole`** | Missing imports in the Controller after pasting the new method. | Added imports for `TargetRole`, `MultipartFile`, and `MediaType`. |
| **Old Method Conflict** | The compiler found two `createNotice` methods with conflicting signatures. | Deleted the deprecated `@RequestBody` method from the Controller to enforce the new Multipart standard. |

## 5. Final System Status

The **Communication Module** is now fully featured.

*   **Text:** Rich text notices.
*   **Files:** PDF/Image attachments supported.
*   **Access:** RBAC (Admin/Faculty Post, Everyone Read).
*   **Security:** Files stored outside web root, served via secured API.

