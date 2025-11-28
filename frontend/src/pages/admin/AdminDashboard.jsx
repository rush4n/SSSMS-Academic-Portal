import React from "react";

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">1</p>
          <span className="text-green-600 text-sm bg-green-50 px-2 py-1 rounded mt-2 inline-block">
            +1 this week
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Active Faculty</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Pending Fees</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹0.00</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
