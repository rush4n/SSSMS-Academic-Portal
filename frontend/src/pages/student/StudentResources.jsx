import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { FileText, Download, ArrowLeft } from 'lucide-react';

const StudentResources = () => {
    const { subjectCode } = useParams();
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await api.get(`/resources/student/${subjectCode}`);
                setResources(response.data);
            } catch (error) {
                console.error("Failed to load resources");
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, [subjectCode]);

    const handleDownload = async (fileName, title) => {
        try {
            const response = await api.get(`/resources/download/${fileName}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', title + ".pdf");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert("Download failed");
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-gray-600 hover:text-blue-600">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <h1 className="text-2xl font-bold text-gray-900 mb-6">Study Materials: {subjectCode}</h1>

            {loading ? (
                <div className="text-gray-500">Loading...</div>
            ) : resources.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
                    No materials uploaded for this subject yet.
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 shadow-sm">
                    {resources.map((res, index) => (
                        <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-4">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">{res.title}</h4>
                                    <p className="text-xs text-gray-500">{new Date(res.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDownload(res.fileName, res.title)}
                                className="text-gray-400 hover:text-blue-600 p-2"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentResources;