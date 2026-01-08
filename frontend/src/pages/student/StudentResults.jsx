import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

const StudentResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await api.get('/student/my-results');
                setResults(response.data);
            } catch (error) {
                console.error("Error loading results");
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    if (loading) return <div className="p-8 text-gray-500">Loading results...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Academic Performance</h1>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="p-4 font-semibold text-gray-600">Exam Session</th>
                        <th className="p-4 font-semibold text-gray-600">Date Declared</th>
                        <th className="p-4 font-semibold text-gray-600">SGPA</th>
                        <th className="p-4 font-semibold text-gray-600">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {results.length === 0 ? (
                        <tr><td colSpan="4" className="p-6 text-center text-gray-500">No results found.</td></tr>
                    ) : (
                        results.map((res) => (
                            <tr key={res.id} className="hover:bg-gray-50">
                                <td className="p-4 text-gray-900">{res.examSession}</td>
                                <td className="p-4 text-gray-500">{new Date(res.resultDate).toLocaleDateString()}</td>
                                <td className="p-4 font-bold text-blue-600">{res.sgpa}</td>
                                <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                            res.status === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {res.status}
                        </span>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentResults;