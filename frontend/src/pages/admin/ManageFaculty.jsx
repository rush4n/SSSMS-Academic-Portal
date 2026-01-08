import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { Trash2, Plus, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ManageFaculty = () => {
    const [facultyList, setFacultyList] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [allocations, setAllocations] = useState([]);

    // Form State
    const [subjectId, setSubjectId] = useState('');
    const [classId, setClassId] = useState('');

    // UI State
    const [status, setStatus] = useState({ type: '', message: '' }); // Toast
    const [deleteId, setDeleteId] = useState(null); // For Confirmation Modal

    // Data for Dropdowns (Mocked for now as per previous steps)
    const subjects = [
        { id: 1, name: 'History of Architecture (ARC-201)' },
        { id: 2, name: 'Building Construction (ARC-202)' },
        { id: 3, name: 'Urban Planning (ARC-401)' }
    ];
    const classes = [
        { id: 1, name: 'Second Year - Div A' },
        { id: 2, name: 'Third Year - Div A' }
    ];

    useEffect(() => {
        const loadFaculty = async () => {
            try {
                const response = await api.get('/admin/faculty/all');
                setFacultyList(response.data);
            } catch (error) {
                console.error("Failed to load faculty list");
            }
        };
        loadFaculty();
    }, []);

    const handleSelect = async (faculty) => {
        setSelectedFaculty(faculty);
        setStatus({ type: '', message: '' }); // Clear any old messages
        try {
            const response = await api.get(`/admin/faculty/${faculty.id}/allocations`);
            setAllocations(response.data);
        } catch (error) {
            setAllocations([]);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        try {
            await api.post('/admin/allocate-subject', {
                facultyId: selectedFaculty.id,
                subjectId: subjectId,
                classId: classId
            });

            // Success Toast
            setStatus({ type: 'success', message: 'Subject Assigned Successfully!' });

            // Reset Form
            setSubjectId('');
            setClassId('');

            handleSelect(selectedFaculty); // Refresh list

            // Auto-hide toast
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);

        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to assign subject. It might already be assigned.' });
        }
    };

    // Triggered when clicking Trash icon
    const confirmDelete = (id) => {
        setDeleteId(id);
    };

    // Triggered when clicking "Yes, Remove" in Modal
    const executeDelete = async () => {
        if (!deleteId) return;

        try {
            await api.delete(`/admin/allocation/${deleteId}`);
            setStatus({ type: 'success', message: 'Assignment Removed Successfully' });
            handleSelect(selectedFaculty); // Refresh list
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to remove assignment.' });
        } finally {
            setDeleteId(null); // Close Modal
        }
    };

    return (
        <div className="max-w-6xl mx-auto flex gap-6 h-[calc(100vh-100px)]">

            {/* LEFT COLUMN: Faculty List */}
            <div className="w-1/3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-700">
                    Faculty Members ({facultyList.length})
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-2">
                    {facultyList.map(f => (
                        <div
                            key={f.id}
                            onClick={() => handleSelect(f)}
                            className={`p-3 rounded-lg cursor-pointer flex items-center transition-colors ${
                                selectedFaculty?.id === f.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
                            }`}
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-3">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <p className={`font-semibold text-sm ${selectedFaculty?.id === f.id ? 'text-blue-700' : 'text-gray-800'}`}>
                                    {f.name}
                                </p>
                                <p className="text-xs text-gray-500">{f.email}</p>
                                <p className="text-xs text-gray-400">{f.designation}</p>
                            </div>
                            {selectedFaculty?.id === f.id && <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT COLUMN: Workload Manager */}
            <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-y-auto">
                {!selectedFaculty ? (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Select a faculty member to manage workload
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">{selectedFaculty.name}</h2>
                        <p className="text-gray-500 mb-6">{selectedFaculty.designation} • ID: {selectedFaculty.id}</p>

                        {/* STATUS BANNER (TOAST) */}
                        {status.message && (
                            <div className={`p-4 mb-6 rounded-lg flex items-center border ${
                                status.type === 'success'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                                {status.type === 'success' ? (
                                    <CheckCircle className="w-5 h-5 mr-3" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 mr-3" />
                                )}
                                <span className="font-medium">{status.message}</span>
                            </div>
                        )}

                        {/* Current List */}
                        <h3 className="font-semibold text-gray-700 mb-3">Current Assignments</h3>
                        <div className="bg-gray-50 rounded-lg border border-gray-200 mb-8 overflow-hidden">
                            {allocations.length === 0 ? (
                                <p className="p-4 text-gray-500 text-sm">No subjects assigned.</p>
                            ) : (
                                allocations.map(a => (
                                    <div key={a.id} className="p-4 flex justify-between items-center border-b last:border-0 border-gray-200">
                                        <div>
                                            <p className="font-bold text-gray-800">{a.subjectName}</p>
                                            <p className="text-xs text-gray-500">{a.className} • {a.division}</p>
                                        </div>
                                        <button
                                            onClick={() => confirmDelete(a.id)}
                                            className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors"
                                            title="Remove Assignment"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add New Form */}
                        <h3 className="font-semibold text-gray-700 mb-3">Assign New Subject</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="p-2.5 border rounded-lg w-full bg-white" required>
                                    <option value="">Select Subject</option>
                                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                                <select value={classId} onChange={(e) => setClassId(e.target.value)} className="p-2.5 border rounded-lg w-full bg-white" required>
                                    <option value="">Select Class</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center transition-colors">
                                <Plus className="w-4 h-4 mr-2" /> Assign Subject
                            </button>
                        </form>
                    </>
                )}
            </div>

            {/* Custom Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full border border-gray-200">
                        <h3 className="text-lg font-bold mb-2 text-gray-900">Remove Subject?</h3>
                        <p className="text-gray-600 mb-6 text-sm">
                            Are you sure you want to un-assign this subject from the faculty member?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium transition-colors shadow-sm"
                            >
                                Yes, Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ManageFaculty;