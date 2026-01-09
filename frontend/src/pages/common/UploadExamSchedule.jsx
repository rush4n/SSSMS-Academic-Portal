import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { Upload, Calendar, CheckCircle, XCircle } from 'lucide-react';

const UploadExamSchedule = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await api.get('/exams/classes');
                setClasses(res.data);
            } catch (e) {
                console.error("Failed to load classes");
            }
        };
        fetchClasses();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        const formData = new FormData();
        formData.append('classId', selectedClass);
        formData.append('file', file);

        try {
            await api.post('/exams/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
            setStatus({ type: 'success', msg: 'Schedule Uploaded Successfully!' });
        } catch (e) {
            setStatus({ type: 'error', msg: 'Upload Failed.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Exam Scheduling</h1>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                {status && (
                    <div className={`p-4 mb-6 rounded-lg flex items-center ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {status.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />}
                        {status.msg}
                    </div>
                )}

                <form onSubmit={handleUpload} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Class Batch</label>
                        <select
                            value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full p-3 border rounded-lg bg-white" required
                        >
                            <option value="">-- Select Class --</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.batchName} (Sem {c.currentSemester})</option>
                            ))}
                        </select>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:border-blue-500 transition-colors">
                        <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="exam-upload" required />
                        <label htmlFor="exam-upload" className="cursor-pointer block">
                            <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <span className="text-gray-600 font-medium">{file ? file.name : "Click to Upload Schedule PDF"}</span>
                        </label>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
                        {loading ? 'Uploading...' : 'Publish Schedule'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadExamSchedule;