import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../auth/useAuth';
import { Bell, Megaphone, Send, Clock, User, XCircle, CheckCircle } from 'lucide-react';

const NoticesPage = () => {
    const { user } = useAuth();
    const [notices, setNotices] = useState([]);
    const [formData, setFormData] = useState({ title: '', content: '', targetRole: 'ALL' });
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ type: '', message: '' });

    const canPost = user.role === 'ROLE_ADMIN' || user.role === 'ROLE_FACULTY';

    const fetchNotices = async () => {
        try {
            const response = await api.get('/notices');
            setNotices(response.data);
        } catch (error) {
            console.error("Failed to load notices");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handlePost = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        try {
            await api.post('/notices', formData);
            setStatus({ type: 'success', message: 'Notice Posted Successfully!' });
            setFormData({ title: '', content: '', targetRole: 'ALL' });
            fetchNotices(); // Refresh list
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to post notice.' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Digital Notice Board</h1>
                    <p className="text-gray-600 mt-1">Updates and announcements from the institute.</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-full">
                    <Bell className="w-6 h-6 text-orange-600" />
                </div>
            </div>

            {/* Post Notice Form (Restricted) */}
            {canPost && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Megaphone className="w-5 h-5 mr-2 text-blue-600" /> Post New Announcement
                    </h2>

                    {status.message && (
                        <div className={`p-3 mb-4 rounded-lg flex items-center text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handlePost} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <input
                                    placeholder="Notice Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <select
                                    value={formData.targetRole}
                                    onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
                                    className="w-full p-2.5 border rounded-lg bg-gray-50"
                                >
                                    <option value="ALL">Everyone</option>
                                    <option value="STUDENT">Students Only</option>
                                    <option value="FACULTY">Faculty Only</option>
                                </select>
                            </div>
                        </div>
                        <textarea
                            placeholder="Write your message here..."
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            className="w-full p-2.5 border rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                        <div className="flex justify-end">
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center">
                                <Send className="w-4 h-4 mr-2" /> Publish Notice
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Notice Feed */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-gray-500 text-center py-8">Loading updates...</div>
                ) : notices.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
                        No notices posted yet.
                    </div>
                ) : (
                    notices.map((notice) => (
                        <div key={notice.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{notice.title}</h3>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    notice.target === 'ALL' ? 'bg-green-100 text-green-700' :
                                        notice.target === 'STUDENT' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                }`}>
                  {notice.target}
                </span>
                            </div>
                            <p className="text-gray-600 mb-4 whitespace-pre-wrap">{notice.content}</p>

                            <div className="flex items-center text-xs text-gray-400 pt-4 border-t border-gray-100">
                                <div className="flex items-center mr-4">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {new Date(notice.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center">
                                    <User className="w-3 h-3 mr-1" />
                                    {notice.author}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NoticesPage;