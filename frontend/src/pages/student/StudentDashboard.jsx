import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { TrendingUp, TrendingDown, Clock, CheckCircle } from 'lucide-react';

const StudentDashboard = () => {
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await api.get('/student/my-attendance');
                setReport(response.data);
            } catch (error) {
                console.error("Failed to load attendance", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    // Calculate Overall Average
    const overall = report.length > 0
        ? Math.round(report.reduce((acc, curr) => acc + curr.percentage, 0) / report.length)
        : 0;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
                <p className="text-gray-600">Track your academic progress.</p>
            </div>

            {/* Overview Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-700">Overall Attendance</h2>
                    <p className="text-4xl font-bold text-blue-600 mt-2">{overall}%</p>
                </div>
                <div className={`p-4 rounded-full ${overall >= 75 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {overall >= 75 ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-4">Subject-wise Attendance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {report.map((item) => (
                    <div key={item.subjectCode} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between mb-4">
                            <span className="bg-gray-100 text-xs px-2 py-1 rounded font-mono text-gray-600">{item.subjectCode}</span>
                            <span className={`text-sm font-bold ${item.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                {item.percentage}%
              </span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">{item.subjectName}</h4>
                        <div className="text-sm text-gray-500 space-y-1">
                            <div className="flex justify-between"><span>Total Lectures:</span> <span>{item.totalSessions}</span></div>
                            <div className="flex justify-between"><span>Attended:</span> <span>{item.attendedSessions}</span></div>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                            <div className={`h-2.5 rounded-full ${item.percentage >= 75 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${item.percentage}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentDashboard;