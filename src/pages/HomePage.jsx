import React from "react";
import StatsGrid from "../components/HomePage/StatsGrid";
import QuickActions from "../components/HomePage/QuickActions";
import DailyAgenda from "../components/HomePage/DailyAgenda";

const HomePage = () => {
  return (
    <div className="flex flex-col w-full h-screen py-4 px-5 gap-7">
      <StatsGrid />
      <QuickActions />
      {/* <DailyAgenda /> */}
    </div>
  );
};

export default HomePage;
