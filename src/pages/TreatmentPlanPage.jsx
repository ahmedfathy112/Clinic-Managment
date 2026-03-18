import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaSave,
  FaStethoscope,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";
import { usePatient, useCreatePlan } from "../hooks/useClinicData";

const TreatmentPlanPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: patient, isLoading: patientLoading } = usePatient(id);
  const createPlanMutation = useCreatePlan();

  const [formData, setFormData] = useState({
    diagnosis: "",
    total_sessions: "",
    start_date: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = "التشخيص مطلوب";
    }

    if (!formData.total_sessions || formData.total_sessions < 1) {
      newErrors.total_sessions = "يجب أن يكون عدد الجلسات 1 على الأقل";
    }

    if (!formData.start_date) {
      newErrors.start_date = "تاريخ البدء مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      const planData = {
        patient_id: id,
        diagnosis: formData.diagnosis.trim(),
        total_sessions: parseInt(formData.total_sessions),
        status: "active",
        start_date: formData.start_date,
      };

      await createPlanMutation.mutateAsync(planData);
      setSuccessMessage("تم إنشاء الخطة العلاجية بنجاح!");

      // Redirect to patient profile after 2 seconds
      setTimeout(() => {
        navigate(`/patient-profile/${id}`);
      }, 2000);
    } catch (error) {
      console.error("Error creating treatment plan:", error);
      setErrors({
        submit: error.message || "حدث خطأ أثناء إنشاء الخطة العلاجية",
      });
    }
  };

  const goBack = () => {
    navigate(`/patient-profile/${id}`);
  };

  if (patientLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">لم يتم العثور على المريض</div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <FaArrowRight />
            العودة لملف المريض
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaStethoscope className="text-blue-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  تحديد الخطة العلاجية
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <FaUser className="text-gray-500" />
                  <span className="text-gray-600">{patient.full_name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
              {successMessage}
            </div>
          )}

          {errors.submit && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Diagnosis */}
            <div>
              <label className="block text-right font-semibold text-gray-700 mb-2">
                التشخيص الطبي *
              </label>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                placeholder="اكتب التشخيص الطبي التفصيلي للحالة (مثل: انزلاق غضروفي في الفقرة القطنية L4-L5)"
                rows="4"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right resize-none ${
                  errors.diagnosis ? "border-red-300" : "border-gray-300"
                }`}
                required
              />
              {errors.diagnosis && (
                <p className="text-red-500 text-sm mt-1 text-right">
                  {errors.diagnosis}
                </p>
              )}
            </div>

            {/* Total Sessions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-right font-semibold text-gray-700 mb-2">
                  عدد الجلسات الكلي *
                </label>
                <input
                  type="number"
                  name="total_sessions"
                  value={formData.total_sessions}
                  onChange={handleChange}
                  placeholder="مثال: 12"
                  min="1"
                  max="100"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right ${
                    errors.total_sessions ? "border-red-300" : "border-gray-300"
                  }`}
                  required
                />
                {errors.total_sessions && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {errors.total_sessions}
                  </p>
                )}
                <p className="text-gray-500 text-sm mt-1 text-right">
                  سيتم إنشاء هذا العدد من الجلسات تلقائياً
                </p>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-right font-semibold text-gray-700 mb-2">
                  تاريخ بدء العلاج *
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className={`w-full pr-10 pl-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right ${
                      errors.start_date ? "border-red-300" : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {errors.start_date && (
                  <p className="text-red-500 text-sm mt-1 text-right">
                    {errors.start_date}
                  </p>
                )}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FaStethoscope className="text-blue-600 mt-1" />
                <div className="text-right">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    معلومات مهمة
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>
                      • سيتم إنشاء {formData.total_sessions || 0} جلسة علاجية
                      تلقائياً
                    </li>
                    <li>
                      • جميع الجلسات ستكون في حالة "قيد الانتظار" في البداية
                    </li>
                    <li>
                      • يمكن تعديل حالة الجلسات من خلال صفحة إدارة الجلسات
                    </li>
                    <li>
                      • الخطة العلاجية ستظهر كـ"نشطة" حتى يتم إكمال جميع الجلسات
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={goBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={createPlanMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createPlanMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <FaSave />
                    إنشاء الخطة العلاجية
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlanPage;
