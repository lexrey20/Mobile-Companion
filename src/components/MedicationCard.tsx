import React from "react";
import { Button } from "./ui/button";
import { Check } from "lucide-react";

interface MedicationCardProps {
  name: string;
  details: string;
  icon: React.ReactNode;
  onTaken?: () => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({
  name,
  details,
  icon,
  onTaken,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">{details}</p>
        </div>
      </div>
      {onTaken && (
        <Button
          onClick={onTaken}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          <Check className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default MedicationCard;
