import React from "react";
import { Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { toast } = useToast();

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have 2 upcoming medications today",
    });
  };

  return (
    <header className="w-full shadow-sm py-4 px-6 flex items-center justify-between" style={{ backgroundColor: '#4287f6' }}>
      <h1 className="text-xl font-bold text-white">{title}</h1>
      <button onClick={handleNotificationClick} className="relative hover:opacity-80 transition-opacity">
        <Bell className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
          2
        </span>
      </button>
    </header>
  );
};

export default Header;
