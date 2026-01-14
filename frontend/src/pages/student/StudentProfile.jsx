import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { User, Mail, Calendar, Book, TrendingUp, Clock, MapPin, Phone, ShieldCheck, FileText } from 'lucide-react';

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

    const stats = [
        { label: 'Current GPA', value: profile.cgpa || 'N/A', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Attendance', value: `${profile.overallAttendance}%`, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    ];

    const DetailItem = ({ label, value, icon: Icon, mono }) => (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">{label}</label>
            <div className={`flex items-center text-gray-900 font-medium ${mono ? 'font-mono' : ''}`}>
                {Icon && <Icon className="w-4 h-4 mr-2 text-gray-400" />}
                {value || "N/A"}
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
                <p className="text-gray-600 mt-1">Manage your personal information and view academic progress.</p>
            </div>

            {/* Hero */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shrink-0 border-4 border-white shadow-sm">
                    <User className="w-12 h-12" />
                </div>
                <div className="text-center md:text-left flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{profile.firstName} {profile.middleName} {profile.lastName}</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm text-gray-600">
                        <span className="flex items-center"><Mail className="w-4 h-4 mr-1"/> {profile.email}</span>
                        <span className="flex items-center"><Book className="w-4 h-4 mr-1"/> {profile.department}</span>
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> Year {profile.currentYear}</span>
                    </div>
                </div>
            </div>

            {/* Stats */}
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

            {/* Details */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">Personal & Academic Details</h3>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Core Info */}
                    <DetailItem label="Full Name" value={`${profile.firstName} ${profile.middleName || ''} ${profile.lastName}`} icon={User} />
                    <DetailItem label="Date of Birth" value={profile.dob} icon={Calendar} />
                    <DetailItem label="Blood Group" value={profile.bloodGroup} icon={User} />

                    {/* Identifiers */}
                    <DetailItem label="PRN" value={profile.prn} mono />
                    <DetailItem label="GR Number" value={profile.grNo} mono />
                    <DetailItem label="ABC / APAAR ID" value={profile.abcId} mono />

                    {/* Compliance */}
                    <DetailItem label="COA Enrollment No" value={profile.coaEnrollmentNo} mono />
                    <DetailItem label="Aadhar Number" value={profile.aadharNo} mono />
                    <DetailItem label="Admission Category" value={profile.admissionCategory?.replace(/_/g, ' ')} icon={ShieldCheck} />

                    {/* Contact */}
                    <DetailItem label="Student Mobile" value={profile.phoneNumber} icon={Phone} />
                    <DetailItem label="Parent Mobile" value={profile.parentPhoneNumber} icon={Phone} />
                    <div className="md:col-span-3">
                        <DetailItem label="Permanent Address" value={profile.address} icon={MapPin} />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default StudentProfile;