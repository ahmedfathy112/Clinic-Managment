import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";

const DailyAgenda = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const patientsData = [
    {
      id: 1,
      name: "محمد أحمد",
      initials: "م",
      phone: "0590000000",
      color: "bg-blue-500",
      treatmentType: "ارتجاع مريئي",
      sessionNumber: "5/12",
      status: "بدء الجلسة",
      statusColor: "bg-blue-600",
      time: "AM 10:30",
    },
    {
      id: 2,
      name: "سارة يوسف",
      initials: "س",
      phone: "0591111111",
      color: "bg-purple-500",
      treatmentType: "تمزق أربطة الركبة",
      sessionNumber: "2/10",
      status: "قيد الجلسة",
      statusColor: "bg-green-500",
      time: "AM 11:15",
    },
    {
      id: 3,
      name: "عمر فاروق",
      initials: "ع",
      phone: "0592222222",
      color: "bg-pink-500",
      treatmentType: "تأهيل ما بعد كسر الكتف",
      sessionNumber: "8/8",
      status: "تم الإنتهاء",
      statusColor: "bg-gray-400",
      time: "PM 12:00",
    },
    {
      id: 4,
      name: "ليل حسني",
      initials: "ل",
      phone: "0593333333",
      color: "bg-yellow-500",
      treatmentType: "التهاب عصب الوجه",
      sessionNumber: "3/15",
      status: "بدء الجلسة",
      statusColor: "bg-blue-600",
      time: "PM 01:00",
    },
  ];

  return (
    <div className="bg-white rounded-lg p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-xl text-gray-800">
            جدول المواعيد اليوم
          </h3>
          <p className="text-sm text-gray-500">التاريخ: الجمعة 24 قابو 2024</p>
        </div>
        <div>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>كل المريضيين</option>
            <option>المريضيين النشطين</option>
            <option>المكتملة</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" dir="rtl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-right font-semibold text-gray-700 text-sm">
                إجراءات
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700 text-sm">
                الحالة
              </th>

              <th className="px-4 py-3 text-right font-semibold text-gray-700 text-sm">
                رقم الجلسة
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700 text-sm">
                نوع الجلسة
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700 text-sm">
                اسم المريض
              </th>
            </tr>
          </thead>
          <tbody>
            {patientsData.map((patient, index) => (
              <tr
                key={patient.id}
                className={`border-b border-gray-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition-colors`}
              >
                {/* Actions */}
                <td className="px-4 py-4">
                  <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-medium hover:bg-gray-300 transition">
                    ملف طبي
                  </button>
                </td>

                {/* Status */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium text-white ${patient.statusColor}`}
                    >
                      {patient.status}
                    </span>
                    {patient.status === "تم الإنتهاء" && (
                      <FaCheck className="text-green-600" size={16} />
                    )}
                  </div>
                </td>

                {/* Session Number */}
                <td className="px-4 py-4 text-sm text-gray-700">
                  {patient.sessionNumber}
                </td>

                {/* Treatment Type */}
                <td className="px-4 py-4 text-sm text-gray-700">
                  {patient.treatmentType}
                </td>

                {/* Patient Name */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800 text-sm">
                        {patient.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {patient.phone}
                      </span>
                    </div>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${patient.color}`}
                    >
                      {patient.initials}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        <button className="px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-200">
          ...
        </button>
        <button className="px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-200">
          3
        </button>
        <button className="px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-200">
          2
        </button>
        <button className="px-3 py-2 rounded bg-gray-200 text-sm font-medium text-gray-800">
          1
        </button>
      </div>
    </div>
  );
};

export default DailyAgenda;
