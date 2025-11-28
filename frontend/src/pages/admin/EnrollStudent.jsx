import React, { useState } from "react";
import api from "../../api/axiosConfig";

const EnrollStudent = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "password123", // Default password
    prn: "",
    department: "Architecture",
    currentYear: 1,
    phoneNumber: "",
    address: "",
    dob: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Enrolling student..." });

    try {
      // Assuming your backend URL is /admin/enroll-student
      await api.post("/admin/enroll-student", formData);
      setStatus({ type: "success", message: "Student enrolled successfully!" });
      // Reset form
      setFormData({
        ...formData,
        firstName: "",
        lastName: "",
        email: "",
        prn: "",
      });
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to enroll student. Check PRN/Email.",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Enroll New Student
      </h1>

      {status.message && (
        <div
          className={`p-4 mb-6 rounded-lg ${
            status.type === "success"
              ? "bg-green-100 text-green-700"
              : status.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {status.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-sm border border-gray-200"
      >
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
            required
          />
          <input
            name="dob"
            type="date"
            placeholder="Date of Birth"
            value={formData.dob}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
            required
          />
          <input
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
          />
          <input
            name="address"
            placeholder="Current Address"
            value={formData.address}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
          />
        </div>

        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Academic Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input
            name="prn"
            placeholder="PRN Number"
            value={formData.prn}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full font-mono"
            required
          />

          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
          >
            <option value="Architecture">Architecture</option>
            <option value="Interior Design">Interior Design</option>
          </select>

          <select
            name="currentYear"
            value={formData.currentYear}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full"
          >
            <option value="1">First Year</option>
            <option value="2">Second Year</option>
            <option value="3">Third Year</option>
            <option value="4">Fourth Year</option>
            <option value="5">Fifth Year</option>
          </select>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Enroll Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnrollStudent;
