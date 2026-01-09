## SSSMS Academic Portal - Phase 12: Faculty Workload Management

**Module:** Academic Administration & Dynamic Allocation
**Date:** January 08, 2026
**Status:** Complete & Polished

## 1. Executive Summary
Phase 12 focused on the **Dynamic Management** of academic resources. While Phase 4 established the ability to assign subjects initially, the system lacked a user-friendly way to **Update** or **Modify** these assignments later.

We built a sophisticated "Manage Faculty" interface that allows Administrators to view a roster of all professors, inspect their current subject load, assign new classes, and remove incorrect assignments without touching the database directly.

## 2. Backend Architecture (Data & Logic)

### 2.1. API Extensions (`AdminController`)
We added three critical endpoints to support the Master-Detail UI workflow:

1.  **`GET /api/admin/faculty/all`**
    *   **Purpose:** Populates the sidebar list of professors.
    *   **Output:** Lightweight list of Faculty IDs, Names, and Designations.
2.  **`GET /api/admin/faculty/{id}/allocations`**
    *   **Purpose:** Fetches the specific workload for the selected professor.
    *   **Output:** List of `SubjectAllocation` DTOs (Subject Name, Class, Division).
3.  **`DELETE /api/admin/allocation/{id}`**
    *   **Purpose:** Removes a specific link between Faculty and Subject.
    *   **Security:** Restricted strictly to `ROLE_ADMIN`.

### 2.2. Service Layer Updates (`AdminService`)
*   **Logic:** Implemented a DTO mapper that converts raw database entities (`Faculty`, `User`) into a flattened JSON structure (`{id, name, email, designation}`) to make the frontend rendering easier.
*   **Safety:** The Delete operation uses `deleteById` on the Allocation repository, ensuring that deleting an allocation does **not** delete the Faculty member or the Subject itself.

## 3. Frontend Implementation (React)

### 3.1. Master-Detail UI (`ManageFaculty.jsx`)
We moved away from simple forms to a complex **Split-View Interface**:
*   **Left Pane:** A scrollable list of all Faculty members. Clicking a card sets the `selectedFaculty` state.
*   **Right Pane:** Displays the details for the selected person.
    *   **Current Assignments:** A list of subjects they teach, with a "Trash" icon to un-assign.
    *   **Assignment Form:** Dropdowns to link a new Subject/Class to this faculty member.

### 3.2. UX Refactor (Toasts & Modals)
We replaced all native browser interactions (`window.alert`, `window.confirm`) with custom components to maintain visual consistency:
*   **Status Banner (Toast):** Used for "Subject Assigned" or "Error" messages. Auto-dismisses after 3 seconds.
*   **Custom Modal:** A backdrop-blurred overlay that asks "Are you sure?" before deleting an allocation, preventing accidental data loss.

## 4. Critical Troubleshooting Log

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **`403 Forbidden` on `/faculty/all`** | Spring Security blocked the new endpoint because the wildcard matcher `admin/**` was evaluated *after* a restrictive rule, or the specific path wasn't whitelisted correctly. | Explicitly added `.requestMatchers("/api/admin/faculty/all").hasAuthority("ROLE_ADMIN")` to `SecurityConfig.java`. |
| **`404 Not Found` (Hidden 404)** | The Frontend received a 404 but displayed it as a generic error. The method `getAllFaculty` was written in the Service but **forgotten** in the Controller. | Added the `@GetMapping` endpoint to `AdminController` and rebuilt the backend. |
| **Faculty List Empty** | The database was running on a fresh volume after a Docker reset, so no faculty existed to fetch. | Used the Admin UI to manually enroll a dummy faculty member (`prof.test`) to populate the list. |
| **Ugly Alerts** | Native JS alerts disrupted the user experience. | Refactored `ManageFaculty.jsx` to use state-based UI elements (`status` object for toasts, `deleteId` for modals). |

## 5. Final System Status

The **SSSMS Academic Portal** is now functionally complete with.

*   **Core Logic:** All SRS requirements met.
*   **Security:** HttpOnly Cookies, RBAC, CORS.
*   **UX/UI:** Consistent Tailwind styling, responsive layouts, custom feedback components.
*   **Infrastructure:** Dockerized, Database Persistence, Hybrid Python/Java support.

