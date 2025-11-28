import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized"; // Import this
import ProtectedRoute from "./components/routes/ProtectedRoute"; // Import this

// Layouts
import AdminLayout from "./components/layout/AdminLayout";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import EnrollStudent from "./pages/admin/EnrollStudent";
import EnrollFaculty from "./pages/admin/EnrollFaculty";

// Placeholders
const StudentDashboard = () => <div className="p-10">Student Dashboard</div>;
const FacultyDashboard = () => <div className="p-10">Faculty Dashboard</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ------------------- ADMIN ROUTES ------------------- */}
          {/* Only ROLE_ADMIN can enter this section */}
          <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="enroll-student" element={<EnrollStudent />} />
              <Route path="add-faculty" element={<EnrollFaculty />} />
            </Route>
          </Route>

          {/* ------------------- FACULTY ROUTES ------------------- */}
          {/* ROLE_FACULTY can enter */}
          <Route element={<ProtectedRoute allowedRoles={["ROLE_FACULTY"]} />}>
            <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          </Route>

          {/* ------------------- STUDENT ROUTES ------------------- */}
          {/* ROLE_STUDENT can enter */}
          <Route element={<ProtectedRoute allowedRoles={["ROLE_STUDENT"]} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
