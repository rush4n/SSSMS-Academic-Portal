import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

const StudentTimetable = () => {
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/timetable/student/me');
                if (res.data.exists) {
                    // Point to the backend endpoint that serves the file inline
                    setPdfUrl(`http://localhost:8080/api/timetable/view/${res.data.fileName}`);
                }
            } catch (e) {}
        };
        fetch();
    }, []);

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-100px)]">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Class Timetable</h1>

            {pdfUrl ? (
                <div className="w-full h-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <iframe src={pdfUrl} className="w-full h-full" title="Timetable"></iframe>
                </div>
            ) : (
                <div className="p-10 text-center text-gray-500 bg-white border rounded-xl">
                    No timetable uploaded for your class yet.
                </div>
            )}
        </div>
    );
};
export default StudentTimetable;