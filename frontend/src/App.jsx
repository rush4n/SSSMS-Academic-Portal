import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";

// Placeholder Components for testing redirection
const StudentDashboard = () => (
  <div className="p-10 text-2xl">Student Dashboard</div>
);
const FacultyDashboard = () => (
  <div className="p-10 text-2xl">Faculty Dashboard</div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default route redirects to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes (We will lock these down later) */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
