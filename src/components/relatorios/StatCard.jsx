import React from "react";

export default function StatCard({ title, value, Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 hover:shadow-xl transition">
      <div
        className={`h-12 w-12 flex items-center justify-center rounded-full shadow text-white`}
        style={{ backgroundColor: color }}
      >
        <Icon className="text-xl" />
      </div>
      <div>
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
