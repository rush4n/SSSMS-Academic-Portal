import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { BarChart3, Calendar, ArrowLeft, Download } from 'lucide-react';

const AttendanceReport = () => {
    const { id } = useParams(); // Allocation ID
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Filters
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchReport = async () => {
        setLoading(true);
        try {
            let url = `/faculty/report/${id}`;
            if (startDate && endDate) {
                url += `?startDate=${startDate}&endDate=${endDate}`;
            }
            const response = await api.get(url);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching report");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    return (
        <div className="max-w-5xl mx-auto">
            <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-gray-600 hover:text-blue-600">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Attendance Report</h1>
                    <p className="text-gray-600 mt-1">
                        {data ? `${data.subjectName} (${data.className})` : 'Loading...'}
                    </p>
                </div>

                {/* Filters */}
                <div className="flex gap-2 items-center bg-white p-2 rounded-lg border shadow-sm">
                    <span className="text-xs font-bold text-gray-500 uppercase px-2">Filter:</span>
                    <input
                        type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                        className="border rounded p-1 text-sm"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                        className="border rounded p-1 text-sm"
                    />
                    <button
                        onClick={fetchReport}
                        className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700"
                    >
                        Apply
                    </button>
                    <button
                        onClick={() => {setStartDate(''); setEndDate(''); fetchReport();}}
                        className="text-red-500 text-xs hover:underline px-2"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="p-10 text-center text-gray-500">Generating Analysis...</div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-gray-500 text-xs font-bold uppercase">Total Sessions</p>
                            <p className="text-3xl font-bold text-gray-900">{data?.totalSessionsHeld}</p>
                            <p className="text-xs text-gray-400 mt-1">{data?.range}</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-gray-500 text-xs font-bold uppercase">Average Attendance</p>
                            <p className="text-3xl font-bold text-blue-600">
                                {data?.studentStats.length > 0
                                    ? Math.round(data.studentStats.reduce((acc, s) => acc + s.percentage, 0) / data.studentStats.length)
                                    : 0}%
                            </p>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-600 uppercase">
                            <tr>
                                <th className="p-4">Student Name</th>
                                <th className="p-4">PRN</th>
                                <th className="p-4">Present / Total</th>
                                <th className="p-4">Percentage</th>
                                <th className="p-4">Status</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {data?.studentStats.map((s, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-900">{s.studentName}</td>
                                    <td className="p-4 text-gray-500 font-mono">{s.prn}</td>
                                    <td className="p-4 text-gray-700">
                                        <span className="font-bold">{s.sessionsAttended}</span> / {data.totalSessionsHeld}
                                    </td>
                                    <td className="p-4 font-bold">
                                        {s.percentage}%
                                    </td>
                                    <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        s.percentage >= 75 ? 'bg-green-100 text-green-700' :
                                            s.percentage >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                    }`}>
                                        {s.percentage >= 75 ? 'Good' : s.percentage >= 50 ? 'Warning' : 'Critical'}
                                    </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default AttendanceReport;