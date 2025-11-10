import React from "react";
import { useMedications, Medication } from "@/context/MedicationsContext";
import { Pencil, Trash } from "lucide-react";
import { Button } from "./ui/button";

interface MedicationListProps {
  onAddMedicine: () => void;
  onEditMedicine: (med: Medication) => void;
}

const MedicationList: React.FC<MedicationListProps> = ({ onAddMedicine, onEditMedicine }) => {
  const { medications, deleteMedication } = useMedications();

  if (medications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 space-y-4 pb-24">
        <p className="text-gray-500 text-lg font-medium">No medications added yet.</p>
        <Button
          onClick={onAddMedicine}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          Add Medicine
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-4 pb-24">
      {medications.map((med) => (
        <div
          key={med.id}
          className="p-4 border border-gray-200 rounded-xl shadow-sm flex justify-between items-start hover:shadow-md transition-all duration-200 bg-white"
        >
          <div className="flex flex-col gap-1 flex-1">
            <p className="font-semibold text-lg text-gray-800">{med.name}</p>
            <p className="text-sm text-gray-600">{med.dosage}</p>
            <p className="text-xs text-gray-500">
              {med.startDate} {med.endDate ? `- ${med.endDate}` : ""}
            </p>
            <p className="text-xs text-gray-500">
              Times: {med.times.join(", ")}
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            {/* Edit Button */}
            <Button
              onClick={() => onEditMedicine(med)}
              variant="outline"
              size="sm"
              className="p-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            
            {/* Delete Button */}
            <Button
              onClick={() => deleteMedication(med.id)}
              variant="outline"
              size="sm"
              className="p-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}

      <div className="flex justify-center mt-4">
        <Button
          onClick={onAddMedicine}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
        >
          Add Medicine
        </Button>
      </div>
    </div>
  );
};

export default MedicationList;