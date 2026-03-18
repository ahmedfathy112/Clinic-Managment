import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import { FaHome, FaUsers, FaCalendarAlt, FaUserMd } from "react-icons/fa";
import logo from "../assets/logo.png";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { label: "الصفحة الرئيسية", path: "/home", icon: <FaHome /> },
    { label: "المرضى", path: "/patients", icon: <FaUsers /> },
    {
      label: "الجلسات النشطة",
      path: "/active-sessions",
      icon: <FaCalendarAlt />,
    },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={toggleMenu}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isOpen ? <MdClose size={20} /> : <GiHamburgerMenu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 right-0 h-full bg-gradient-to-b from-white to-gray-50 shadow-2xl py-6 px-4 flex flex-col transition-all duration-300 ease-in-out z-40 border-l border-gray-200 ${
          isOpen
            ? "w-full sm:w-80 md:w-full translate-x-0"
            : "hidden md:flex md:w-full -translate-x-full md:translate-x-0"
        }`}
      >
        {/* Close Button */}
        <div className="md:hidden flex justify-end mb-6">
          <button
            onClick={toggleMenu}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Logo Section */}
        <div className="w-full mb-8 flex justify-center">
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <img
              src={logo}
              alt="logo"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
            />
          </div>
        </div>

        {/* Clinic Name */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-800">مركز النور</h2>
          <p className="text-sm text-gray-500">نظام إدارة العيادة</p>
        </div>

        {/* Menu Items */}
        <div className="w-full flex flex-col space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-4 py-4 px-4 rounded-xl text-base font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600 hover:shadow-md"
              }`}
            >
              <div
                className={`text-xl ${location.pathname === item.path ? "text-white" : "text-blue-600"}`}
              >
                {item.icon}
              </div>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 text-center">
          <p className="text-xs text-gray-400">© 2026 مركز النور</p>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30 transition-opacity duration-300"
          onClick={toggleMenu}
        />
      )}
    </>
  );
};

export default SideBar;
