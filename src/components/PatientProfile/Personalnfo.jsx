import React from "react";
import { FaUser, FaPhone, FaVenusMars, FaEdit } from "react-icons/fa";

const Personalnfo = ({ patient }) => {
  if (!patient) return null;

  const getGenderText = (gender) => {
    return gender === "male" ? "ذكر" : gender === "female" ? "أنثى" : gender;
  };

  return (
    <div
      dir="rtl"
      className="w-full mt-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl shadow-xl p-6 md:p-8"
    >
      {/* Header with Name and Edit Button */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <FaUser className="text-blue-600 text-2xl" />
          <h3 className="font-bold text-2xl md:text-3xl text-gray-800">
            {patient.full_name}
          </h3>
        </div>
        <button className="flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md">
          <FaEdit />
          تعديل البيانات
        </button>
      </div>

      {/* Personal Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
          <FaUser className="text-green-600 text-lg" />
          <div>
            <p className="text-sm text-gray-500">العمر</p>
            <p className="font-semibold text-gray-800">{patient.age} عام</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
          <FaVenusMars className="text-purple-600 text-lg" />
          <div>
            <p className="text-sm text-gray-500">الجنس</p>
            <p className="font-semibold text-gray-800">
              {getGenderText(patient.gender)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
          <FaPhone className="text-blue-600 text-lg" />
          <div>
            <p className="text-sm text-gray-500">رقم الهاتف</p>
            <p className="font-semibold text-gray-800">{patient.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personalnfo;
