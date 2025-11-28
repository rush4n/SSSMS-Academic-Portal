import React, { useState } from "react";
import api from "../../api/axiosConfig";
import { UserPlus, Save, XCircle } from "lucide-react";

const EnrollStudent = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "password123",
    prn: "",
    department: "Architecture",
    currentYear: 1,
    phoneNumber: "",
    address: "",
    dob: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      await api.post("/admin/enroll-student", formData);
      setStatus({ type: "success", message: "Student enrolled successfully!" });
      setFormData({
        ...formData,
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        prn: "",
      }); // Clear main fields
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to enroll student. Check PRN or Email.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Enroll New Student
          </h1>
          <p className="text-gray-600 mt-1">
            Create a student profile and generate login credentials.
          </p>
        </div>
        <div className="bg-blue-50 p-3 rounded-full">
          <UserPlus className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {status.message && (
        <div
          className={`p-4 mb-6 rounded-lg flex items-center ${
            status.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {status.type === "error" && <XCircle className="w-5 h-5 mr-2" />}
          {status.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">
              1
            </span>
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Middle Name
              </label>
              <input
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">
              2
            </span>
            Academic Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PRN Number
              </label>
              <input
                name="prn"
                value={formData.prn}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Architecture">Architecture</option>
                <option value="Interior Design">Interior Design</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Year
              </label>
              <select
                name="currentYear"
                value={formData.currentYear}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
                <option value="5">Fifth Year</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-5 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Enroll Student
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnrollStudent;
