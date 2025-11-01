import React from "react";
import Header from "./Header";
import MedicationCard from "./MedicationCard";
import { Pill, Syringe, HeartPulse } from "lucide-react";

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col w-full min-h-full bg-gray-100">
      <Header title="My Medications" />

      <div className="flex flex-col items-center mt-4 px-4 w-full pb-24">
        <h2 className="text-lg font-semibold text-gray-700 mb-2 w-full">Today's Schedule</h2>
        <MedicationCard
          name="Amoxicillin"
          details="500 mg · twice daily"
          icon={<Pill className="w-7 h-7 text-blue-600" />}
          time="8:00 AM"
          status="taken"
        />
        <MedicationCard
          name="Metformin"
          details="850 mg · after breakfast"
          icon={<HeartPulse className="w-7 h-7 text-blue-600" />}
          time="9:30 AM"
          status="upcoming"
          onTaken={() => alert("Metformin marked as taken")}
        />
        <MedicationCard
          name="Insulin"
          details="10 units · before lunch"
          icon={<Syringe className="w-7 h-7 text-blue-600" />}
          time="12:00 PM"
          status="upcoming"
          onTaken={() => alert("Insulin marked as taken")}
        />
        <MedicationCard
          name="Amoxicillin"
          details="500 mg · twice daily"
          icon={<Pill className="w-7 h-7 text-blue-600" />}
          time="8:00 PM"
          status="upcoming"
          onTaken={() => alert("Amoxicillin marked as taken")}
        />
      </div>
    </div>
  );
};

export default Dashboard;
