import React, { useState } from "react";
import { FiUser, FiX } from "react-icons/fi";
import { useAddPatient, useUpdatePatient } from "../hooks/useClinicData";

const AddPaitentModel = ({
  isOpen,
  onClose,
  mode = "add",
  patientData = null,
}) => {
  const [formData, setFormData] = useState(getInitialFormData());
  const [selectedDiseases, setSelectedDiseases] =
    useState(getInitialDiseases());
  const [successMessage, setSuccessMessage] = useState("");
  const addPatientMutation = useAddPatient();
  const updatePatientMutation = useUpdatePatient();

  function getInitialFormData() {
    if (mode === "edit" && patientData) {
      const phoneNumber =
        patientData.phone?.replace(/^\+?[0-9]{1,3}/, "") || "";
      const phoneCode = patientData.phone?.replace(phoneNumber, "") || "";

      return {
        patientName: patientData.full_name || "",
        phoneCode: phoneCode || "",
        phoneNumber: phoneNumber || "",
        age: patientData.age || "",
        chronicDiseases:
          patientData.medical_histories?.[0]?.chronic_diseases || "",
        gender: patientData.gender || "",
        medicalDiagnosis:
          patientData.medical_histories?.[0]?.previous_surgeries || "",
      };
    }
    return {
      patientName: "",
      phoneCode: "",
      phoneNumber: "",
      age: "",
      chronicDiseases: "",
      gender: "",
      medicalDiagnosis: "",
    };
  }

  function getInitialDiseases() {
    if (
      mode === "edit" &&
      patientData?.medical_histories?.[0]?.chronic_diseases
    ) {
      return patientData.medical_histories[0].chronic_diseases
        .split(",")
        .map((d) => d.trim());
    }
    return [];
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDiseaseChange = (disease, checked) => {
    if (checked) {
      setSelectedDiseases([...selectedDiseases, disease]);
    } else {
      setSelectedDiseases(selectedDiseases.filter((d) => d !== disease));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    const newPatientData = {
      full_name: formData.patientName,
      phone: `${formData.phoneCode}${formData.phoneNumber}`,
      gender: formData.gender,
      age: parseInt(formData.age),
    };

    const medicalHistoryData = {
      chronic_diseases:
        selectedDiseases.length > 0 ? selectedDiseases.join(", ") : null,
      previous_surgeries: formData.medicalDiagnosis || null,
    };

    try {
      if (mode === "add") {
        // Add new patient
        await addPatientMutation.mutateAsync({
          patientData: newPatientData,
          medicalHistoryData,
        });
        setSuccessMessage("تم إضافة المريض بنجاح!");
      } else if (mode === "edit" && patientData) {
        // Update existing patient
        await updatePatientMutation.mutateAsync({
          patientId: patientData.id,
          updatedData: newPatientData,
        });
        setSuccessMessage("تم تعديل بيانات المريض بنجاح!");
      }

      // Clear form
      setFormData({
        patientName: "",
        phoneCode: "",
        phoneNumber: "",
        age: "",
        chronicDiseases: "",
        gender: "",
        medicalDiagnosis: "",
      });
      setSelectedDiseases([]);

      // Close modal after a delay
      setTimeout(() => {
        onClose();
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error managing patient:", error);
      // Error is handled in the hook
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <FiUser className="text-blue-500 text-2xl" />
              <h3 className="font-bold text-lg">
                {mode === "edit" ? "تعديل بيانات المريض" : "إضافة مريض جديد"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              <FiX />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-right">
                {successMessage}
              </div>
            )}

            {/* Patient Name */}
            <div>
              <label className="block text-right font-medium text-gray-700 mb-2">
                اسم المريض
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="أول اسم الرقم الرقمي"
                className="w-full px-4 py-2 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* age and phone */}
            <div className="flex flex-row justify-between">
              {/* Phone Number */}
              <div>
                <label className="block text-right font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="5XXXXXXXX"
                    className="flex-1 px-4 py-2 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              {/* Age */}
              <div>
                <label className="block text-right font-medium text-gray-700 mb-2">
                  السن
                </label>
                <div className="flex items-center flex-row-reverse gap-2">
                  <span className="text-gray-600">سنة</span>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="25"
                    className="w-32 px-4 py-2 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="150"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Chronic Diseases */}
            <div>
              <label className="block text-right font-medium text-gray-700 mb-2">
                الأمراض المزمنة (إن وجدت)
              </label>
              <div className="flex flex-wrap gap-3">
                {["السكري", "ضغط الدم", "الربو", "لا يوجد"].map((disease) => (
                  <label
                    key={disease}
                    className="inline-flex items-center py-2.5 px-3 rounded-2xl shadow-xl cursor-pointer text-center justify-center"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDiseases.includes(disease)}
                      onChange={(e) =>
                        handleDiseaseChange(disease, e.target.checked)
                      }
                      className="checkbox checkbox-primary ml-2 rounded-full"
                    />
                    {disease}
                  </label>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-right font-medium text-gray-700 mb-3">
                الجنس
              </label>
              <div className="flex items-center gap-6 justify-end">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-500"
                  />
                  <span className="text-gray-700">ذكر</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-500"
                  />
                  <span className="text-gray-700">أنثى</span>
                </label>
              </div>
            </div>

            {/* Medical Diagnosis */}
            <div>
              <label className="block text-right font-medium text-gray-700 mb-2">
                العمليات السابقة
              </label>
              <textarea
                name="medicalDiagnosis"
                value={formData.medicalDiagnosis}
                onChange={handleChange}
                placeholder="اكتب العمليات السابقة للحالة ..."
                rows="4"
                className="w-full px-4 py-2 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 justify-start">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                disabled={
                  mode === "add"
                    ? addPatientMutation.isPending
                    : updatePatientMutation.isPending
                }
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={
                  mode === "add"
                    ? addPatientMutation.isPending
                    : updatePatientMutation.isPending
                }
                className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mode === "add" ? (
                  addPatientMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري الحفظ...
                    </>
                  ) : (
                    "حفظ البيانات"
                  )
                ) : updatePatientMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري التحديث...
                  </>
                ) : (
                  "تحديث البيانات"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddPaitentModel;
