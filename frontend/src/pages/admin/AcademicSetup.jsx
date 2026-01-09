import React, { useState } from 'react';
import api from '../../api/axiosConfig';
import { BookOpen, Users, Plus, CheckCircle, XCircle } from 'lucide-react';

const AcademicSetup = () => {
    // Subject state (No semester)
    const [subject, setSubject] = useState({ name: '', code: '', department: 'Architecture' });

    // Batch state (Includes semester)
    const [batch, setBatch] = useState({ batchName: '', division: '', academicYear: 2025, currentSemester: '' });

    // Separate status for each form
    const [subjectStatus, setSubjectStatus] = useState(null);
    const [batchStatus, setBatchStatus] = useState(null);

    const handleSubject = async (e) => {
        e.preventDefault();
        setSubjectStatus(null);
        try {
            await api.post('/admin/subjects', subject);
            setSubjectStatus({ type: 'success', msg: 'Subject Created Successfully!' });
            // Reset form
            setSubject({ name: '', code: '', department: 'Architecture' });
            setTimeout(() => setSubjectStatus(null), 3000);
        } catch(e) {
            setSubjectStatus({ type: 'error', msg: 'Failed to create subject.' });
        }
    };

    const handleBatch = async (e) => {
        e.preventDefault();
        setBatchStatus(null);
        try {
            await api.post('/admin/classes', batch);
            setBatchStatus({ type: 'success', msg: 'Class Batch Created Successfully!' });
            setBatch({ batchName: '', division: '', academicYear: 2025, currentSemester: '' });
            setTimeout(() => setBatchStatus(null), 3000);
        } catch(e) {
            setBatchStatus({ type: 'error', msg: 'Failed to create class.' });
        }
    };

    // Helper for Status Banner
    const StatusBanner = ({ status }) => {
        if (!status) return null;
        return (
            <div className={`p-4 mb-4 rounded-lg flex items-center border ${
                status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
            }`}>
                {status.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3"/> : <XCircle className="w-5 h-5 mr-3"/>}
                <span className="font-medium">{status.msg}</span>
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Setup</h1>
                <p className="text-gray-600">Define the core structure of the college.</p>
            </div>

            {/* 1. Create Subject Section */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900">
                    <div className="bg-blue-50 p-2 rounded-lg mr-3 text-blue-600">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    Add New Subject
                </h2>

                <StatusBanner status={subjectStatus} />

                <form onSubmit={handleSubject} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                            <input
                                placeholder="e.g. Design III"
                                value={subject.name} onChange={e=>setSubject({...subject, name: e.target.value})}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
                            <input
                                placeholder="e.g. ARC-301"
                                value={subject.code} onChange={e=>setSubject({...subject, code: e.target.value})}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <select
                                value={subject.department} onChange={e=>setSubject({...subject, department: e.target.value})}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="Architecture">Architecture</option>
                                <option value="Interior Design">Interior Design</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                            Create Subject
                        </button>
                    </div>
                </form>
            </div>

            {/* 2. Create Class Section */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900">
                    <div className="bg-green-50 p-2 rounded-lg mr-3 text-green-600">
                        <Users className="w-6 h-6" />
                    </div>
                    Add Class Batch
                </h2>

                <StatusBanner status={batchStatus} />

                <form onSubmit={handleBatch} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
                            <input
                                placeholder="e.g. Third Year"
                                value={batch.batchName} onChange={e=>setBatch({...batch, batchName: e.target.value})}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                            <input
                                placeholder="e.g. A"
                                value={batch.division} onChange={e=>setBatch({...batch, division: e.target.value})}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Semester</label>
                            <input
                                type="number" placeholder="e.g. 5"
                                value={batch.currentSemester} onChange={e=>setBatch({...batch, currentSemester: e.target.value})}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm">
                            Create Class
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
};
export default AcademicSetup;