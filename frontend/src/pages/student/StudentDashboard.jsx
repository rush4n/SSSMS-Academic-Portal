import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { useAuth } from '../../auth/useAuth';
import {
    Calendar,
    Target,
    Book,
    FileText,
    Clock,
    Bell
} from 'lucide-react';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [latestNotice, setLatestNotice] = useState(null);

    // Fetch the latest notice for the bottom section
    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await api.get('/notices');
                if (response.data && response.data.length > 0) {
                    setLatestNotice(response.data[0]); // Get the newest one
                }
            } catch (error) {
                console.error("Failed to load notices");
            }
        };
        fetchNotices();
    }, []);

    // Configuration for the Quick Access Cards
    const quickAccessCards = [
        {
            title: 'Exam Schedule',
            subtitle: 'View upcoming examinations',
            icon: Calendar,
            count: '2',
            color: 'blue',
            href: '/student/exam-schedule'
        },
        {
            title: 'Results',
            subtitle: 'Check your examination results',
            icon: Target,
            count: '1',
            color: 'green',
            href: '/student/results'
        },
        {
            title: 'Study Materials',
            subtitle: 'Access lecture notes and resources',
            icon: Book,
            count: '5',
            color: 'purple',
            href: '/student/study-materials' // Or link to attendance view for now
        },
        {
            title: 'Courses View & Syllabus',
            subtitle: 'Browse course information',
            icon: FileText,
            color: 'indigo',
            href: '/student/courses'
        },
        {
            title: 'Timetable',
            subtitle: 'View your weekly class schedule',
            icon: Clock,
            color: 'blue',
            href: '/student/timetable'
        },
        {
            title: 'Notice Board',
            subtitle: 'Check the latest announcements',
            icon: Bell,
            count: '4',
            color: 'orange',
            href: '/student/notices'
        },
    ];

    // Helper for dynamic colors
    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            purple: 'bg-purple-50 text-purple-600',
            indigo: 'bg-indigo-50 text-indigo-600',
            orange: 'bg-orange-50 text-orange-600',
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="max-w-7xl mx-auto">

            {/* Header Section */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-blue-600 mb-2">
                    Welcome, {user?.name || user?.email?.split('@')[0] || "Student"}
                </h1>
                <p className="text-gray-600">
                    Architecture | Semester {user?.currentYear || '3'} | Year {user?.currentYear || '3'}
                </p>
            </div>

            {/* Quick Access Section */}
            <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quickAccessCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <Link
                                key={index}
                                to={card.href}
                                className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 group block"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-lg ${getColorClasses(card.color)}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    {card.count && (
                                        <span className="text-2xl font-bold text-blue-600 group-hover:scale-110 transition-transform">
                      {card.count}
                    </span>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                    {card.title}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {card.subtitle}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Recent Notices Section */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Notices</h2>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    {latestNotice ? (
                        <div className="flex items-start">
                            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg mr-4 mt-1">
                                <Bell className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{latestNotice.title}</h3>
                                <p className="text-gray-600 mb-2">{latestNotice.content}</p>
                                <div className="flex items-center text-xs text-gray-400">
                                    <span>{new Date(latestNotice.date).toLocaleDateString()}</span>
                                    <span className="mx-2">•</span>
                                    <span>{latestNotice.author}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-4">No recent notices found.</div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default StudentDashboard;