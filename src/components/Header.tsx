import React from "react";
import { Bell, Menu } from "lucide-react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="w-full shadow-sm py-4 px-6 flex items-center justify-between" style={{ backgroundColor: '#4287f6' }}>
      <div className="flex items-center gap-3">
        <Menu className="w-6 h-6 text-white" />
        <h1 className="text-xl font-bold text-white">{title}</h1>
      </div>
      <Bell className="w-6 h-6 text-white" />
    </header>
  );
};

export default Header;
