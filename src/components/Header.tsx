import React from "react";
import { Bell, Menu } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Menu className="w-6 h-6 text-gray-700" />
        <h1 className="text-xl font-bold text-gray-900">My Medications</h1>
      </div>
      <Bell className="w-6 h-6 text-gray-700" />
    </header>
  );
};

export default Header;
