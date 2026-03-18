import React, { useState } from "react";
import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaPlus,
  FaAllergies,
  FaSyringe,
  FaNotesMedical,
  FaSave,
  FaStethoscope,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SessionsModal from "../../shared/SessionsModal";

const PatientTreatment = ({ patient }) => {
  const [showSessions, setShowSessions] = useState(false);
  const navigate = useNavigate();

  const openSessions = () => setShowSessions(true);
  const closeSessions = () => setShowSessions(false);
  const goToTreatmentPlan = () => navigate(`/treatment-plan/${patient.id}`);

  if (!patient) return null;

  // Get the first active treatment plan
  const activePlan =
    patient.treatment_plans?.find((plan) => plan.status === "active") ||
    patient.treatment_plans?.[0];

  // Calculate session statistics
  const totalSessions = activePlan?.total_sessions || 0;
  const completedSessions =
    activePlan?.sessions?.filter((session) => session.is_completed)?.length ||
    0;
  const remainingSessions = totalSessions - completedSessions;
  const progressPercentage =
    totalSessions > 0
      ? Math.round((completedSessions / totalSessions) * 100)
      : 0;

  return (
    <div dir="rtl" className="p-4 md:p-6 space-y-6">
      {/* Main Grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Summary Card */}
        <div className="w-full lg:w-1/3">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <FaClipboardList className="text-blue-600 text-xl" />
              <h4 className="font-bold text-lg text-gray-800">
                {activePlan?.diagnosis || "خطة علاج"}
              </h4>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                  تقدم العلاج
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {progressPercentage}%
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-2xl font-bold text-gray-800">
                  {totalSessions}
                </p>
                <p className="text-xs text-gray-500">الإجمالي</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 shadow-sm">
                <p className="text-2xl font-bold text-green-600">
                  {completedSessions}
                </p>
                <p className="text-xs text-gray-500">المنتهية</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 shadow-sm">
                <p className="text-2xl font-bold text-orange-600">
                  {remainingSessions}
                </p>
                <p className="text-xs text-gray-500">المتبقية</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={goToTreatmentPlan}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
              >
                <FaStethoscope className="text-sm" />
                تحديد الخطة العلاجية
              </button>
              <button
                onClick={openSessions}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow-md"
              >
                <FaPlus className="text-sm" />
                إدارة الجلسات
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <FaNotesMedical className="text-green-600 text-xl" />
              <h3 className="font-bold text-xl text-gray-800">
                التاريخ المرضي
              </h3>
            </div>

            <div className="space-y-6">
              {/* Chronic Diseases */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FaSyringe className="text-red-500" />
                  <label className="font-semibold text-gray-700">
                    الأمراض المزمنة
                  </label>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    {patient.medical_histories?.[0]?.chronic_diseases ||
                      "لا توجد أمراض مزمنة مسجلة"}
                  </p>
                </div>
              </div>

              {/* Previous Surgeries */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FaNotesMedical className="text-blue-500" />
                  <label className="font-semibold text-gray-700">
                    الجراحات السابقة
                  </label>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    {patient.medical_histories?.[0]?.previous_surgeries ||
                      "لا توجد جراحات سابقة مسجلة"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Modal */}
      {showSessions && (
        <SessionsModal
          patientId={patient.id}
          patientName={patient.full_name}
          onClose={closeSessions}
        />
      )}
    </div>
  );
};

export default PatientTreatment;
