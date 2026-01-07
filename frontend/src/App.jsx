import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/routes/ProtectedRoute";

// Layouts
import AdminLayout from "./components/layout/AdminLayout";
import FacultyLayout from "./components/layout/FacultyLayout";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import EnrollStudent from "./pages/admin/EnrollStudent";
import EnrollFaculty from "./pages/admin/EnrollFaculty";

// Faculty Pages
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import AttendanceSheet from './pages/faculty/AttendanceSheet';

// Student Pages
import StudentLayout from './components/layout/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';

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
            <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="enroll-student" element={<EnrollStudent />} />
                <Route path="add-faculty" element={<EnrollFaculty />} />
              </Route>
            </Route>

            {/* ------------------- FACULTY ROUTES ------------------- */}
            {/* I fixed the nesting here */}
            <Route element={<ProtectedRoute allowedRoles={["ROLE_FACULTY"]} />}>
              <Route path="/faculty" element={<FacultyLayout />}>
                <Route path="dashboard" element={<FacultyDashboard />} />
                <Route path="attendance/:id" element={<AttendanceSheet />} />
              </Route>
            </Route>

            {/* ------------------- STUDENT ROUTES ------------------- */}
            <Route path="/student" element={<StudentLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
            </Route>

          </Routes>
        </Router>
      </AuthProvider>
  );
}

export default App;