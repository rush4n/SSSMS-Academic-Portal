import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { BookOpen, ArrowRight, UserCheck, Upload } from 'lucide-react';

const FacultySubjectList = ({ mode }) => {
    // mode can be 'attendance' or 'upload'
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await api.get('/faculty/my-subjects');
                setSubjects(response.data);
            } catch (error) {
                console.error("Failed to load subjects");
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    const handleNavigate = (id) => {
        if (mode === 'attendance') {
            navigate(`/faculty/attendance/${id}`);
        } else {
            navigate(`/faculty/resources/${id}`);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {mode === 'attendance' ? 'Mark Attendance' : 'Upload Resources'}
                </h1>
                <p className="text-gray-600">Select a subject to proceed.</p>
            </div>

            {loading ? (
                <div className="text-gray-500">Loading subjects...</div>
            ) : subjects.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                    <p className="text-gray-500 mb-4">No subjects assigned to you yet.</p>
                    <p className="text-sm text-blue-600">Contact the Admin to allocate subjects.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((sub) => (
                        <div
                            key={sub.id}
                            onClick={() => handleNavigate(sub.id)}
                            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${mode === 'attendance' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                  {sub.subjectCode}
                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                {sub.subjectName}
                            </h3>
                            <p className="text-gray-500 text-sm mb-6">
                                {sub.className} - Div {sub.division}
                            </p>

                            <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-gray-900 transition-colors">
                                {mode === 'attendance' ? 'Take Attendance' : 'Manage Files'}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FacultySubjectList;