import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { BookOpen, Users, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FacultyDashboard = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await api.get('/faculty/my-subjects');
                setSubjects(response.data);
            } catch (error) {
                console.error("Failed to load subjects", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Faculty Dashboard</h1>
                <p className="text-gray-600">Overview of your assigned courses and schedule.</p>
            </div>

            {/* My Subjects Section */}
            <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                    My Assigned Subjects
                </h2>

                {loading ? (
                    <div className="text-gray-500">Loading your schedule...</div>
                ) : subjects.length === 0 ? (
                    <div className="bg-white p-6 rounded-xl border border-gray-200 text-center text-gray-500">
                        No subjects assigned yet. Contact Admin.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjects.map((sub) => (
                            <div key={sub.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                                        {sub.subjectCode}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-1">{sub.subjectName}</h3>
                                <p className="text-gray-500 text-sm mb-4">
                                    {sub.className} - Div {sub.division}
                                </p>

                                <div className="border-t border-gray-100 pt-4 flex gap-3">
                                    <button
                                        onClick={() => navigate(`/faculty/attendance/${sub.id}`)}
                                        className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                                    >
                                        Attendance
                                    </button>
                                    <button
                                        onClick={() => navigate(`/faculty/resources/${sub.id}`)} // Link to Resource Center
                                        className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Uploads
                                    </button>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FacultyDashboard;