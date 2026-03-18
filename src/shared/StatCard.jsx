import React from "react";

const StatCard = ({ title, value, description, icon, color }) => {
  return (
    <div
      dir="rtl"
      className="w-full min-w-[200px] max-w-[300px] h-auto rounded-2xl py-4 px-5 shadow-lg bg-white border border-gray-100 hover:shadow-xl transition-shadow duration-200 flex flex-col text-right"
    >
      <h3 className="font-semibold text-lg text-gray-700 mb-3">{title}</h3>
      <div className="flex flex-row justify-between items-center w-full mb-3">
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        <div className={`text-4xl ${color} opacity-80`}>{icon}</div>
      </div>
      <p className="font-medium text-sm text-gray-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default StatCard;
