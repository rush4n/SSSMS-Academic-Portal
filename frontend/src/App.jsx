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
import FeeManagement from './pages/admin/FeeManagement';
import GPALedger from "./pages/admin/GPALedger";
import ManageFaculty from './pages/admin/ManageFaculty';

// Faculty Pages
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import AttendanceSheet from './pages/faculty/AttendanceSheet';
import ResourceCenter from './pages/faculty/ResourceCenter';
import FacultySubjectList from './pages/faculty/FacultySubjectList';
import FacultyResultsSubjects from './pages/faculty/FacultyResultsSubjects';
import GradingSheet from './pages/faculty/GradingSheet';

import NoticesPage from './pages/common/NoticesPage';

// Student Pages
import StudentLayout from './components/layout/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentResources from './pages/student/StudentResources';
import StudentResults from './pages/student/StudentResults';

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
                <Route path="notices" element={<NoticesPage />} />
                <Route path="fees" element={<FeeManagement />} />
                <Route path="gpa" element={<GPALedger />} />
                <Route path="manage-faculty" element={<ManageFaculty />} />
              </Route>
            </Route>

            {/* FACULTY ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={["ROLE_FACULTY"]} />}>
              <Route path="/faculty" element={<FacultyLayout />}>
                <Route path="dashboard" element={<FacultyDashboard />} />

                {/* Route for selecting a subject for Attendance */}
                <Route path="attendance" element={<FacultySubjectList mode="attendance" />} />
                <Route path="attendance/:id" element={<AttendanceSheet />} />

                {/* Route for selecting a subject for Uploads */}
                <Route path="upload" element={<FacultySubjectList mode="upload" />} />
                <Route path="resources/:id" element={<ResourceCenter />} />

                <Route path="notices" element={<NoticesPage />} />

                <Route path="results" element={<FacultyResultsSubjects />} />
                <Route path="grading/:allocationId" element={<GradingSheet />} />

              </Route>
            </Route>

            {/* ------------------- STUDENT ROUTES ------------------- */}
            <Route path="/student" element={<StudentLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="resources/:subjectCode" element={<StudentResources />} />
              <Route path="notices" element={<NoticesPage />} />
              <Route path="results" element={<StudentResults />} />
            </Route>

          </Routes>
        </Router>
      </AuthProvider>
  );
}

export default App;