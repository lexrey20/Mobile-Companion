import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import Maintenance from "../components/Maintenance";
import Prescription from "../components/Prescription";
import { Pill, ClipboardList, FileText } from "lucide-react";

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "maintenance":
        return <Maintenance />;
      case "prescription":
        return <Prescription />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      {/* Phone frame */}
      <div className="relative w-[390px] h-[844px] bg-gray-100 rounded-[40px] shadow-2xl border-[10px] border-black overflow-hidden flex flex-col">
        {/* Content area */}
        <div className="flex-grow w-full overflow-y-auto bg-gray-100">
          {renderContent()}
        </div>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 w-full bg-white shadow-lg rounded-t-2xl flex justify-around py-3 border-t border-gray-200 z-50">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center text-sm ${
              activeTab === "dashboard" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <ClipboardList className="w-6 h-6 mb-1" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("maintenance")}
            className={`flex flex-col items-center text-sm ${
              activeTab === "maintenance" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Pill className="w-6 h-6 mb-1" />
            Maintenance
          </button>

          <button
            onClick={() => setActiveTab("prescription")}
            className={`flex flex-col items-center text-sm ${
              activeTab === "prescription" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <FileText className="w-6 h-6 mb-1" />
            Prescription
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Index;
