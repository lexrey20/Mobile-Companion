import React from "react";
import { Home, Wrench, Pill, NotebookPen } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={22} /> },
    { id: "maintenance", label: "Maintenance", icon: <Wrench size={22} /> },
    { id: "prescription", label: "Prescription", icon: <Pill size={22} /> },
    { id: "contacts", label: "Contacts", icon: <NotebookPen size={22} /> }, // 🆕 NEW TAB
  ];

  return (
    <nav className="bg-white shadow-lg border-t border-gray-200 flex justify-around py-2 rounded-t-2xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center text-sm font-medium transition ${
            activeTab === tab.id
              ? "text-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          <div
            className={`p-2 rounded-xl ${
              activeTab === tab.id ? "bg-blue-100" : "bg-transparent"
            }`}
          >
            {tab.icon}
          </div>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
