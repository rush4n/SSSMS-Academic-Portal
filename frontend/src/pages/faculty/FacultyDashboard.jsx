import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { useAuth } from '../../auth/useAuth';
import {
    Calendar,
    Target,
    Book,
    FileText,
    UserCheck,
    Bell
} from 'lucide-react';

const FacultyDashboard = () => {
    const { user } = useAuth();
    const [latestNotice, setLatestNotice] = useState(null);

    // Fetch Latest Notice
    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await api.get('/notices');
                if (response.data && response.data.length > 0) {
                    setLatestNotice(response.data[0]);
                }
            } catch (error) {
                console.error("Failed to load notices");
            }
        };
        fetchNotices();
    }, []);

    // Configuration for the Dashboard Cards
    const uploadCenterCards = [
        {
            title: 'Upload Exam Schedule',
            subtitle: 'Create and upload examination timetables',
            icon: Calendar,
            color: 'blue',
            href: '/faculty/notices' // Or a specific schedule route if we build it later
        },
        {
            title: 'Upload Results',
            subtitle: 'UploadView and publish examination results',
            icon: Target,
            color: 'green',
            href: '/faculty/results' // Placeholder
        },
        {
            title: 'Upload Study Materials',
            subtitle: 'Share lecture notes and resources',
            icon: Book,
            color: 'purple',
            // Link to the Subject List for Uploads
            href: '/faculty/upload'
        },
        {
            title: 'View Courses & Syllabus',
            subtitle: 'UploadView course information and syllabus',
            icon: FileText,
            color: 'indigo',
            // Reuse the Upload logic for Syllabus too
            href: '/faculty/upload'
        },
        {
            title: 'Manage Attendance',
            subtitle: 'Record and manage student attendance',
            icon: UserCheck,
            color: 'blue',
            // Link to Subject List for Attendance
            href: '/faculty/attendance'
        },
        {
            title: 'Post Notices',
            subtitle: 'Create announcements for students',
            icon: Bell,
            count: '4',
            color: 'orange',
            href: '/faculty/notices'
        },
    ];

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

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-blue-600 mb-2">
                    Welcome, {user?.name || user?.email?.split('@')[0] || "Professor"}
                </h1>
                <p className="text-gray-600">
                    Architecture Design | Faculty Portal
                </p>
            </div>

            {/* Upload Center Grid */}
            <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Upload Center</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {uploadCenterCards.map((card, index) => {
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
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {card.subtitle}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Recent Notices */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Notices</h2>
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
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

export default FacultyDashboard;