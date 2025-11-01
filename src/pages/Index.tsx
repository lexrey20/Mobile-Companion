import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import AddMedicine from "../components/AddMedicine";
import CalendarView from "../components/CalendarView";
import { Plus, ClipboardList, Calendar } from "lucide-react";

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "add-medicine":
        return <AddMedicine />;
      case "calendar":
        return <CalendarView />;
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
            onClick={() => setActiveTab("add-medicine")}
            className={`flex flex-col items-center text-sm ${
              activeTab === "add-medicine" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Plus className="w-6 h-6 mb-1" />
            Add Medicine
          </button>

          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex flex-col items-center text-sm ${
              activeTab === "calendar" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Calendar className="w-6 h-6 mb-1" />
            Calendar
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Index;
