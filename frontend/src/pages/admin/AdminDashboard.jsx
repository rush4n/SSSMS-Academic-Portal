import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import {
    Users,
    Banknote,
    BarChart3,
    AlertTriangle,
    UserPlus,
    Calendar,
    BookOpen,
    Briefcase
} from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();

    // Helper to handle dynamic colors
    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            purple: 'bg-purple-50 text-purple-600',
            indigo: 'bg-indigo-50 text-indigo-600',
            orange: 'bg-orange-50 text-orange-600',
            red: 'bg-red-50 text-red-600',
        };
        return colors[color] || colors.blue;
    };

    // The Main Grid (All Tools)
    const adminCards = [
        {
            title: 'Enroll New Student',
            description: 'Register a new admission',
            icon: UserPlus,
            href: '/admin/enroll-student',
            color: 'green'
        },
        {
            title: 'Student Management',
            description: 'View directory & manage enrollments',
            icon: Users,
            href: '/admin/manage-students',
            color: 'indigo'
        },
        {
            title: 'Enroll New Faculty',
            description: 'Onboard teaching staff & HODs',
            icon: UserPlus,
            href: '/admin/add-faculty',
            color: 'blue'
        },
        {
            title: 'Faculty Management',
            description: 'Assign subjects to faculty members',
            icon: Briefcase,
            href: '/admin/manage-faculty',
            color: 'indigo'
        },
        {
            title: 'Academic Setup',
            description: 'Create Classes and Subjects',
            icon: BookOpen,
            href: '/admin/academic-setup',
            color: 'blue'
        },
        {
            title: 'GPA Ledger',
            description: 'Process university result PDFs',
            icon: BarChart3,
            href: '/admin/gpa',
            color: 'green'
        },
        {
            title: 'Timetable Manager',
            description: 'Upload Weekly Class Schedules',
            icon: Calendar,
            href: '/admin/manage-timetables',
            color: 'indigo'
        },
        {
            title: 'Exam Schedules',
            description: 'Publish Exam Time Tables',
            icon: Calendar,
            href: '/admin/manage-exams',
            color: 'purple'
        },
    ];

    // Priority Actions (The "Big Buttons")
    const quickActions = [
        {
            title: 'GPA Ledger',
            description: 'Process university result PDFs',
            icon: BarChart3,
            href: '/admin/gpa',
            color: 'green'
        },
        {
            title: 'Record Fee Payment',
            description: 'Update ledger for a student',
            icon: Banknote,
            href: '/admin/fees',
            color: 'purple'
        },
        {
            title: 'Post New Notice',
            description: 'Send an alert to everyone',
            icon: AlertTriangle,
            href: '/admin/notices',
            color: 'orange'
        },
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

            {/* Admin Panel Section (Grid) */}
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

            {/* Quick Actions (Row) */}
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