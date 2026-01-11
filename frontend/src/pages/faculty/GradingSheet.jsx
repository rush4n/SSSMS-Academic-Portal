import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { Save, ArrowLeft, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const GradingSheet = () => {
    const { allocationId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);

    // State for Exam Title
    const [examTitle, setExamTitle] = useState('Unit Test 1');

    // State for Type
    const [assessmentType, setAssessmentType] = useState('INTERNAL');

    const [maxMarks, setMaxMarks] = useState(20);
    const [marks, setMarks] = useState({});
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get(`/faculty/allocation/${allocationId}/students`);
                setStudents(response.data);
            } catch (error) {
                console.error("Failed to fetch students");
                setStatus({ type: 'error', message: 'Failed to load student list.' });
            }
        };
        fetchStudents();
    }, [allocationId]);

    const handleMarkChange = (studentId, value) => {
        const numValue = parseFloat(value);
        if (numValue > maxMarks) return;
        setMarks(prev => ({ ...prev, [studentId]: value }));
    };

    const handleSubmit = async () => {
        setSaving(true);
        setStatus({ type: '', message: '' });

        const marksArray = Object.keys(marks).map(sId => ({
            studentId: sId,
            marks: parseFloat(marks[sId])
        }));

        const payload = {
            allocationId: parseInt(allocationId),
            title: examTitle,
            type: assessmentType,
            maxMarks: parseFloat(maxMarks),
            marks: marksArray
        };

        try {
            await api.post('/faculty/assessment', payload);

            setStatus({ type: 'success', message: 'Marks saved successfully! Redirecting...' });
            setTimeout(() => {
                navigate('/faculty/results');
            }, 1500);

        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: 'Failed to save marks. Check inputs.' });
        } finally {
            setSaving(false);
        }
    };

    const getStudentName = (student) => {
        if (student.firstName || student.lastName) {
            return `${student.firstName || ''} ${student.lastName || ''}`.trim();
        }
        return student.user?.name || "Unknown Student";
    };

    return (
        <div className="max-w-5xl mx-auto">
            <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Subjects
            </button>

            {status.message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center border ${
                    status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                    {status.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3" /> : <XCircle className="w-5 h-5 mr-3" />}
                    <span className="font-medium">{status.message}</span>
                </div>
            )}

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{state?.subjectName || 'Grading Sheet'}</h1>
                        <p className="text-gray-500">{state?.className} • Enter Marks</p>
                    </div>

                    <div className="flex gap-4 items-end">
                        {/* Assessment Category */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
                            <select
                                value={assessmentType}
                                onChange={(e) => setAssessmentType(e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                            >
                                <option value="INTERNAL">Internal</option>
                                <option value="UNIT_TEST">Unit Test</option>
                                <option value="ASSIGNMENT">Assignment</option>
                                <option value="PRACTICAL">Practical</option>
                                <option value="EXTERNAL">External</option>
                            </select>
                        </div>

                        {/* Exam Title */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Exam Title</label>
                            <input
                                type="text"
                                placeholder="e.g. UT-1"
                                value={examTitle}
                                onChange={(e) => setExamTitle(e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm w-32"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Max Marks</label>
                            <input
                                type="number"
                                value={maxMarks}
                                onChange={(e) => setMaxMarks(e.target.value)}
                                className="w-24 p-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="p-4 text-sm font-semibold text-gray-600 w-32">PRN</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Student Name</th>
                        <th className="p-4 text-sm font-semibold text-gray-600 text-right w-48">Obtained Marks</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 text-sm text-gray-600 font-mono">
                                {student.prn || student.id}
                            </td>
                            <td className="p-4 font-medium text-gray-900">
                                {getStudentName(student)}
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex justify-end items-center gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        max={maxMarks}
                                        value={marks[student.id] || ''}
                                        placeholder="0"
                                        className="w-20 p-2 border border-gray-300 rounded text-right focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                    />
                                    <span className="text-gray-400 text-sm w-8">/ {maxMarks}</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {students.length > 0 && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end sticky bottom-0">
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="flex items-center bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? 'Saving...' : 'Submit Results'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GradingSheet;