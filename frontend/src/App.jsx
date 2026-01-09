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
import ManageTimetables from './pages/admin/ManageTimetables';

// Faculty Pages
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import AttendanceSheet from './pages/faculty/AttendanceSheet';
import ResourceCenter from './pages/faculty/ResourceCenter';
import FacultySubjectList from './pages/faculty/FacultySubjectList';
import FacultyResultsSubjects from './pages/faculty/FacultyResultsSubjects';
import GradingSheet from './pages/faculty/GradingSheet';
import FacultyTimetable from "./pages/faculty/FacultyTimetable";

import NoticesPage from './pages/common/NoticesPage';
import UploadExamSchedule from './pages/common/UploadExamSchedule';

// Student Pages
import StudentLayout from './components/layout/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentResources from './pages/student/StudentResources';
import StudentResults from './pages/student/StudentResults';
import StudentTimetable from './pages/student/StudentTimetable';
import StudentExamSchedule from './pages/student/StudentExamSchedule';
import StudentProfile from './pages/student/StudentProfile';

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
                <Route path="manage-timetables" element={<ManageTimetables />} />
                <Route path="manage-exams" element={<UploadExamSchedule />} />
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

                <Route path="timetable" element={<FacultyTimetable />} />
                <Route path="exam-schedule" element={<UploadExamSchedule />} />

              </Route>
            </Route>

            {/* ------------------- STUDENT ROUTES ------------------- */}
            <Route path="/student" element={<StudentLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="resources/:subjectCode" element={<StudentResources />} />
              <Route path="notices" element={<NoticesPage />} />
              <Route path="results" element={<StudentResults />} />
              <Route path="timetable" element={<StudentTimetable />} />
              <Route path="exam-schedule" element={<StudentExamSchedule />} />
              <Route path="profile" element={<StudentProfile />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
  );
}

export default App;