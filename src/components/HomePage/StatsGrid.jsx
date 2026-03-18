import React from "react";
import StatCard from "../../shared/StatCard";
import { FaUser, FaCalendarCheck, FaClock, FaDollarSign } from "react-icons/fa";
import {
  useActiveSessions,
  usePatients,
  useActiveTreatmentPlans,
} from "../../hooks/useClinicData";

const StatsGrid = () => {
  // fetch how many patients in the system
  const { data: patients } = usePatients();
  // fetch how many active sessions
  const { data: activeSessions } = useActiveSessions();
  // fetch how many active treatment plans
  const { data: activeTreatmentPlans } = useActiveTreatmentPlans();

  const stats = [
    {
      title: "عدد المرضى",
      value: patients?.length || "0",
      description: "عدد المرضى المسجلين في العيادة",
      icon: <FaUser />,
      color: "text-blue-600",
    },
    {
      title: "الجلسات النشطة",
      value: activeSessions?.length || "0",
      description: "اجمالي عدد الجلسات المتبقيه",
      icon: <FaCalendarCheck />,
      color: "text-green-600",
    },
    {
      title: "الخطط العلاجيه النشطه",
      value: activeTreatmentPlans?.length || "0",
      description: "عدد الخطط العلاجيه النشطه",
      icon: <FaClock />,
      color: "text-orange-600",
    },
  ];

  return (
    <div dir="rtl" className="w-full p-4">
      <div className="flex felx-row justify-evenly flex-wrap gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsGrid;
