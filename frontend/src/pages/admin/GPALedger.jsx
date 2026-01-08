import React, { useState } from 'react';
import api from '../../api/axiosConfig';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';

const GPALedger = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setStatus({ type: '', message: '' });

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/admin/upload-results', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatus({ type: 'success', message: response.data });
            setFile(null);
        } catch (error) {
            setStatus({ type: 'error', message: 'Parsing Failed. Check PDF format.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">GPA Ledger</h1>
            <p className="text-gray-600 mb-8">Upload University Result PDF to auto-update student records.</p>

            {status.message && (
                <div className={`p-4 mb-6 rounded-lg flex items-center border ${
                    status.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                    {status.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3"/> : <XCircle className="w-5 h-5 mr-3"/>}
                    {status.message}
                </div>
            )}

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <form onSubmit={handleUpload} className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-blue-500 transition-colors bg-gray-50">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="hidden"
                            id="ledger-upload"
                        />
                        <label htmlFor="ledger-upload" className="cursor-pointer flex flex-col items-center">
                            <Upload className="w-12 h-12 text-gray-400 mb-4" />
                            <span className="text-lg font-medium text-gray-900">
                {file ? file.name : "Drop PDF here or Click to Upload"}
              </span>
                            <span className="text-sm text-gray-500 mt-2">Supported Format: .pdf (University Ledger)</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !file}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Processing & Parsing...' : 'Process Results'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GPALedger;