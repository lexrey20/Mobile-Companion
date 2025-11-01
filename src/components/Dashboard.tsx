import React from "react";
import Header from "./Header";
import MedicationCard from "./MedicationCard";
import { Pill, Syringe, HeartPulse } from "lucide-react";

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col w-full min-h-full bg-gray-100">
      <Header title="My Medications" />

      <div className="flex flex-col items-center mt-4 px-4 w-full pb-24">
        <MedicationCard
          name="Amoxicillin"
          details="500 mg · twice daily"
          icon={<Pill className="w-7 h-7 text-blue-600" />}
          onTaken={() => alert("Amoxicillin marked as taken")}
        />
        <MedicationCard
          name="Metformin"
          details="850 mg · after breakfast"
          icon={<HeartPulse className="w-7 h-7 text-blue-600" />}
        />
        <MedicationCard
          name="Insulin"
          details="Morning dose · before meal"
          icon={<Syringe className="w-7 h-7 text-blue-600" />}
        />
      </div>
    </div>
  );
};

export default Dashboard;
