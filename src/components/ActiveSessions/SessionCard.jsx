import React from "react";
import { useUpdateSession } from "../../hooks/useClinicData";

const SessionCard = ({ session }) => {
  const updateSessionMutation = useUpdateSession();
  const {
    patientName,
    patientInitial,
    avatarColor,
    treatmentType,
    sessionStatus,
    sessionStatusColor,
    sessionProgress,
    sessionLabel,
    sessionsDone,
    sessionsTotal,
    sessionData,
  } = session;

  // Progress circle calculations
  const radius = 28;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (sessionProgress / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-gray-600 bg-gray-50">
            {sessionLabel}
          </span>

          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            {patientName}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{treatmentType}</p>
        </div>

        <div className="relative w-20 h-20">
          <svg className="w-full h-full" viewBox="0 0 72 72">
            <circle
              className="text-gray-200"
              strokeWidth={stroke}
              stroke="currentColor"
              fill="transparent"
              r={normalizedRadius}
              cx="36"
              cy="36"
            />
            <circle
              className="text-blue-500"
              strokeWidth={stroke}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={normalizedRadius}
              cx="36"
              cy="36"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 36 36)"
            />
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              className="text-xs font-semibold text-gray-800"
            >
              {sessionProgress}%
            </text>
          </svg>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold ${avatarColor}`}
          >
            {patientInitial}
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">سجل الجلسات</div>
            <div className="text-sm font-semibold text-gray-900">
              {sessionsDone}/{sessionsTotal}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <span
            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold text-white ${sessionStatusColor}`}
          >
            {sessionStatus}
          </span>
          <button
            onClick={() => {
              if (sessionData?.is_completed) return;
              updateSessionMutation.mutate({
                id: sessionData.id,
                updates: {
                  is_completed: true,
                  session_date: new Date().toISOString().split("T")[0],
                },
              });
            }}
            disabled={
              updateSessionMutation.isPending || sessionData?.is_completed
            }
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateSessionMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري التحديث...
              </>
            ) : sessionData?.is_completed ? (
              "مكتملة"
            ) : (
              "تحديد كمكتملة"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
