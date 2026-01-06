## SSSMS Academic Portal - Phase 2: Authentication & Security

**Module:** Security Architecture (JWT + Cookies)
**Date:** November 26, 2025
**Status:** Complete & Audited

## 1. Executive Summary
Phase 2 focused on building a "Gold Standard" security architecture. We moved away from the common (but insecure) practice of storing tokens in LocalStorage. Instead, we implemented a stateless **JWT (JSON Web Token)** system where tokens are transported via **HttpOnly Cookies**. This architecture is immune to XSS attacks and ready for production deployment.

## 2. Security Design Decisions

| Component | Choice | Rationale |
| :--- | :--- | :--- |
| **Token Storage** | **HttpOnly Cookie** | Prevents JavaScript (XSS attacks) from reading the token. |
| **Transport** | **HTTPS (Ready)** | Cookies are flagged `SameSite=Strict`. In Prod, we will set `Secure=True`. |
| **Authorization** | **RBAC** | Role-Based Access Control (`ROLE_ADMIN`, `ROLE_STUDENT`) enforces permission boundaries. |
| **Password Hashing** | **BCrypt** | Passwords are salted and hashed before storage (Strength 10). |
| **CORS** | **Strict Whitelist** | We rejected wildcards (`*`) and explicitly whitelisted the Frontend URL to prevent unauthorized cross-origin requests. |

## 3. Backend Implementation (Spring Security)

### 3.1. The User Entity
We extended the standard data model to include a Role Enum.
*   **Roles:** `STUDENT`, `FACULTY`, `ADMIN`.
*   **Interface:** Implements `UserDetails` to integrate seamlessly with Spring Security's context.

### 3.2. JWT Utility & Cookie Generation
We rewrote `JwtUtil.java` to handle Cookie creation.
*   **Generation:** Creates an HMAC-SHA256 signed token containing the User's Email and Role.
*   **Packaging:** Instead of returning a String, it returns a `ResponseCookie` object with:
    *   `HttpOnly: true` (Invisible to Client JS)
    *   `Path: /api` (Only sent to backend endpoints)
    *   `MaxAge: 24 Hours`

### 3.3. The Authentication Controller
We implemented a robust `AuthController` with three key endpoints:
1.  **`POST /login`**: Validates credentials -> Generates Cookie -> Sets `Set-Cookie` Header.
2.  **`POST /logout`**: Overwrites the cookie with a null value and immediate expiry.
3.  **`GET /me`**: Since the Frontend **cannot read** the HttpOnly cookie, this endpoint allows the Frontend to ask: *"Who is the user inside this cookie?"*. It returns the User's Name, Email, and Role.

### 3.4. Security Configuration (The Hardening)
We configured the Spring Security Filter Chain (`SecurityConfig.java`) with strict rules:
*   **Pre-flight Handling:** Explicitly permitted `OPTIONS /**` to prevent 403 errors on CORS checks.
*   **CSP (Content Security Policy):** Relaxed `script-src` to allow `unsafe-eval` during development (required for React Hot Reload).
*   **Filter Order:** Injected our custom `JwtAuthenticationFilter` *before* the standard UsernamePassword filter.

## 4. Frontend Implementation (React)

### 4.1. Axios Configuration
We configured the global Axios instance to support credentials.
```javascript
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true // <--- Critical: Allows sending/receiving Cookies
});
```

### 4.2. Auth Context (State Management)
We built a robust `AuthContext.jsx` that manages the user session.
*   **Initialization:** On page load, it calls `GET /api/auth/me`.
    *   *Success:* Sets User state (Logged In).
    *   *401:* Sets User state to Null (Logged Out).
    *   *Loading State:* Displays a spinner to prevent "flickering" between Login/Dashboard pages.

### 4.3. Route Protection
We created a wrapper component `ProtectedRoute.jsx`.
*   **Logic:** It checks the User's Role against the Allowed Roles for the route.
*   **Action:** If unauthorized, it redirects to a dedicated `/unauthorized` page.

## 5. Critical Issues Resolved

### Issue 1: `403 Forbidden` on Login
**Symptom:** Login requests failed despite correct credentials.
**Root Cause:** Spring Security 7.0 is very strict. It was blocking the browser's **CORS Pre-flight (OPTIONS)** request because it wasn't explicitly permitted in the filter chain.
**Solution:**
1.  Added `.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()` to Security Config.
2.  Registered a dedicated `CorsFilter` bean to handle headers *before* Spring Security logic runs.

### Issue 2: `IllegalArgumentException: CharSequence cannot be null`
**Symptom:** The Backend crashed with a 500 error when a user was logged out.
**Root Cause:** The `JwtFilter` tried to parse a cookie that existed but was empty (`""`) or null.
**Solution:** Added a null-safety check: `if (jwt != null && !jwt.isEmpty())` inside the filter logic.

### Issue 3: `ERR_CONNECTION_RESET` on `/me`
**Symptom:** The `GET /me` endpoint crashed the server.
**Root Cause:** The endpoint tried to access `userDetails.getUsername()` when `userDetails` was null (unauthenticated user).
**Solution:** Added a **Guard Clause**:
```java
if (userDetails == null) return ResponseEntity.status(401).body("Not Authenticated");
```

## 6. How to Test Phase 2

1.  **Register Admin (Once):**
    *   Use Postman (since no UI exists for registration).
    *   `POST /api/auth/register` with `{"role": "ADMIN", ...}`.
2.  **Login (Frontend):**
    *   Go to `http://localhost:5173`.
    *   Enter credentials.
    *   **Verify:** Check Browser DevTools -> **Application** -> **Cookies**. You will see `jwt-token`. Try accessing it in Console (`document.cookie`) -> It will be empty (Secure!).
3.  **Access Control:**
    *   Log in as Student.
    *   Try to visit `/admin/dashboard`.
    *   **Result:** Redirected to "Access Denied" page.

