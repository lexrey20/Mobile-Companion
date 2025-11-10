import React from "react";
import AddMedicine from "./AddMedicine";
import { Medication } from "@/context/MedicationsContext";
import { ArrowLeft } from "lucide-react";

interface EditMedicineProps {
  medication: Medication;
  onClose?: () => void;
}

const EditMedicine: React.FC<EditMedicineProps> = ({ medication, onClose }) => {
  return (
    <div className="flex flex-col w-full h-full bg-gray-100">
      {/* Custom Header for Edit Medicine */}
      <div className="flex-shrink-0 w-full shadow-sm py-4 px-6 flex items-center gap-4 bg-blue-600">
        <button 
          onClick={onClose} 
          className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-white">Edit Medicine</h1>
      </div>

      {/* AddMedicine Form without header */}
      <div className="flex-1 overflow-hidden">
        <AddMedicine 
          medicationToEdit={medication} 
          onClose={onClose}
          showHeader={false} // Don't show header since we already have one
        />
      </div>
    </div>
  );
};

export default EditMedicine;