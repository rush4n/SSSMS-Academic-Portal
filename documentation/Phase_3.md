## SSSMS Academic Portal - Phase 3: Admin Module & User Management

**Module:** Core Data Structure & Administration
**Date:** November 28, 2025
**Status:** Complete

## 1. Executive Summary
Phase 3 transformed the application from a simple login system into a functional **Academic Portal**. We implemented the domain entities (`Student`, `Faculty`) and built the **Admin Dashboard**, empowering administrators to enroll users into the system. This phase established the link between Authentication (`User`) and Domain Data (`Profile`).

## 2. Backend Architecture (Data & Logic)

### 2.1. Entity Relationship Strategy
We adopted a **One-to-One Shared Primary Key** strategy to link Login Data with Profile Data.

*   **`User` Table:** Stores Authentication data (Email, Password, Role).
*   **`Student` / `Faculty` Table:** Stores Domain data (Name, PRN, Dept).
*   **The Link:** `@MapsId`.
    *   This ensures `student.id` is *identical* to `user.id`.
    *   **Benefit:** Efficient querying. We don't need a separate foreign key column; the ID itself is the link.

### 2.2. Transactional Enrollment Service
Enrolling a user is a two-step process that *must* succeed or fail as a unit.
*   **Service:** `AdminService.java`
*   **Annotation:** `@Transactional`
*   **Workflow:**
    1.  Create and Save `User` (Auth Table).
    2.  Create `Student/Faculty` object.
    3.  Link it to the saved User.
    4.  Save `Student/Faculty` (Profile Table).
*   **Safety:** If Step 4 fails (e.g., Duplicate PRN), the Database **rolls back** Step 1, ensuring no "Zombie Accounts" (Users without profiles) exist.

### 2.3. DTO Implementation
We created specific Data Transfer Objects to decouple the API from the Database.
*   `StudentEnrollmentRequest`: Captures Email + Profile Data.
*   `FacultyEnrollmentRequest`: Captures Email + Designation/Dept.

## 3. Frontend Implementation (React)

### 3.1. The Admin Layout
We built a dedicated `AdminLayout.jsx` featuring:
*   **Sidebar Navigation:** Custom links for Enrollment, Dashboard, and Fees.
*   **Responsive Design:** Uses Tailwind CSS to adapt to screen sizes.
*   **Role Awareness:** Displays the current Admin's email/name in the sidebar.

### 3.2. Enrollment Forms
We built complex forms (`EnrollStudent.jsx` / `EnrollFaculty.jsx`) that:
1.  **Validate Input:** Ensure required fields (PRN, Email) are present.
2.  **Submit Data:** Call the transactional backend endpoints.
3.  **Handle Errors:** Display user-friendly messages if the email/PRN already exists (e.g., "Student enrolled successfully!" vs "User already exists").

### 3.3. Dynamic Redirection
We updated `Login.jsx` to be **Role-Aware**.
*   **Old Logic:** Redirect based on which button (Student/Faculty) was clicked.
*   **New Logic:** Decode the user's role from the backend response/context.
*   **Result:** Even if a user clicks "Student" but logs in with Admin credentials, the system forces them to the Admin Dashboard.

## 4. Critical Issues Resolved

### Issue 1: `403 Forbidden` despite Correct Role
**Symptom:** The Admin could log in, but accessing `/api/admin/enroll-student` returned 403.
**Root Cause:**
*   The Backend `SecurityConfig` used `.hasRole("ADMIN")`.
*   Spring Security automatically adds a `ROLE_` prefix, looking for `ROLE_ADMIN`.
*   Sometimes this automatic prefixing behaves inconsistently across versions.
    **Solution:** We switched to **`.hasAuthority("ROLE_ADMIN")`**. This removes the "magic" and checks the string literally, fixing the permission issue.

### Issue 2: `Duplicate entry 'admin@...'`
**Symptom:** Trying to register the Admin user repeatedly caused DB crashes.
**Solution:** We clarified the workflow: `Register` is a one-time setup action. Daily usage uses `Login`.

### Issue 3: Missing "Middle Name" Field
**Symptom:** The requirement changed to include a Middle Name for students.
**Solution:** Demonstrated the **Vertical Slice Update** process:
1.  Updated `Student` Entity (Database).
2.  Updated `EnrollmentRequest` (DTO).
3.  Updated `AdminService` (Logic).
4.  Updated Frontend Form (UI).

## 5. How to Test Phase 3

1.  **Login as Admin:**
    *   Credentials: `admin@sssms.edu` / `password123`.
    *   Verify you land on the **Admin Dashboard** (Blue Sidebar).
2.  **Enroll a Student:**
    *   Go to "Enroll Student".
    *   Enter dummy data (PRN: 2025001).
    *   Click Enroll. Look for the "Success" message.
3.  **Enroll a Faculty:**
    *   Go to "Add Faculty".
    *   Enter Name: "Grant Linkletter", Email: `prof.grant@sssms.edu`.
    *   Click Enroll.
4.  **Verify Data:**
    *   Logout.
    *   Login as the **New Faculty** (`prof.grant@sssms.edu`).
    *   Verify you are redirected to the Faculty Dashboard (placeholder).

