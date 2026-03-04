import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { ChevronDown, ChevronUp, BookOpen, Star, Download, FileText } from 'lucide-react';

const StudentResults = () => {
    const [sgpaResults, setSgpaResults] = useState([]);
    const [assessments, setAssessments] = useState({}); // Grouped by Subject
    const [scorecard, setScorecard] = useState(null);
    const [loading, setLoading] = useState(true);

    // State to track which subject is expanded
    const [expandedSubject, setExpandedSubject] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Final Ledger Results (SGPA)
                const sgpaRes = await api.get('/student/my-results');
                setSgpaResults(sgpaRes.data);

                // 2. Fetch Internal Assessments (raw marks)
                const assessRes = await api.get('/student/my-assessments');

                // Group assessments by Subject Name
                const grouped = assessRes.data.reduce((acc, curr) => {
                    const subject = curr.subjectName;
                    if (!acc[subject]) {
                        acc[subject] = [];
                    }
                    acc[subject].push(curr);
                    return acc;
                }, {});

                setAssessments(grouped);

                // 3. Fetch Cumulative Scorecard (calculated marks)
                const scorecardRes = await api.get('/student/scorecard');
                setScorecard(scorecardRes.data);

            } catch {
                console.error("Error loading results");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleSubject = (subject) => {
        if (expandedSubject === subject) {
            setExpandedSubject(null);
        } else {
            setExpandedSubject(subject);
        }
    };

    const downloadScorecard = () => {
        if (!scorecard) return;

        // Create HTML content for the scorecard
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Academic Scorecard - ${scorecard.studentName}</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; max-width: 900px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
        .header h1 { color: #1e40af; margin: 0; font-size: 28px; }
        .header p { color: #64748b; margin: 5px 0; }
        .student-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .student-info table { width: 100%; }
        .student-info td { padding: 8px; }
        .student-info td:first-child { font-weight: bold; color: #475569; width: 150px; }
        .subject-card { margin-bottom: 25px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
        .subject-header { background: linear-gradient(to right, #dbeafe, #e0e7ff); padding: 15px; font-weight: bold; font-size: 18px; color: #1e40af; }
        .marks-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding: 20px; }
        .marks-section { background: #f8fafc; padding: 15px; border-radius: 6px; }
        .marks-section h3 { margin: 0 0 15px 0; color: #334155; font-size: 14px; text-transform: uppercase; }
        .mark-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .mark-row:last-child { border-bottom: 2px solid #2563eb; font-weight: bold; }
        .mark-label { color: #64748b; }
        .mark-value { font-weight: bold; color: #1e293b; }
        .summary { background: linear-gradient(to right, #dbeafe, #e0e7ff); padding: 20px; border-radius: 8px; margin-top: 30px; }
        .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; text-align: center; }
        .summary-item { background: white; padding: 15px; border-radius: 6px; }
        .summary-label { color: #64748b; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
        .summary-value { color: #1e40af; font-size: 24px; font-weight: bold; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #94a3b8; font-size: 12px; }
        @media print { body { padding: 20px; } .no-print { display: none; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>CUMULATIVE ACADEMIC SCORECARD</h1>
        <p>Session: ${new Date().getFullYear()}</p>
    </div>

    <div class="student-info">
        <table>
            <tr>
                <td>Student Name:</td>
                <td><strong>${scorecard.studentName}</strong></td>
                <td>PRN:</td>
                <td><strong>${scorecard.prn}</strong></td>
            </tr>
            <tr>
                <td>Academic Year:</td>
                <td><strong>${scorecard.academicYear}</strong></td>
                <td>Semester:</td>
                <td><strong>${scorecard.semester || 'N/A'}</strong></td>
            </tr>
        </table>
    </div>

    ${scorecard.subjects.map(subject => `
    <div class="subject-card">
        <div class="subject-header">
            ${subject.subjectName} (${subject.subjectCode})
        </div>
        <div class="marks-grid">
            <div class="marks-section">
                <h3>Internal Assessment (ISE/ICA)</h3>
                <div class="mark-row">
                    <span class="mark-label">Best of 2 Unit Tests</span>
                    <span class="mark-value">${subject.utBestOf2 || 0}</span>
                </div>
                <div class="mark-row">
                    <span class="mark-label">ICA (Assignments + Jury)</span>
                    <span class="mark-value">${subject.ica || 0}</span>
                </div>
                <div class="mark-row">
                    <span class="mark-label">Total Internal</span>
                    <span class="mark-value">${subject.internalMarks || 0}</span>
                </div>
            </div>
            <div class="marks-section">
                <h3>External Assessment (ESE)</h3>
                <div class="mark-row">
                    <span class="mark-label">Theory</span>
                    <span class="mark-value">${subject.theoryMarks || 0}</span>
                </div>
                <div class="mark-row">
                    <span class="mark-label">Practical</span>
                    <span class="mark-value">${subject.practicalMarks || 0}</span>
                </div>
                <div class="mark-row">
                    <span class="mark-label">Sessional</span>
                    <span class="mark-value">${subject.sessionalMarks || 0}</span>
                </div>
                <div class="mark-row">
                    <span class="mark-label">Total External</span>
                    <span class="mark-value">${subject.externalMarks || 0}</span>
                </div>
            </div>
        </div>
        <div style="padding: 15px; background: #fefce8; border-top: 2px solid #eab308; text-align: center;">
            <strong>Subject Total: ${subject.total || 0}</strong>
        </div>
    </div>
    `).join('')}

    <div class="summary">
        <h2 style="text-align: center; color: #1e40af; margin-bottom: 20px;">OVERALL SUMMARY</h2>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-label">Total Internal</div>
                <div class="summary-value">${scorecard.totalInternal.toFixed(2)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Total External</div>
                <div class="summary-value">${scorecard.totalExternal.toFixed(2)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Grand Total</div>
                <div class="summary-value">${scorecard.grandTotal.toFixed(2)}</div>
            </div>
        </div>
    </div>

    <div class="footer">
        <p>Generated on ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
        <p>This is a system-generated document. No signature is required.</p>
    </div>
</body>
</html>
        `;

        // Create a blob and download
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Scorecard_${scorecard.prn}_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    if (loading) return <div className="p-8 text-gray-500">Loading academic data...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Academic Performance</h1>

            {/* SECTION 1: FINAL SGPA RESULTS */}
            <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    Term End Results (SGPA)
                </h2>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Exam Session</th>
                            <th className="p-4 font-semibold text-gray-600">Date Declared</th>
                            <th className="p-4 font-semibold text-gray-600">SGPA</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {sgpaResults.length === 0 ? (
                            <tr><td colSpan="4" className="p-6 text-center text-gray-500">No term results declared yet.</td></tr>
                        ) : (
                            sgpaResults.map((res) => (
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
            </div>

            {/* SECTION 2: CUMULATIVE SCORECARD */}
            {scorecard && scorecard.subjects && scorecard.subjects.length > 0 && (
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-purple-600" />
                            Cumulative Semester Scorecard
                        </h2>
                        <button
                            onClick={downloadScorecard}
                            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                        >
                            <Download className="w-4 h-4" />
                            Download Scorecard
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6 mb-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-white rounded-lg p-3">
                                <p className="text-xs text-gray-600 font-semibold">Student Name</p>
                                <p className="text-sm font-bold text-gray-900">{scorecard.studentName}</p>
                            </div>
                            <div className="bg-white rounded-lg p-3">
                                <p className="text-xs text-gray-600 font-semibold">PRN</p>
                                <p className="text-sm font-bold text-gray-900">{scorecard.prn}</p>
                            </div>
                            <div className="bg-white rounded-lg p-3">
                                <p className="text-xs text-gray-600 font-semibold">Year</p>
                                <p className="text-sm font-bold text-gray-900">{scorecard.academicYear}</p>
                            </div>
                            <div className="bg-white rounded-lg p-3">
                                <p className="text-xs text-gray-600 font-semibold">Total Subjects</p>
                                <p className="text-sm font-bold text-gray-900">{scorecard.totalSubjects}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-blue-100 rounded-lg p-4 text-center border-2 border-blue-300">
                                <p className="text-xs text-blue-700 font-bold mb-1">TOTAL INTERNAL</p>
                                <p className="text-2xl font-bold text-blue-900">{scorecard.totalInternal.toFixed(2)}</p>
                            </div>
                            <div className="bg-purple-100 rounded-lg p-4 text-center border-2 border-purple-300">
                                <p className="text-xs text-purple-700 font-bold mb-1">TOTAL EXTERNAL</p>
                                <p className="text-2xl font-bold text-purple-900">{scorecard.totalExternal.toFixed(2)}</p>
                            </div>
                            <div className="bg-green-100 rounded-lg p-4 text-center border-2 border-green-300">
                                <p className="text-xs text-green-700 font-bold mb-1">GRAND TOTAL</p>
                                <p className="text-2xl font-bold text-green-900">{scorecard.grandTotal.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Subject-wise breakdown in scorecard */}
                    <div className="space-y-3">
                        {scorecard.subjects.map((subject, idx) => (
                            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{subject.subjectName}</h3>
                                        <p className="text-xs text-gray-500">{subject.subjectCode}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-600 font-semibold">Total</p>
                                        <p className="text-2xl font-bold text-purple-600">{subject.total || 0}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="bg-blue-50 rounded p-2">
                                        <p className="text-xs text-blue-700 font-semibold mb-1">Internal (ISE/ICA)</p>
                                        <div className="space-y-1 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Best of 2 UTs:</span>
                                                <span className="font-bold">{subject.utBestOf2 || 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">ICA:</span>
                                                <span className="font-bold">{subject.ica || 0}</span>
                                            </div>
                                            <div className="flex justify-between border-t border-blue-200 pt-1">
                                                <span className="font-semibold">Total:</span>
                                                <span className="font-bold text-blue-900">{subject.internalMarks || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-purple-50 rounded p-2">
                                        <p className="text-xs text-purple-700 font-semibold mb-1">External (ESE)</p>
                                        <div className="space-y-1 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Theory:</span>
                                                <span className="font-bold">{subject.theoryMarks || 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Practical:</span>
                                                <span className="font-bold">{subject.practicalMarks || 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Sessional:</span>
                                                <span className="font-bold">{subject.sessionalMarks || 0}</span>
                                            </div>
                                            <div className="flex justify-between border-t border-purple-200 pt-1">
                                                <span className="font-semibold">Total:</span>
                                                <span className="font-bold text-purple-900">{subject.externalMarks || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SECTION 3: SUBJECT WISE ASSESSMENTS (RAW MARKS) */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                    Subject-wise Assessments
                </h2>

                {Object.keys(assessments).length === 0 ? (
                    <div className="p-6 bg-white rounded-xl border border-gray-200 text-gray-500 text-center">
                        No assessment marks uploaded yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {Object.keys(assessments).map((subject, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                {/* Subject Header (Clickable) */}
                                <div
                                    onClick={() => toggleSubject(subject)}
                                    className="p-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{subject}</h3>
                                        <p className="text-xs text-gray-500">{assessments[subject][0]?.subjectCode}</p>
                                    </div>
                                    <div className="text-gray-400">
                                        {expandedSubject === subject ? <ChevronUp /> : <ChevronDown />}
                                    </div>
                                </div>

                                {/* Expanded Marks Table */}
                                {expandedSubject === subject && (
                                    <div className="p-4 bg-white border-t border-gray-200">
                                        <table className="w-full text-sm">
                                            <thead>
                                            <tr className="text-left text-gray-500 border-b border-gray-100">
                                                <th className="pb-2 font-medium">Exam Type</th>
                                                <th className="pb-2 font-medium text-right">Scored</th>
                                                <th className="pb-2 font-medium text-right">Total</th>
                                                <th className="pb-2 font-medium text-right">Percentage</th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                            {assessments[subject].map((mark) => {
                                                const percentage = ((mark.obtained / mark.max) * 100).toFixed(1);
                                                let colorClass = "text-gray-900";
                                                if (percentage < 35) colorClass = "text-red-600 font-bold";
                                                else if (percentage >= 75) colorClass = "text-green-600 font-bold";

                                                return (
                                                    <tr key={mark.id}>
                                                        <td className="py-3 text-gray-800">{mark.examType}</td>
                                                        <td className={`py-3 text-right ${colorClass}`}>{mark.obtained}</td>
                                                        <td className="py-3 text-right text-gray-500">{mark.max}</td>
                                                        <td className={`py-3 text-right ${colorClass}`}>{percentage}%</td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default StudentResults;