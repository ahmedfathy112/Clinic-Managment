import React, { useMemo, useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import {
  useActiveSessions,
  useCompletedSessions,
} from "../hooks/useClinicData";
import SessionsModal from "../shared/SessionsModal";

const ActiveSessions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sessionType, setSessionType] = useState("active"); // "active" or "completed"
  console.log(sessionType);
  const {
    data: activeSessions,
    isLoading: activeLoading,
    error: activeError,
  } = useActiveSessions();
  const {
    data: completedSessions,
    isLoading: completedLoading,
    error: completedError,
  } = useCompletedSessions();

  const currentSessions =
    sessionType === "active" ? activeSessions : completedSessions;
  const isLoading = sessionType === "active" ? activeLoading : completedLoading;
  const error = sessionType === "active" ? activeError : completedError;

  const groupedPatients = useMemo(() => {
    console.log(
      "Recalculating groupedPatients with sessions:",
      currentSessions,
    );
    if (!currentSessions) return [];

    const map = new Map();

    currentSessions.forEach((session) => {
      const patient = session.treatment_plans?.patients;
      const plan = session.treatment_plans;
      if (!patient || !plan) return;

      const key = sessionType === "active" ? patient.id : plan.id;

      if (!map.has(key)) {
        if (sessionType === "active") {
          map.set(key, {
            patientId: key,
            patientName: patient.full_name,
            diagnosis: plan.diagnosis,
            totalSessions: plan.total_sessions || 0,
            sessions: [],
          });
        } else {
          // For completed sessions, group by plan
          map.set(key, {
            planId: key,
            patientId: patient.id,
            patientName: patient.full_name,
            diagnosis: plan.diagnosis,
            totalSessions: plan.total_sessions || 0,
            sessions: [],
          });
        }
      }

      map.get(key).sessions.push(session);
    });

    return Array.from(map.values()).map((group) => {
      const completed = group.sessions.filter(
        (s) => s.is_completed === true,
      ).length;
      const remaining = Math.max(group.totalSessions - completed, 0);
      const progress =
        group.totalSessions > 0
          ? Math.round((completed / group.totalSessions) * 100)
          : 0;

      return {
        ...group,
        completedSessions: completed,
        remainingSessions: remaining,
        progress,
      };
    });
  }, [currentSessions, sessionType]);

  const filteredPatients = useMemo(() => {
    const lowerSearch = searchQuery.trim().toLowerCase();

    return groupedPatients.filter((item) => {
      if (!lowerSearch) return true;
      return (
        item.patientName.toLowerCase().includes(lowerSearch) ||
        item.diagnosis?.toLowerCase().includes(lowerSearch)
      );
    });
  }, [groupedPatients, searchQuery]);

  const openModal = (patient) => {
    setSelectedPatient(patient);
  };

  const closeModal = () => {
    setSelectedPatient(null);
  };

  if (isLoading) {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">
            جاري تحميل{" "}
            {sessionType === "active" ? "الجلسات النشطة" : "الجلسات المكتملة"}
            ...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="text-center text-red-600">
            خطأ في تحميل البيانات: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <header className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {sessionType === "active" ? "الجلسات النشطة" : "الجلسات المكتملة"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {sessionType === "active"
                ? "عرض وإدارة جميع الجلسات النشطة للمرضى"
                : "عرض جميع الجلسات المكتملة للمرضى"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-1">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث باسم المريض أو نوع العلاج"
                  className="w-full pr-12 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSessionType("active")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    sessionType === "active"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  النشطة
                </button>
                <button
                  onClick={() => setSessionType("completed")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    sessionType === "completed"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  المكتملة
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <span className="text-sm text-gray-600">
                تم العثور على {filteredPatients.length}{" "}
                {sessionType === "active" ? "جلسات" : "خطط علاج"}
              </span>
            </div>
          </div>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
              <p className="text-gray-600 font-medium">
                لم يتم العثور على جلسات مطابقة
              </p>
              <p className="text-sm text-gray-500 mt-2">
                جرّب تعديل البحث أو تغيير الفلتر لعرض نتائج أخرى.
              </p>
            </div>
          ) : (
            filteredPatients.map((item) => (
              <div
                key={item.patientId || item.planId}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.patientName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.diagnosis}
                      </p>
                      {item.planId && (
                        <p className="text-xs text-gray-400 mt-1">
                          خطة علاج #{item.planId}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 text-lg font-bold">
                      {item.patientName?.charAt(0) || "-"}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="text-xs font-semibold text-green-700">
                        المكتملة
                      </div>
                      <div className="text-xl font-bold text-green-800">
                        {item.completedSessions}
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="text-xs font-semibold text-yellow-700">
                        المتبقية
                      </div>
                      <div className="text-xl font-bold text-yellow-800">
                        {item.remainingSessions}
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-xs font-semibold text-blue-700">
                        الإجمالي
                      </div>
                      <div className="text-xl font-bold text-blue-800">
                        {item.totalSessions}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>التقدم</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={`mt-6 flex gap-2 flex-col sm:flex-row  ${sessionType === "completed" ? "hidden" : "flex"}`}
                >
                  <button
                    onClick={() => openModal(item)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    تعديل الجلسات
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedPatient && (
        <SessionsModal
          patientId={selectedPatient.patientId}
          patientName={selectedPatient.patientName}
          planId={selectedPatient.planId}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default ActiveSessions;
