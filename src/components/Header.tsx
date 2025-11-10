import React from "react";
import { ArrowLeft, Settings, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  backButton?: boolean;
  onBack?: () => void;
  showSettings?: boolean;
  showAdd?: boolean;
  onAdd?: () => void;
  onSettings?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  backButton = false, 
  onBack, 
  showSettings = false,
  showAdd = false,
  onAdd,
  onSettings 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  const handleSettings = () => {
    if (onSettings) onSettings();
    // You can add default settings behavior here if needed
  };

  const handleAdd = () => {
    if (onAdd) onAdd();
  };

  return (
    <header className="w-full shadow-sm py-4 px-6 flex items-center justify-between bg-blue-600 h-16">
      <div className="flex items-center gap-2">
        {backButton && (
          <button onClick={handleBack} className="text-white hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-bold text-white">{title}</h1>
      </div>
      
      {/* Right side icons */}
      <div className="flex items-center gap-3">
        {showAdd && (
          <button 
            onClick={handleAdd}
            className="text-white hover:opacity-80 transition-opacity"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
        {showSettings && (
          <button 
            onClick={handleSettings}
            className="text-white hover:opacity-80 transition-opacity"
          >
            <Settings className="w-6 h-6" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;