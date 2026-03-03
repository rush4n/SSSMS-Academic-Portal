//check

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { Save, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const GradingSheet = () => {
    const { id } = useParams(); // Allocation ID
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({}); // { studentId: value }
    const [examType, setExamType] = useState('UNIT_TEST_1');
    const [maxMarks, setMaxMarks] = useState(20);

    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(null);

    // 1. Fetch Roster
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get(`/faculty/allocation/${id}/students`);
                setStudents(response.data);
            } catch (error) {
                setStatus({ type: 'error', msg: 'Failed to load students' });
            }
        };
        fetchStudents();
    }, [id]);

    // 2. Handle Mark Input
    const handleMarkChange = (studentId, value) => {
        setMarks(prev => ({
            ...prev,
            [studentId]: value
        }));
    };

    // 3. Submit Marks
    const handleSubmit = async () => {
        setSaving(true);
        setStatus(null);

        // Convert map to list of DTOs
        const requests = students.map(s => ({
            studentId: s.id,
            allocationId: parseInt(id),
            examType: examType,
            marks: parseFloat(marks[s.id] || 0),
            maxMarks: parseFloat(maxMarks)
        }));

        try {
            await api.post('/faculty/marks/batch', requests);
            setStatus({ type: 'success', msg: 'Marks Saved Successfully!' });
            setTimeout(() => navigate('/faculty/dashboard'), 2000);
        } catch (error) {
            setStatus({ type: 'error', msg: 'Failed to save marks.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-gray-600 hover:text-blue-600">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Enter Assessment Marks</h1>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                        <select
                            value={examType} onChange={e => setExamType(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        >
                            <option value="UNIT_TEST_1">Unit Test 1</option>
                            <option value="UNIT_TEST_2">Unit Test 2</option>
                            <option value="UNIT_TEST_3">Unit Test 3</option>
                            <option value="ASSIGNMENT">Assignment</option>
                            <option value="JURY">Jury</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks</label>
                        <input
                            type="number" value={maxMarks} onChange={e => setMaxMarks(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                </div>
            </div>

            {status && (
                <div className={`p-4 mb-6 rounded-lg flex items-center ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {status.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2"/> : <XCircle className="w-5 h-5 mr-2"/>}
                    {status.msg}
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="p-4">Student</th>
                        <th className="p-4">PRN</th>
                        <th className="p-4 w-32">Marks</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {students.map(s => (
                        <tr key={s.id} className="hover:bg-gray-50">
                            <td className="p-4 font-medium">{s.firstName} {s.lastName}</td>
                            <td className="p-4 text-gray-500 font-mono">{s.prn}</td>
                            <td className="p-4">
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="w-full p-2 border rounded text-center font-bold"
                                    onChange={(e) => handleMarkChange(s.id, e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="p-4 bg-gray-50 border-t flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Submit Marks'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GradingSheet;