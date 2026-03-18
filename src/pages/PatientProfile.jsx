import React from "react";
import { useParams } from "react-router-dom";
import { usePatient } from "../hooks/useClinicData";
import Personalnfo from "../components/PatientProfile/Personalnfo";
import PatientTreatment from "../components/PatientProfile/PatientTreatment";

const PatientProfile = () => {
  const { id } = useParams();
  const { data: patient, isLoading, error } = usePatient(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          خطأ في تحميل بيانات المريض: {error.message}
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600">
          لم يتم العثور على المريض
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Personalnfo patient={patient} />
      <PatientTreatment patient={patient} />
    </div>
  );
};

export default PatientProfile;
