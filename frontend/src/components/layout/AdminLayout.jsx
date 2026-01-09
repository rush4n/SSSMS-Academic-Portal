import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import {
  LayoutDashboard,
  Upload,
  UserCheck,
  Bell,
  BarChart3,
  Users,
  FileText,
  AlertTriangle,
  LogOut,
  User,
  UserPlus,
  Banknote,
  Briefcase,
  Calendar
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Main Navigation (Top Section)
  const mainNav = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Notices', href: '/admin/notices', icon: Bell },
    // { name: 'Upload Center', href: '/admin/upload', icon: Upload }, // Add later if Admin needs to upload syllabus
    // { name: 'Attendance', href: '/admin/attendance', icon: UserCheck }, // Add later if Admin needs to view logs
  ];

  // Admin Tools (Bottom Section)
  const adminTools = [
    // People
    { name: 'Enroll Student', href: '/admin/enroll-student', icon: UserPlus },
    { name: 'Add Faculty', href: '/admin/add-faculty', icon: UserPlus },
    { name: 'Manage Workload', href: '/admin/manage-faculty', icon: Briefcase }, // Allocation

    // Operations
    { name: 'Fee Management', href: '/admin/fees', icon: Banknote },
    { name: 'Exam Schedules', href: '/admin/manage-exams', icon: Calendar }, // New Feature
    { name: 'GPA Ledger', href: '/admin/gpa', icon: BarChart3 },

    // System
    // { name: 'Alerts', href: '/admin/alerts', icon: AlertTriangle }, // Merged with Notices usually
  ];

  return (
      <div className="flex h-screen bg-gray-50 font-sans">

        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 z-50">

          {/* Logo Section */}
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            {/* Ensure image path matches your public folder */}
            <img src="/sssms-logo.png" alt="SSSMS Logo" className="w-8 h-8 object-contain mr-3" />
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">SSSMS</h1>
              <p className="text-xs text-gray-500">College of Architecture</p>
            </div>
          </div>

          {/* User Profile */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <User className="w-5 h-5" />
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.sub || "Administrator"}
                </p>
                <p className="text-xs text-gray-500 truncate">admin@sssms.edu</p>
                <p className="text-xs text-gray-400 mt-0.5">Administration</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">

            {/* Main Group */}
            {mainNav.map((item) => (
                <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        isActive(item.href)
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive(item.href) ? 'text-blue-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
            ))}

            {/* Header */}
            <div className="pt-6 pb-2 px-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Management Tools
              </p>
            </div>

            {/* Admin Tools Group */}
            {adminTools.map((item) => (
                <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        isActive(item.href)
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive(item.href) ? 'text-blue-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3 text-gray-400" />
              Sign out
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col ml-64 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-8">
            <Outlet />
          </main>
        </div>
      </div>
  );
};

export default AdminLayout;