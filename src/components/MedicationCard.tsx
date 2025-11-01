import React from "react";
import { Button } from "./ui/button";
import { Clock } from "lucide-react";

interface MedicationCardProps {
  name: string;
  details: string;
  icon: React.ReactNode;
  time: string;
  status?: "upcoming" | "taken" | "missed";
  onTaken?: () => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({
  name,
  details,
  icon,
  time,
  status = "upcoming",
  onTaken,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "taken":
        return "bg-green-50 border-green-200";
      case "missed":
        return "bg-red-50 border-red-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "taken":
        return "Taken";
      case "missed":
        return "Missed";
      default:
        return "Upcoming";
    }
  };

  return (
    <div className={`w-full rounded-2xl shadow-md p-4 mb-4 border-2 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{name}</h3>
            <p className="text-sm text-gray-600">{details}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-gray-700 font-medium">
            <Clock className="w-4 h-4" />
            <span className="text-base">{time}</span>
          </div>
          <span className="text-xs text-gray-500">{getStatusText()}</span>
        </div>
      </div>
      {status === "upcoming" && onTaken && (
        <Button
          onClick={onTaken}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base py-3"
        >
          Mark as Taken
        </Button>
      )}
      {status === "taken" && (
        <div className="w-full bg-green-600 text-white font-semibold text-base py-3 rounded-md text-center">
          ✓ Taken
        </div>
      )}
    </div>
  );
};

export default MedicationCard;
