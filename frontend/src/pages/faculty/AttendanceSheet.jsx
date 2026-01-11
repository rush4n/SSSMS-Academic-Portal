import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { Save, User, CheckCircle, XCircle, AlertCircle, BarChart3, Eye } from 'lucide-react';

const AttendanceSheet = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get(`/faculty/allocation/${id}/students`);
                setStudents(response.data);
                const initialStatus = {};
                response.data.forEach(s => { initialStatus[s.id] = 'PRESENT'; });
                setAttendance(initialStatus);
            } catch (error) {
                setStatus({ type: 'error', message: 'Failed to load student list.' });
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [id]);

    const toggleStatus = (studentId) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: prev[studentId] === 'PRESENT' ? 'ABSENT' : 'PRESENT'
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setStatus({ type: '', message: '' });
        const payload = {
            allocationId: id,
            date: date,
            students: Object.keys(attendance).map(sid => ({
                studentId: sid,
                status: attendance[sid]
            }))
        };
        try {
            await api.post('/faculty/attendance', payload);
            setStatus({ type: 'success', message: 'Attendance Saved Successfully!' });
            setTimeout(() => { navigate('/faculty/dashboard'); }, 1500);
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to save attendance.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-gray-500">Loading class list...</div>;

    return (
        <div className="max-w-4xl mx-auto">

            {/* Header Section */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
                    <p className="text-sm text-gray-500">Select students who are absent.</p>
                </div>

                <div className="flex gap-3">
                    {/* Link to Report */}
                    <button
                        onClick={() => navigate(`/faculty/report/${id}`)}
                        className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                    >
                        <BarChart3 className="w-4 h-4 mr-2" /> View Reports
                    </button>

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                </div>
            </div>

            {/* Status Banner */}
            {status.message && (
                <div className={`p-4 mb-6 rounded-lg flex items-center border ${
                    status.type === 'success'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                    {status.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3"/> : <AlertCircle className="w-5 h-5 mr-3"/>}
                    <span className="font-medium">{status.message}</span>
                </div>
            )}

            {/* Student List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between font-semibold text-xs text-gray-500 uppercase tracking-wider">
                    <span>Student Details</span>
                    <span>Mark Status</span>
                </div>
                <div className="divide-y divide-gray-100">
                    {students.map((student) => (
                        <div key={student.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                            <div className="flex items-center">
                                {/* Avatar */}
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-4 font-bold text-sm">
                                    {student.firstName?.[0]}{student.lastName?.[0]}
                                </div>
                                {/* Details & Profile Link */}
                                <div>
                                    <p className="font-medium text-gray-900 flex items-center gap-2">
                                        {student.firstName} {student.lastName}
                                        {/* ▼▼▼ VIEW PROFILE BUTTON ▼▼▼ */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/faculty/student-profile/${student.id}`);
                                            }}
                                            className="text-gray-400 hover:text-purple-600 transition-colors p-1 rounded-full hover:bg-purple-50"
                                            title="View Profile"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </p>
                                    <p className="text-xs text-gray-500 font-mono">{student.prn}</p>
                                </div>
                            </div>

                            {/* Attendance Toggle */}
                            <button
                                onClick={() => toggleStatus(student.id)}
                                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    attendance[student.id] === 'PRESENT'
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                        : 'bg-red-100 text-red-700 hover:bg-red-200 ring-2 ring-red-500 ring-opacity-50'
                                }`}
                            >
                                {attendance[student.id] === 'PRESENT' ? (
                                    <><CheckCircle className="w-4 h-4 mr-2" /> Present</>
                                ) : (
                                    <><XCircle className="w-4 h-4 mr-2" /> Absent</>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-end gap-3">
                <button onClick={() => navigate('/faculty/dashboard')} className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={handleSubmit} disabled={submitting} className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 flex items-center shadow-sm disabled:opacity-50">
                    {submitting ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Attendance</>}
                </button>
            </div>
        </div>
    );
};

export default AttendanceSheet;