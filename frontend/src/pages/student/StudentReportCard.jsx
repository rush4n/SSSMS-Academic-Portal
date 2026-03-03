//check

import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

const StudentReportCard = () => {
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await api.get('/student/report-card');
                setReport(res.data);
            } catch (e) {
                console.error("Failed to load report card");
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, []);

    if (loading) return <div className="p-8 text-gray-500">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Internal Assessment Report</h1>

            <div className="grid gap-6">
                {report.map((subject, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">{subject.subjectName}</h2>
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-mono">{subject.subjectCode}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-xs text-blue-600 uppercase font-bold">Internal (Total)</p>
                                <p className="text-2xl font-bold text-blue-900">{subject.internalMarks}</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <p className="text-xs text-purple-600 uppercase font-bold">External (Theory)</p>
                                <p className="text-2xl font-bold text-purple-900">{subject.externalMarks || '-'}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                                <p className="text-xs text-green-600 uppercase font-bold">Final Score</p>
                                <p className="text-3xl font-bold text-green-900">{subject.total}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>    );
};

export default StudentReportCard;