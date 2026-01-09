import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { Upload, FileText, User, Users } from 'lucide-react';

const ManageTimetables = () => {
    // Data
    const [facultyList, setFacultyList] = useState([]);
    const [classes, setClasses] = useState([
        { id: 1, name: "Second Year B.Arch" }, // Mock data (or fetch from API)
        { id: 2, name: "Third Year B.Arch" }
    ]);

    // Selection
    const [uploadType, setUploadType] = useState('CLASS'); // CLASS or FACULTY
    const [selectedId, setSelectedId] = useState('');
    const [file, setFile] = useState(null);

    // UI
    const [status, setStatus] = useState(null);

    useEffect(() => {
        // Fetch faculty list
        const loadData = async () => {
            try {
                const res = await api.get('/admin/faculty/all');
                setFacultyList(res.data);
            } catch (e) {}
        };
        loadData();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        let url = '';
        if(uploadType === 'CLASS') {
            url = '/timetable/upload/class';
            formData.append('classId', selectedId);
        } else {
            url = '/timetable/upload/faculty';
            formData.append('facultyId', selectedId);
        }

        try {
            await api.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
            setStatus({ type: 'success', msg: 'Timetable Uploaded Successfully!' });
        } catch(e) {
            setStatus({ type: 'error', msg: 'Upload Failed.' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Timetable Management</h1>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">

                {/* Toggle */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setUploadType('CLASS')}
                        className={`flex-1 p-4 rounded-lg border-2 flex items-center justify-center font-bold ${uploadType === 'CLASS' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500'}`}
                    >
                        <Users className="w-5 h-5 mr-2" /> Class Timetable
                    </button>
                    <button
                        onClick={() => setUploadType('FACULTY')}
                        className={`flex-1 p-4 rounded-lg border-2 flex items-center justify-center font-bold ${uploadType === 'FACULTY' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-500'}`}
                    >
                        <User className="w-5 h-5 mr-2" /> Faculty Timetable
                    </button>
                </div>

                {status && <div className={`p-4 mb-4 rounded-lg text-center ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100'}`}>{status.msg}</div>}

                <form onSubmit={handleUpload} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Target</label>
                        <select
                            value={selectedId} onChange={(e) => setSelectedId(e.target.value)}
                            className="w-full p-3 border rounded-lg" required
                        >
                            <option value="">-- Select --</option>
                            {uploadType === 'CLASS'
                                ? classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                                : facultyList.map(f => <option key={f.id} value={f.id}>{f.name}</option>)
                            }
                        </select>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                        <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="tt-upload" required />
                        <label htmlFor="tt-upload" className="cursor-pointer block">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <span className="text-gray-600">{file ? file.name : "Click to select PDF"}</span>
                        </label>
                    </div>

                    <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold">Upload PDF</button>
                </form>
            </div>
        </div>
    );
};
export default ManageTimetables;