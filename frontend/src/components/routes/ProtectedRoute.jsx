import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// allowedRoles: Array of roles that can access this route
// e.g. ['ROLE_ADMIN'] or ['ROLE_FACULTY', 'ROLE_ADMIN']
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // 1. Wait for Auth Check to finish
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 2. Not Logged In? -> Go to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Logged in but Wrong Role? -> Go to Unauthorized Page
  // We use .some() to check if the user has ANY of the allowed roles
  // (Assuming user.role is a string. If user can have multiple roles, adjust logic)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Authorized? -> Render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
