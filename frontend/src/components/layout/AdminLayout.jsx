import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { LayoutDashboard, UserPlus, LogOut, Users } from "lucide-react";

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">SSSMS Admin</h1>
          <p className="text-slate-400 text-sm">Portal Management</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link
            to="/admin/dashboard"
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive("/admin/dashboard")
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>

          <Link
            to="/admin/enroll-student"
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive("/admin/enroll-student")
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <UserPlus className="w-5 h-5 mr-3" />
            Enroll Student
          </Link>

          {/* Placeholder for future feature */}
          <div className="flex items-center px-4 py-3 rounded-lg text-slate-500 cursor-not-allowed">
            <Users className="w-5 h-5 mr-3" />
            Manage Faculty (Soon)
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet /> {/* This is where the child pages will render */}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
