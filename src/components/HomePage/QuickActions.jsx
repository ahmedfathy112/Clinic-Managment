import React, { useState } from "react";
import { FaPlus, FaPlay } from "react-icons/fa";
import AddPaitentModel from "../../shared/AddPaitentModel";

const QuickActions = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <div
        dir="rtl"
        className="w-full p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-lg border border-gray-200"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h3 className="font-semibold text-xl text-gray-700 text-center sm:text-right">
            إجراءات سريعة
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end">
            <button
              onClick={openModal}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
            >
              <FaPlus />
              إضافة مريض
            </button>
            {/* <button className="flex items-center justify-center gap-2 bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors duration-200 shadow-md">
              <FaPlay />
              بدء جلسة سريعة
            </button> */}
          </div>
        </div>
      </div>

      {showModal && <AddPaitentModel isOpen={showModal} onClose={closeModal} />}
    </>
  );
};

export default QuickActions;
