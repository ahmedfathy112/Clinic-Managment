import React, { useState, useMemo } from "react";
import { usePatients } from "../hooks/useClinicData";
import PatientSearchBar from "../components/PatientsList/PatientSearchBar";
import PatientTable from "../components/PatientsList/PatientTable";

const PatientDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: allPatients, isLoading, error } = usePatients();

  const filteredPatients = useMemo(() => {
    if (!allPatients || !searchTerm.trim()) {
      return allPatients || [];
    }

    const term = searchTerm.toLowerCase().trim();
    return allPatients.filter((patient) => {
      const nameMatch = patient.full_name?.toLowerCase().includes(term);
      const phoneMatch = patient.phone?.toLowerCase().includes(term);
      const chronicDiseasesMatch =
        patient.medical_histories?.[0]?.chronic_diseases
          ?.toLowerCase()
          .includes(term);
      const surgeriesMatch = patient.medical_histories?.[0]?.previous_surgeries
        ?.toLowerCase()
        .includes(term);

      return nameMatch || phoneMatch || chronicDiseasesMatch || surgeriesMatch;
    });
  }, [allPatients, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-4">
          {/* Search Bar */}
          <div className="w-full">
            <PatientSearchBar onSearch={handleSearch} />
          </div>
          {/* Patient Table */}
          <div className="w-full overflow-x-auto">
            <PatientTable
              patients={filteredPatients}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDirectory;
