import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { Banknote, CheckCircle, AlertCircle, Search, XCircle } from 'lucide-react';

const FeeManagement = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Payment Modal State
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [payAmount, setPayAmount] = useState('');

    // Toast Status State
    const [status, setStatus] = useState({ type: '', message: '' });

    const fetchFees = async () => {
        try {
            const response = await api.get('/admin/fees');
            setRecords(response.data);
        } catch (error) {
            console.error("Failed to fetch fees");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFees();
    }, []);

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!selectedStudent || !payAmount) return;

        // Clear previous status
        setStatus({ type: '', message: '' });

        try {
            await api.post('/admin/fees/pay', {
                studentId: selectedStudent.studentId,
                amount: parseFloat(payAmount)
            });

            // Show Success Toast
            setStatus({ type: 'success', message: 'Payment Recorded Successfully!' });

            setSelectedStudent(null);
            setPayAmount('');
            fetchFees(); // Refresh table

            // Auto-hide after 3 seconds
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);

        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to record payment. Please try again.' });
        }
    };

    const filteredRecords = records.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.prn.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
                    <p className="text-gray-600 mt-1">Track student payments and dues.</p>
                </div>
                <div className="bg-green-50 p-3 rounded-full">
                    <Banknote className="w-6 h-6 text-green-600" />
                </div>
            </div>

            {/* Status Toast Banner */}
            {status.message && (
                <div className={`p-4 mb-6 rounded-lg flex items-center border ${
                    status.type === 'success'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                    {status.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 mr-3" />
                    ) : (
                        <XCircle className="w-5 h-5 mr-3" />
                    )}
                    <span className="font-medium">{status.message}</span>
                </div>
            )}

            {/* Search Bar */}
            <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search by Name or PRN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-shadow hover:shadow-sm"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="p-4 font-semibold text-gray-600">Student</th>
                        <th className="p-4 font-semibold text-gray-600">PRN</th>
                        <th className="p-4 font-semibold text-gray-600">Total Fee</th>
                        <th className="p-4 font-semibold text-gray-600">Paid</th>
                        <th className="p-4 font-semibold text-gray-600">Balance</th>
                        <th className="p-4 font-semibold text-gray-600">Status</th>
                        <th className="p-4 font-semibold text-gray-600">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {filteredRecords.map((record) => (
                        <tr key={record.studentId} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-medium text-gray-900">{record.name}</td>
                            <td className="p-4 text-gray-500 font-mono text-sm">{record.prn}</td>
                            <td className="p-4 text-gray-900">₹{record.total.toLocaleString()}</td>
                            <td className="p-4 text-green-600">₹{record.paid.toLocaleString()}</td>
                            <td className="p-4 text-red-600 font-medium">₹{record.balance.toLocaleString()}</td>
                            <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      record.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {record.status === 'PAID' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                      {record.status}
                  </span>
                            </td>
                            <td className="p-4">
                                {record.status !== 'PAID' && (
                                    <button
                                        onClick={() => setSelectedStudent(record)}
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                                    >
                                        Record Pay
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {filteredRecords.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No records found.</div>
                )}
            </div>

            {/* Payment Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full border border-gray-200">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">Record Payment</h3>
                        <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
                            <p className="text-gray-600 text-sm">Student: <span className="font-semibold text-gray-900">{selectedStudent.name}</span></p>
                            <p className="text-gray-600 text-sm mt-1">Balance Due: <span className="font-semibold text-red-600">₹{selectedStudent.balance.toLocaleString()}</span></p>
                        </div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Pay</label>
                        <input
                            type="number"
                            placeholder="Enter Amount"
                            value={payAmount}
                            onChange={(e) => setPayAmount(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-green-500 outline-none"
                            autoFocus
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePayment}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
                            >
                                Confirm Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeManagement;