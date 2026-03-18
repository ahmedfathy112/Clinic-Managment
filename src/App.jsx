import React from "react";
import { Routes, Route } from "react-router-dom";
import { useUser } from "./hooks/useAuth";
import SideBar from "./shared/SideBar";
import HomePage from "./pages/HomePage";
import PatientProfile from "./pages/PatientProfile";
import PatientDirectory from "./pages/PatientDirectory";
import ActiveSessions from "./pages/ActiveSessions";
import TreatmentPlan from "./pages/TreatmentPlan";
import TreatmentPlanPage from "./pages/TreatmentPlanPage";
import Login from "./pages/Login";

const App = () => {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen w-full flex flex-row" dir="rtl">
      <div className="w-1/4 max-md:w-17.5">
        <SideBar />
      </div>
      <div className="w-3/4 max-md:w-[95%] p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/patients" element={<PatientDirectory />} />
          <Route path="/active-sessions" element={<ActiveSessions />} />
          <Route path="/patient-profile/:id" element={<PatientProfile />} />
          <Route path="/treatment-plan/:id" element={<TreatmentPlanPage />} />
          <Route path="/treatment-plan" element={<TreatmentPlan />} />
          <Route path="/dashboard" element={<HomePage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
