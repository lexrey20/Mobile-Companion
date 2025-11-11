import React, { useState } from "react";
import Dashboard from "../components/Dashboard";
import MedicationList from "../components/MedicationList";
import AddMedicine from "../components/AddMedicine";
import EditMedicine from "../components/EditMedicine";
import CalendarView from "../components/CalendarView";
import EmergencyContacts from "../components/EmergencyContacts";
import Settings from "../components/Settings";
import HeartRateReport from "../components/HeartRateReport";
import BloodPressureReport from "../components/BloodPressureReport";
import GlucoseReport from "../components/GlucoseReport";
import Header from "../components/Header";
import { Pill, Calendar, ClipboardList, PieChart, NotebookPen } from "lucide-react";
import { Medication } from "@/context/MedicationsContext";

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "TimelyCare";
      case "medicine-list":
        return "My Medications";
      case "add-medicine":
        return "Add Medicine";
      case "edit-medicine":
        return "Edit Medicine";
      case "calendar":
        return "Calendar";
      case "contacts":
        return "Emergency Contacts";
      case "settings":
        return "Settings";
      case "heart-rate-report":
        return "Heart Rate Report";
      case "blood-pressure-report":
        return "Blood Pressure Report";
      case "glucose-report":
        return "Glucose Report";
      default:
        return "";
    }
  };

  const hideMainHeader = activeTab === "add-medicine" || activeTab === "edit-medicine" || 
                         activeTab === "settings" || activeTab === "heart-rate-report" || 
                         activeTab === "blood-pressure-report" || activeTab === "glucose-report";

  // Handler for settings
  const handleSettings = () => {
    setActiveTab("settings");
  };

  // Handler for add button in medication list
  const handleAddFromHeader = () => {
    setActiveTab("add-medicine");
  };

  // Health metric handlers
  const handleHeartRateClick = () => {
    setActiveTab("heart-rate-report");
  };

  const handleBloodPressureClick = () => {
    setActiveTab("blood-pressure-report");
  };

  const handleGlucoseClick = () => {
    setActiveTab("glucose-report");
  };

  // Back handlers
  const handleBackToDashboard = () => {
    setActiveTab("dashboard");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="relative w-[390px] h-[844px] bg-gray-100 rounded-[40px] shadow-2xl border-[10px] border-black overflow-hidden flex flex-col">
        
        {/* Main Header with conditional icons - Don't show for settings */}
        {!hideMainHeader && (
          <Header 
            title={getHeaderTitle()} 
            showSettings={activeTab !== "medicine-list"} // Show settings everywhere except medication list
            showAdd={activeTab === "medicine-list"} // Show add icon only in medication list
            onAdd={handleAddFromHeader}
            onSettings={handleSettings}
          />
        )}

        {/* Content */}
        <div className={`flex-grow w-full bg-gray-100 ${
          activeTab === "add-medicine" || activeTab === "edit-medicine" || 
          activeTab === "settings" || activeTab === "heart-rate-report" ||
          activeTab === "blood-pressure-report" || activeTab === "glucose-report"
            ? "overflow-hidden" 
            : "overflow-y-auto"
        }`}>
          {activeTab === "dashboard" && (
            <Dashboard 
              onHeartRateClick={handleHeartRateClick}
              onBloodPressureClick={handleBloodPressureClick}
              onGlucoseClick={handleGlucoseClick}
            />
          )}

          {activeTab === "medicine-list" && (
            <MedicationList
              onAddMedicine={() => setActiveTab("add-medicine")}
              onEditMedicine={(med) => {
                setSelectedMedication(med);
                setActiveTab("edit-medicine");
              }}
            />
          )}

          {activeTab === "add-medicine" && (
            <AddMedicine 
              onClose={() => setActiveTab("medicine-list")} 
              showHeader={true}
            />
          )}

          {activeTab === "edit-medicine" && selectedMedication && (
            <EditMedicine
              medication={selectedMedication}
              onClose={() => setActiveTab("medicine-list")}
            />
          )}

          {activeTab === "calendar" && <CalendarView />}
          {activeTab === "contacts" && <EmergencyContacts />}
          {activeTab === "settings" && <Settings onBack={handleBackToDashboard} />}
          {activeTab === "heart-rate-report" && (
            <HeartRateReport onBack={handleBackToDashboard} />
          )}
          {activeTab === "blood-pressure-report" && (
            <BloodPressureReport onBack={handleBackToDashboard} />
          )}
          {activeTab === "glucose-report" && (
            <GlucoseReport onBack={handleBackToDashboard} />
          )}
        </div>

        {/* Bottom Navigation */}
        {activeTab !== "add-medicine" && activeTab !== "edit-medicine" && 
         activeTab !== "settings" && activeTab !== "heart-rate-report" &&
         activeTab !== "blood-pressure-report" && activeTab !== "glucose-report" && (
          <nav className="absolute bottom-0 left-0 w-full bg-white shadow-lg rounded-t-2xl flex justify-around py-3 border-t border-gray-200 z-50">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex flex-col items-center text-sm ${activeTab === "dashboard" ? "text-blue-600" : "text-gray-500"}`}
            >
              <ClipboardList className="w-6 h-6 mb-1" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("medicine-list")}
              className={`flex flex-col items-center text-sm ${activeTab === "medicine-list" ? "text-blue-600" : "text-gray-500"}`}
            >
              <Pill className="w-6 h-6 mb-1" />
              Medications
            </button>

            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex flex-col items-center text-sm ${activeTab === "calendar" ? "text-blue-600" : "text-gray-500"}`}
            >
              <PieChart className="w-6 h-6 mb-1" />
              Calendar
            </button>

            <button
              onClick={() => setActiveTab("contacts")}
              className={`flex flex-col items-center text-sm ${activeTab === "contacts" ? "text-blue-600" : "text-gray-500"}`}
            >
              <NotebookPen className="w-6 h-6 mb-1" />
              Contacts
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Index;