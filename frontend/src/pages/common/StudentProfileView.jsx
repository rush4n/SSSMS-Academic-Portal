import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { User, Mail, Calendar, Book, TrendingUp, Clock, ArrowLeft, Phone, MapPin, ShieldCheck, Edit2, Save, X, CheckCircle, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const StudentProfileView = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Edit state (Admin only)
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(null);
    const [resettingPassword, setResettingPassword] = useState(false);
    const [confirmDlg, setConfirmDlg] = useState(null);

    const isAdmin = user.role === 'ROLE_ADMIN';

    const fetchUrl = isAdmin
        ? `/admin/student/${id}/profile`
        : `/faculty/student/${id}/profile`;

    const fetchProfile = async () => {
        try {
            const response = await api.get(fetchUrl);
            setProfile(response.data);
        } catch {
            console.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, fetchUrl]);

    // Edit functions (Admin only)
    const startEdit = () => {
        setEditForm({
            firstName: profile.firstName || '',
            middleName: profile.middleName || '',
            lastName: profile.lastName || '',
            phoneNumber: profile.phoneNumber || '',
            parentPhoneNumber: profile.parentPhoneNumber || '',
            address: profile.address || '',
            dob: profile.dob || '',
            coaEnrollmentNo: profile.coaEnrollmentNo || '',
            grNo: profile.grNo || '',
            aadharNo: profile.aadharNo || '',
            abcId: profile.abcId || '',
            bloodGroup: profile.bloodGroup || '',
            academicYear: profile.currentYear || 'FIRST_YEAR',
            admissionCategory: profile.admissionCategory || 'CAP_ROUND_1'
        });
        setIsEditing(true);
        setStatus(null);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditForm({});
        setStatus(null);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const saveProfile = async () => {
        setSaving(true);
        setStatus(null);

        // Basic validation
        if (!editForm.firstName || !/^[A-Za-z\s]{2,50}$/.test(editForm.firstName)) {
            setStatus({ type: 'error', msg: 'First name: letters only, 2–50 chars.' });
            setSaving(false);
            return;
        }
        if (!editForm.lastName || !/^[A-Za-z\s]{2,50}$/.test(editForm.lastName)) {
            setStatus({ type: 'error', msg: 'Last name: letters only, 2–50 chars.' });
            setSaving(false);
            return;
        }
        if (editForm.phoneNumber && !/^\d{10}$/.test(editForm.phoneNumber)) {
            setStatus({ type: 'error', msg: 'Phone number must be 10 digits.' });
            setSaving(false);
            return;
        }
        if (editForm.aadharNo && !/^\d{12}$/.test(editForm.aadharNo)) {
            setStatus({ type: 'error', msg: 'Aadhar number must be 12 digits.' });
            setSaving(false);
            return;
        }

        try {
            await api.put(`/admin/student/${id}/profile`, editForm);
            setStatus({ type: 'success', msg: 'Profile updated successfully!' });
            setIsEditing(false);
            fetchProfile(); // Refresh profile data
        } catch (error) {
            setStatus({ type: 'error', msg: error.response?.data || 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    const resetPassword = async () => {
        setConfirmDlg({
            message: "Are you sure you want to reset this student's password to default (LastName@DDMMYY)?",
            confirmLabel: 'Reset Password',
            onConfirm: async () => {
                setResettingPassword(true);
                setStatus(null);
                try {
                    await api.post(`/admin/student/${id}/reset-password`);
                    setStatus({ type: 'success', msg: 'Password reset to default successfully!' });
                    setTimeout(() => setStatus(null), 3000);
                } catch (error) {
                    setStatus({ type: 'error', msg: error.response?.data || 'Failed to reset password.' });
                    setTimeout(() => setStatus(null), 5000);
                } finally {
                    setResettingPassword(false);
                }
            }
        });
    };

    if (loading) return <div className="p-8 text-gray-500">Loading Profile...</div>;
    if (!profile) return <div className="p-8 text-red-500">Profile not found.</div>;

    const stats = [
        { label: 'Current GPA', value: profile.cgpa || 'N/A', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Attendance', value: `${profile.overallAttendance}%`, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    ];

    const DetailItem = ({ label, value, icon: Icon, mono }) => (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">{label}</label>
            <div className={`flex items-center text-gray-900 font-medium ${mono ? 'font-mono' : ''}`}>
                {Icon && <Icon className="w-4 h-4 mr-2 text-gray-400" />}
                {value || "N/A"}
            </div>
        </div>
    );

    const EditableField = ({ label, name, value, type = 'text', options = null, placeholder = '' }) => (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">{label}</label>
            {options ? (
                <select
                    name={name}
                    value={value ?? ''}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value ?? ''}
                    onChange={handleEditChange}
                    placeholder={placeholder}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            )}
        </div>
    );

    const academicYearOptions = [
        { value: 'FIRST_YEAR', label: 'First Year' },
        { value: 'SECOND_YEAR', label: 'Second Year' },
        { value: 'THIRD_YEAR', label: 'Third Year' },
        { value: 'FOURTH_YEAR', label: 'Fourth Year' },
        { value: 'FIFTH_YEAR', label: 'Fifth Year' }
    ];

    const admissionCategoryOptions = [
        { value: 'CAP_ROUND_1', label: 'CAP Round 1' },
        { value: 'CAP_ROUND_2', label: 'CAP Round 2' },
        { value: 'CAP_ROUND_3', label: 'CAP Round 3' },
        { value: 'VACANCY_AGAINST_CAP', label: 'Vacancy Against CAP' },
        { value: 'INSTITUTE_LEVEL', label: 'Institute Level' }
    ];

    const bloodGroupOptions = [
        { value: '', label: 'Select Blood Group' },
        { value: 'A+', label: 'A+' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B-', label: 'B-' },
        { value: 'AB+', label: 'AB+' },
        { value: 'AB-', label: 'AB-' },
        { value: 'O+', label: 'O+' },
        { value: 'O-', label: 'O-' }
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Student Profile View</h1>
                    <p className="text-gray-600 mt-1">Viewing academic details for {profile.firstName}.</p>
                </div>
                {isAdmin && !isEditing && (
                    <div className="flex gap-2">
                        <button
                            onClick={resetPassword}
                            disabled={resettingPassword}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50"
                        >
                            <KeyRound className="w-4 h-4" /> {resettingPassword ? 'Resetting...' : 'Reset Password'}
                        </button>
                        <button
                            onClick={startEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            <Edit2 className="w-4 h-4" /> Edit Profile
                        </button>
                    </div>
                )}
                {isAdmin && isEditing && (
                    <div className="flex gap-2">
                        <button
                            onClick={saveProfile}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            onClick={cancelEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-sm"
                        >
                            <X className="w-4 h-4" /> Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* Status Message */}
            {status && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
                    status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                    {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {status.msg}
                </div>
            )}

            {/* Hero */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shrink-0 border-4 border-white shadow-sm">
                    <User className="w-12 h-12" />
                </div>
                <div className="text-center md:text-left flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{profile.firstName} {profile.middleName} {profile.lastName}</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm text-gray-600">
                        <span className="flex items-center"><Mail className="w-4 h-4 mr-1"/> {profile.email}</span>
                        <span className="flex items-center"><Book className="w-4 h-4 mr-1"/> {profile.department}</span>
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> Year {profile.currentYear}</span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center">
                        <div className={`p-3 rounded-lg mr-4 ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">Personal & Academic Details</h3>
                    {isEditing && <p className="text-sm text-indigo-600 mt-1">Edit mode enabled - make changes and save</p>}
                </div>

                {isEditing ? (
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <EditableField label="First Name" name="firstName" value={editForm.firstName} placeholder="First Name" />
                        <EditableField label="Middle Name" name="middleName" value={editForm.middleName} placeholder="Middle Name (optional)" />
                        <EditableField label="Last Name" name="lastName" value={editForm.lastName} placeholder="Last Name" />

                        <EditableField label="Date of Birth" name="dob" value={editForm.dob} type="date" />
                        <EditableField label="Blood Group" name="bloodGroup" value={editForm.bloodGroup} options={bloodGroupOptions} />
                        <EditableField label="Academic Year" name="academicYear" value={editForm.academicYear} options={academicYearOptions} />

                        <div className="bg-gray-100 p-3 rounded-lg border border-gray-200">
                            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">PRN</label>
                            <div className="p-2 text-gray-500 font-mono">{profile.prn} (Read-only)</div>
                        </div>
                        <EditableField label="GR Number" name="grNo" value={editForm.grNo} placeholder="GR Number" />
                        <EditableField label="ABC / APAAR ID" name="abcId" value={editForm.abcId} placeholder="ABC ID" />

                        <EditableField label="COA Enrollment No" name="coaEnrollmentNo" value={editForm.coaEnrollmentNo} placeholder="COA Enrollment No" />
                        <EditableField label="Aadhar Number" name="aadharNo" value={editForm.aadharNo} placeholder="12-digit Aadhar" />
                        <EditableField label="Admission Category" name="admissionCategory" value={editForm.admissionCategory} options={admissionCategoryOptions} />

                        <EditableField label="Student Mobile" name="phoneNumber" value={editForm.phoneNumber} placeholder="10-digit mobile" />
                        <EditableField label="Parent Mobile" name="parentPhoneNumber" value={editForm.parentPhoneNumber} placeholder="10-digit mobile" />
                        <div className="md:col-span-3">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Permanent Address</label>
                                <textarea
                                    name="address"
                                    value={editForm.address || ''}
                                    onChange={handleEditChange}
                                    placeholder="Full address"
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DetailItem label="Full Name" value={`${profile.firstName} ${profile.middleName || ''} ${profile.lastName}`} icon={User} />
                        <DetailItem label="Date of Birth" value={profile.dob} icon={Calendar} />
                        <DetailItem label="Blood Group" value={profile.bloodGroup} icon={User} />

                        <DetailItem label="PRN" value={profile.prn} mono />
                        <DetailItem label="GR Number" value={profile.grNo} mono />
                        <DetailItem label="ABC / APAAR ID" value={profile.abcId} mono />

                        <DetailItem label="COA Enrollment No" value={profile.coaEnrollmentNo} mono />
                        <DetailItem label="Aadhar Number" value={profile.aadharNo} mono />
                        <DetailItem label="Admission Category" value={profile.admissionCategory?.replace(/_/g, ' ')} icon={ShieldCheck} />

                        <DetailItem label="Student Mobile" value={profile.phoneNumber} icon={Phone} />
                        <DetailItem label="Parent Mobile" value={profile.parentPhoneNumber} icon={Phone} />
                        <div className="md:col-span-3">
                            <DetailItem label="Permanent Address" value={profile.address} icon={MapPin} />
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog config={confirmDlg} onClose={() => setConfirmDlg(null)} />
        </div>
    );
};
export default StudentProfileView;