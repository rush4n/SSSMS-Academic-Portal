import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import {
    Users,
    Banknote,
    BarChart3,
    AlertTriangle,
    UserPlus,
    FileText,
    Calendar,
    BookOpen
} from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();

    // Helper to handle dynamic colors
    const getColorClasses = (color) => {
        switch (color) {
            case 'blue': return 'bg-blue-50 text-blue-600';
            case 'green': return 'bg-green-50 text-green-600';
            case 'purple': return 'bg-purple-50 text-purple-600';
            case 'orange': return 'bg-orange-50 text-orange-600';
            case 'indigo': return 'bg-indigo-50 text-indigo-600';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    const adminCards = [
        { title: 'Student Management', description: 'Add, edit, and manage student profiles', icon: UserPlus, href: '/admin/enroll-student', color: 'indigo' },
        { title: 'Faculty Management', description: 'Add, edit, and manage faculty profiles', icon: Users, href: '/admin/add-faculty', color: 'blue' },
        { title: 'Fee Management', description: 'Track student fee records and status', icon: Banknote, href: '/admin/fees', color: 'purple' },
        { title: 'GPA Ledger', description: 'Upload university result ledgers', icon: BarChart3, href: '/admin/gpa', color: 'green' },
        { title: 'Alerts & Notifications', description: 'Create and manage system announcements', icon: AlertTriangle, href: '/admin/alerts', color: 'orange' },
        { title: 'Timetable Manager', description: 'Upload Class and Faculty schedules (PDF)', icon: Calendar, href: '/admin/manage-timetables', color: 'indigo' },
        { title: 'Exam Schedules', description: 'Upload and publish exam timetables', icon: Calendar, href: '/admin/manage-exams', color: 'indigo' },
    ];

    const quickActions = [
        { title: 'Enroll New Student', description: 'Register a new student instantly', icon: UserPlus, href: '/admin/enroll-student', color: 'indigo' },
        { title: 'Enroll New Faculty', description: 'Register a new faculty instantly', icon: UserPlus, href: '/admin/add-faculty', color: 'blue' },
        { title: 'Manage Timetables', description: 'Update academic schedules', icon: Calendar, href: '/admin/timetables', color: 'purple' },
    ];

    return (
        <div className="max-w-7xl mx-auto">

            {/* Header Section */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-blue-600 mb-2">
                    Welcome, {user?.sub || 'Administrator'}
                </h1>
                <div className="flex items-center text-gray-600">
                    <span>Administration</span>
                    <span className="mx-2">|</span>
                    <span>Portal Manager</span>
                    <span className="ml-3 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            Admin
          </span>
                </div>
            </div>

            {/* Admin Panel Section */}
            <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Admin Panel</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {adminCards.map((card) => {
                        const IconComponent = card.icon;
                        return (
                            <Link
                                key={card.title}
                                to={card.href}
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group block"
                            >
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${getColorClasses(card.color)}`}>
                                    <IconComponent className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {card.title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {card.description}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Quick Actions / Upload Center Style */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quickActions.map((card) => {
                        const IconComponent = card.icon;
                        return (
                            <Link
                                key={card.title}
                                to={card.href}
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group block"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${getColorClasses(card.color)}`}>
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                            {card.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            {card.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;