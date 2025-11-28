import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";

// Layouts
import AdminLayout from "./components/layout/AdminLayout";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import EnrollStudent from "./pages/admin/EnrollStudent";
import EnrollFaculty from './pages/admin/EnrollFaculty';

// Placeholders for Student/Faculty
const StudentDashboard = () => (
  <div className="p-10 text-2xl">Student Dashboard (Coming Soon)</div>
);
const FacultyDashboard = () => (
  <div className="p-10 text-2xl">Faculty Dashboard (Coming Soon)</div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes with Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="enroll-student" element={<EnrollStudent />} />
            <Route path="add-faculty" element={<EnrollFaculty />} />
          </Route>

          {/* Other Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
