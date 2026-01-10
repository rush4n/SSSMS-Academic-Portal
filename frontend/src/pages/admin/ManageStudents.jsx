import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { Search, Edit2, Save, X, User, Filter } from 'lucide-react';

const ManageStudents = () => {
    // Data State
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');

    // Edit State
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    // 1. Fetch Data (with filters)
    const fetchStudents = async () => {
        setLoading(true);
        try {
            // Build Query String
            const params = new URLSearchParams();
            if (deptFilter) params.append('department', deptFilter);
            if (yearFilter) params.append('year', yearFilter);

            const res = await api.get(`/admin/students?${params.toString()}`);
            setStudents(res.data);
        } catch (e) {
            console.error("Failed to load students");
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch when filters change
    useEffect(() => {
        fetchStudents();
    }, [deptFilter, yearFilter]);

    // Client-side Search (For Name/PRN)
    const filteredStudents = students.filter(s =>
        s.firstName.toLowerCase().includes(search.toLowerCase()) ||
        s.lastName.toLowerCase().includes(search.toLowerCase()) ||
        s.prn.includes(search)
    );

    // Edit Handlers
    const startEdit = (student) => {
        setEditingId(student.id);
        setEditForm({ ...student });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const saveEdit = async () => {
        try {
            await api.put(`/admin/student/${editingId}`, editForm);
            setEditingId(null);
            fetchStudents(); // Refresh data
        } catch (e) {
            alert("Update failed");
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Student Directory</h1>
                    <p className="text-gray-600 mt-1">Manage enrollments and class assignments.</p>
                </div>
                <div className="text-sm text-gray-500">
                    Total Students: <span className="font-bold text-gray-900">{filteredStudents.length}</span>
                </div>
            </div>

            {/* Toolbar: Search & Filter */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">

                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        placeholder="Search Name or PRN..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                {/* Department Filter */}
                <select
                    value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
                    className="p-2 border rounded-lg text-sm bg-gray-50"
                >
                    <option value="">All Departments</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Interior Design">Interior Design</option>
                </select>

                {/* Year Filter */}
                <select
                    value={yearFilter} onChange={e => setYearFilter(e.target.value)}
                    className="p-2 border rounded-lg text-sm bg-gray-50"
                >
                    <option value="">All Years</option>
                    <option value="1">Year 1 (Sem 1-2)</option>
                    <option value="2">Year 2 (Sem 3-4)</option>
                    <option value="3">Year 3 (Sem 5-6)</option>
                    <option value="4">Year 4 (Sem 7-8)</option>
                    <option value="5">Year 5 (Sem 9-10)</option>
                </select>

                <button onClick={() => {setDeptFilter(''); setYearFilter(''); setSearch('')}} className="text-sm text-red-500 hover:underline">
                    Reset
                </button>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                    <tr>
                        <th className="p-4">Student Name</th>
                        <th className="p-4">PRN / ID</th>
                        <th className="p-4">Current Class</th>
                        <th className="p-4">Department</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading directory...</td></tr>
                    ) : filteredStudents.length === 0 ? (
                        <tr><td colSpan="5" className="p-8 text-center text-gray-500">No students found.</td></tr>
                    ) : (
                        filteredStudents.map(student => (
                            <tr key={student.id} className="hover:bg-gray-50 transition-colors">

                                {/* EDIT MODE */}
                                {editingId === student.id ? (
                                    <>
                                        <td className="p-4">
                                            <input name="firstName" value={editForm.firstName} onChange={handleEditChange} className="border p-1 rounded w-20 mr-1" placeholder="First" />
                                            <input name="lastName" value={editForm.lastName} onChange={handleEditChange} className="border p-1 rounded w-20" placeholder="Last" />
                                        </td>
                                        <td className="p-4 text-gray-400">{student.prn}</td>
                                        <td className="p-4">
                                            <select name="currentYear" value={editForm.currentYear} onChange={handleEditChange} className="border p-1 rounded bg-yellow-50 border-yellow-300">
                                                <option value="1">Year 1</option>
                                                <option value="2">Year 2</option>
                                                <option value="3">Year 3</option>
                                                <option value="4">Year 4</option>
                                                <option value="5">Year 5</option>
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <select name="department" value={editForm.department} onChange={handleEditChange} className="border p-1 rounded">
                                                <option value="Architecture">Architecture</option>
                                                <option value="Interior Design">Interior Design</option>
                                            </select>
                                        </td>
                                        <td className="p-4 text-right flex justify-end gap-2">
                                            <button onClick={saveEdit} className="text-green-600 hover:bg-green-100 p-1.5 rounded"><Save className="w-4 h-4"/></button>
                                            <button onClick={() => setEditingId(null)} className="text-gray-400 hover:bg-gray-100 p-1.5 rounded"><X className="w-4 h-4"/></button>
                                        </td>
                                    </>
                                ) : (
                                    /* VIEW MODE */
                                    <>
                                        <td className="p-4 font-medium text-gray-900 flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 font-bold text-xs">
                                                {student.firstName[0]}{student.lastName[0]}
                                            </div>
                                            {student.firstName} {student.lastName}
                                        </td>
                                        <td className="p-4 text-gray-500 font-mono">{student.prn}</td>
                                        <td className="p-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Year {student.currentYear}
                                </span>
                                        </td>
                                        <td className="p-4 text-gray-600">{student.department}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => startEdit(student)}
                                                className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
};

export default ManageStudents;