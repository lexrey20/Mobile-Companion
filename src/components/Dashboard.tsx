import React from "react";
import MedicationCard from "./MedicationCard";
import { Pill, Syringe, Tablets } from "lucide-react";
import { useMedications } from "@/context/MedicationsContext";
import { format, parseISO } from "date-fns";

const Dashboard: React.FC = () => {
  const { medications, toggleTaken } = useMedications();
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const todayDay = format(today, "EEE"); // "Mon", "Tue", etc.

  // Filter meds that are active today
  const todaysMeds = medications.filter((med) => {
    const start = med.startDate ? parseISO(med.startDate) : new Date();
    const end = med.endDate ? parseISO(med.endDate) : undefined;

    const startOk = today >= start;
    const endOk = end ? today <= end : true; // treat undefined as ongoing

    if (!startOk || !endOk) return false;

    if (med.frequency === "daily") return true;
    if (med.frequency === "custom" && med.days) {
      return med.days.includes(todayDay);
    }
    return false;
  });

  // Flatten all times
  const sortedEntries = todaysMeds
    .flatMap((med) =>
      med.times.map((time) => ({
        med,
        time,
      }))
    )
    .sort((a, b) => {
      const toMinutes = (t: string) => {
        const [timePart, period] = t.split(" ");
        let [hours, minutes] = timePart.split(":").map(Number);
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };
      return toMinutes(a.time) - toMinutes(b.time);
    });

  return (
    <div className="flex flex-col w-full min-h-full bg-gray-100">
      <div className="flex flex-col items-center px-4 w-full py-4 pb-20">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 w-full">
          Today's Schedule
        </h2>

        {sortedEntries.length > 0 ? (
          <div className="w-full space-y-3"> {/* Added container for proper spacing */}
            {sortedEntries.map(({ med, time }) => (
              <MedicationCard
                key={`${med.id}-${time}`}
                name={med.name}
                details={med.dosage}
                icon={
                  med.type === "pill" ? (
                    <Pill className="w-7 h-7 text-blue-600" />
                  ) : med.type === "tablet" ? (
                    <Tablets className="w-7 h-7 text-blue-600" />
                  ) : (
                    <Syringe className="w-7 h-7 text-blue-600" />
                  )
                }
                time={time}
                status={med.status[time]}
                specialInstructions={med.specialInstructions}
                type={med.type}
                onTaken={() => toggleTaken(med.id, time)}
              />
            ))}
          </div>
        ) : (
          <div className="w-full flex items-center justify-center py-8"> {/* Added container */}
            <p className="text-gray-500 text-center">
              No medications scheduled for today
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;