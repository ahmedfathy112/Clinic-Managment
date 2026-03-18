import React, { useState } from "react";
import { FaUser, FaPhone, FaVenusMars, FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useDeletePatient } from "../../hooks/useClinicData";
import Swal from "sweetalert2";
import AddPaitentModel from "../../shared/AddPaitentModel";

const Personalnfo = ({ patient }) => {
  // Initialize hooks first
  const deletePatient = useDeletePatient();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
  };

  if (!patient) return null;

  const getGenderText = (gender) => {
    return gender === "male" ? "ذكر" : gender === "female" ? "أنثى" : gender;
  };

  const handleDeleteClick = () => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف بيانات المريض وجميع بيانات العلاج الخاصة به",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        deletePatient.mutate(patient.id, {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: "تم الحذف بنجاح",
              text: "تم حذف المريض من النظام",
            }).then(() => {
              navigate("/patients");
            });
          },
          onError: (error) => {
            Swal.fire({
              icon: "error",
              title: "خطأ",
              text: error.message || "حدث خطأ أثناء حذف المريض",
            });
          },
        });
      }
    });
  };

  const handleEditClick = () => {
    setEditMode(true);
    openModal();
  };

  return (
    <>
      <div
        dir="rtl"
        className="w-full mt-4 bg-linear-to-r from-gray-100 to-gray-200 rounded-2xl shadow-xl p-6 md:p-8"
      >
        {/* Header with Name and Edit Button */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <FaUser className="text-blue-600 text-2xl" />
            <h3 className="font-bold text-2xl md:text-3xl text-gray-800">
              {patient.full_name}
            </h3>
          </div>
          <div className="flex gap-5 flex-row">
            {/* edit button */}
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md"
            >
              <FaEdit />
              تعديل البيانات
            </button>
            {/* delete button */}
            <button
              className="flex items-center gap-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md"
              onClick={handleDeleteClick}
            >
              <FaDeleteLeft />
              حذف المريض
            </button>
          </div>
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
      {showModal && (
        <AddPaitentModel
          key={editMode ? `edit-${patient.id}` : "add"}
          isOpen={showModal}
          onClose={closeModal}
          mode={editMode ? "edit" : "add"}
          patientData={editMode ? patient : null}
        />
      )}
    </>
  );
};

export default Personalnfo;
