import React, { useState } from "react";
import {
  FiX,
  FiCheck,
  FiClock,
  FiCalendar,
  FiUser,
  FiFileText,
  FiTrendingUp,
} from "react-icons/fi";
import {
  usePatientSessions,
  usePatientPlanSessions,
  useUpdateSession,
} from "../hooks/useClinicData";

const SessionsModal = ({ patientId, patientName, planId, onClose }) => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Use plan-specific sessions if planId is provided, otherwise use all patient sessions
  const sessionData = planId
    ? usePatientPlanSessions(patientId, planId)
    : usePatientSessions(patientId);
  const { data: rawData, isLoading, error } = sessionData;

  // Handle different data structures
  const sessions = planId ? rawData?.sessions : rawData;
  const planInfo = planId ? rawData?.plan : null;
  const updateSessionMutation = useUpdateSession();

  const handleSessionClick = (session) => {
    setSelectedSession(session);
    setShowDetails(true);
  };

  const handleMarkCompleted = async (sessionId) => {
    try {
      await updateSessionMutation.mutateAsync({
        id: sessionId,
        updates: {
          is_completed: true,
          session_date: new Date().toISOString().split("T")[0], // Today's date
        },
      });
      setShowDetails(false);
      setSelectedSession(null);
      // Show success message (you can replace this with a toast library if available)
      alert("تم تحديث الجلسة بنجاح!");
    } catch (error) {
      console.error("Error updating session:", error);
      alert("حدث خطأ في تحديث الجلسة: " + error.message);
    }
  };

  const completedSessions =
    sessions?.filter((session) => session.is_completed) || [];
  const pendingSessions =
    sessions?.filter((session) => !session.is_completed) || [];
  const totalSessions =
    planInfo?.total_sessions ||
    sessions?.[0]?.treatment_plans?.total_sessions ||
    0;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">جاري تحميل الجلسات...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center text-red-600">
            خطأ في تحميل البيانات: {error.planError}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-3">
              <FiUser className="text-blue-600 text-2xl" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  جلسات المريض
                </h2>
                <p className="text-sm text-gray-600">{patientName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <FiCheck className="text-green-600 text-xl" />
                  <div>
                    <p className="text-sm text-green-600 font-medium">مكتملة</p>
                    <p className="text-2xl font-bold text-green-800">
                      {completedSessions.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <FiClock className="text-yellow-600 text-xl" />
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">
                      متبقية
                    </p>
                    <p className="text-2xl font-bold text-yellow-800">
                      {pendingSessions.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <FiTrendingUp className="text-blue-600 text-xl" />
                  <div>
                    <p className="text-sm text-blue-600 font-medium">المجموع</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {totalSessions}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>التقدم في العلاج</span>
                <span>
                  {Math.round((completedSessions.length / totalSessions) * 100)}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${(completedSessions.length / totalSessions) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Sessions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Completed Sessions */}
              <div className="space-y-3">
                <h3 className="font-semibold text-green-700 flex items-center space-x-2">
                  <FiCheck />
                  <span>الجلسات المكتملة</span>
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {completedSessions.map((session) => (
                    <div
                      key={session.id}
                      className="bg-green-50 border border-green-200 rounded-lg p-3 cursor-pointer hover:bg-green-100 transition-colors"
                      onClick={() => handleSessionClick(session)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FiCheck className="text-green-600" />
                          <span className="font-medium">
                            الجلسة {session.session_number}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {session.session_date
                            ? new Date(session.session_date).toLocaleDateString(
                                "ar-EG",
                              )
                            : "غير محدد"}
                        </span>
                      </div>
                      {session.treatment_details && (
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {session.treatment_details}
                        </p>
                      )}
                    </div>
                  ))}
                  {completedSessions.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      لا توجد جلسات مكتملة
                    </p>
                  )}
                </div>
              </div>

              {/* Pending Sessions */}
              <div className="space-y-3">
                <h3 className="font-semibold text-yellow-700 flex items-center space-x-2">
                  <FiClock />
                  <span>الجلسات المتبقية</span>
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {pendingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 cursor-pointer hover:bg-yellow-100 transition-colors"
                      onClick={() => handleSessionClick(session)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FiClock className="text-yellow-600" />
                          <span className="font-medium">
                            الجلسة {session.session_number}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          قيد الانتظار
                        </span>
                      </div>
                    </div>
                  ))}
                  {pendingSessions.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      لا توجد جلسات متبقية
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Session Details Modal */}
          {showDetails && selectedSession && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">
                      تفاصيل الجلسة {selectedSession.session_number}
                    </h3>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiX />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="text-gray-500" />
                      <span className="text-sm">
                        التاريخ:{" "}
                        {selectedSession.session_date
                          ? new Date(
                              selectedSession.session_date,
                            ).toLocaleDateString("ar-EG")
                          : "غير محدد"}
                      </span>
                    </div>

                    {selectedSession.treatment_details && (
                      <div className="flex items-start space-x-2">
                        <FiFileText className="text-gray-500 mt-1" />
                        <div>
                          <p className="text-sm font-medium">تفاصيل العلاج:</p>
                          <p className="text-sm text-gray-600">
                            {selectedSession.treatment_details}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedSession.pain_level && (
                      <div className="flex items-center space-x-2">
                        <FiTrendingUp className="text-gray-500" />
                        <span className="text-sm">
                          مستوى الألم: {selectedSession.pain_level}/10
                        </span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedSession.is_completed
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedSession.is_completed
                          ? "مكتملة"
                          : "قيد الانتظار"}
                      </span>
                    </div>
                  </div>

                  {!selectedSession.is_completed && (
                    <button
                      onClick={() => handleMarkCompleted(selectedSession.id)}
                      disabled={updateSessionMutation.isPending}
                      className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {updateSessionMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>جاري التحديث...</span>
                        </>
                      ) : (
                        <>
                          <FiCheck />
                          <span>تحديد كمكتملة</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SessionsModal;
