## SSSMS Academic Portal - Phase 9: Digital Notice Board

**Module:** Communication & Announcements
**Date:** January 08, 2026
**Status:** Complete & Integrated

## 1. Executive Summary
Phase 9 introduced the **Communication Layer** to the portal. Previously, the system was transactional (Admin assigns, Faculty marks, Student views). With the Digital Notice Board, we added a broadcast mechanism allowing Admins and Faculty to disseminate information to specific user groups (Students, Faculty, or All). This feature is accessible across all three user dashboards.

## 2. Backend Architecture (Data & Logic)

### 2.1. Data Model (`Notice` Entity)
We created a flexible entity to store announcements.
*   **Fields:** `Title`, `Content`, `Date`, `PostedBy` (User Link).
*   **`TargetRole` Enum:** Defines visibility scopes (`ALL`, `STUDENT`, `FACULTY`).
*   **Relationship:** `Many-to-One` with the User table (to track the author).

### 2.2. Service Logic (`NoticeService.java`)
We implemented role-aware filtering logic:
*   **Admin View:** Retrieves *all* notices, ordered by date descending.
*   **Student/Faculty View:** Filters notices based on the target audience.
    *   *Logic:* `WHERE target_role = 'ALL' OR target_role = [USER_ROLE]`.

### 2.3. Security Configuration
We updated `SecurityConfig.java` to enforce write-access control while allowing broad read-access.
*   **`GET /api/notices`**: Authenticated (Accessible to everyone logged in).
*   **`POST /api/notices`**: Restricted via `.hasAnyAuthority("ROLE_ADMIN", "ROLE_FACULTY")`. Students are forbidden from posting.

## 3. Frontend Implementation (React)

### 3.1. Unified UI Component (`NoticesPage.jsx`)
Instead of creating separate pages for each role, we built a single **Smart Component** located in `src/pages/common/`.
*   **Conditional Rendering:** Checks `user.role` from AuthContext.
    *   If **Admin/Faculty**: Renders the "Post Notice" form at the top.
    *   If **Student**: Hides the form and only renders the feed.
*   **Visuals:** Uses Tailwind CSS for a clean, card-based feed with Lucide icons indicating the target audience (e.g., Green for ALL, Blue for STUDENT).

### 3.2. Router Integration
We integrated the `NoticesPage` into all three Layouts in `App.jsx`.
*   `/admin/notices`
*   `/faculty/notices`
*   `/student/notices`

## 4. Critical Troubleshooting Log

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **`Incompatible types` (Lambda)** | Java compiler failed to infer types when using `Map.of()` inside a Stream to return the notice list. | Replaced the inline `Map.of()` with an explicit `HashMap` instantiation inside the lambda block. |
| **`Uncaught ReferenceError: NoticesPage`** | The component was used in `App.jsx` routes but the import statement was missing. | Added `import NoticesPage from './pages/common/NoticesPage';` to `App.jsx`. |
| **403 Forbidden on Post** | Security Config initially might have blocked the POST endpoint if the order of rules was incorrect or if the user role (Admin vs Faculty) wasn't explicitly whitelisted. | Verified `SecurityConfig` rules to ensure `.hasAnyAuthority(...)` covered both posting roles correctly. |

## 5. System Status: The Feature Complete MVP

The SSSMS Portal now fulfills the core requirements of a modern academic management system.

| Module | Feature | Status          |
| :--- | :--- |:----------------|
| **Auth** | Secure Login (HttpOnly Cookies) | Done            |
| **Admin** | Enrollment & Allocations | Done            |
| **Faculty** | Attendance & File Uploads | Done            |
| **Student** | Analytics & Downloads | Done            |
| **Common** | Digital Notice Board | Done                |

