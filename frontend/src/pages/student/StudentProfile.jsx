import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { User, Mail, Calendar, Book, TrendingUp, Clock, MapPin, Phone } from 'lucide-react';

const StudentProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/student/profile');
                setProfile(response.data);
            } catch (error) {
                console.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="p-8 text-gray-500">Loading Profile...</div>;
    if (!profile) return <div className="p-8 text-red-500">Profile not found.</div>;

    // Configuration for Stats Cards
    const stats = [
        { label: 'Current GPA', value: profile.cgpa || 'N/A', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Attendance', value: `${profile.overallAttendance}%`, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
                <p className="text-gray-600 mt-1">Manage your personal information and view academic progress.</p>
            </div>

            {/* 1. Hero Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                    <User className="w-12 h-12" />
                </div>
                <div className="text-center md:text-left flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h2>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm text-gray-600">
                        <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" /> {profile.email}
                        </div>
                        <div className="flex items-center">
                            <Book className="w-4 h-4 mr-2 text-gray-400" /> {profile.department}
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" /> Year: {profile.currentYear}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center">
                        <div className={`p-3 rounded-lg mr-4 ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Detailed Info Form (Read Only) */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                            {profile.firstName} {profile.lastName}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" /> {profile.email}
                        </div>
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                            {profile.department}
                        </div>
                    </div>

                    {/* Student ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PRN / Student ID</label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-mono">
                            {profile.prn}
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" /> {profile.phoneNumber || "N/A"}
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Address</label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" /> {profile.address || "N/A"}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default StudentProfile;