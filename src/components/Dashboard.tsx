import React from "react";
import MedicationCard from "./MedicationCard";
import { Pill, Syringe, Tablets, Activity, Heart, Droplets } from "lucide-react";
import { useMedications } from "@/context/MedicationsContext";
import { format, parseISO } from "date-fns";

interface DashboardProps {
  onHeartRateClick?: () => void;
  onBloodPressureClick?: () => void;
  onGlucoseClick?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  onHeartRateClick, 
  onBloodPressureClick, 
  onGlucoseClick 
}) => {
  const { medications, toggleTaken } = useMedications();
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const todayDay = format(today, "EEE"); // "Mon", "Tue", etc.

  // Mock health data
  const heartRateData = {
    current: 72,
    status: "normal" as "normal" | "high" | "low",
  };

  const bloodPressureData = {
    systolic: 120,
    diastolic: 80,
    status: "normal" as "normal" | "elevated" | "high",
  };

  const glucoseData = {
    current: 95,
    status: "normal" as "normal" | "high" | "low",
    unit: "mg/dL"
  };

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

  const getHeartRateColor = () => {
    switch (heartRateData.status) {
      case "normal":
        return "text-green-600";
      case "high":
        return "text-red-600";
      case "low":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getBloodPressureColor = () => {
    switch (bloodPressureData.status) {
      case "normal":
        return "text-green-600";
      case "elevated":
        return "text-yellow-600";
      case "high":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getGlucoseColor = () => {
    switch (glucoseData.status) {
      case "normal":
        return "text-green-600";
      case "high":
        return "text-red-600";
      case "low":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const HealthMetricCard = ({ 
    title, 
    value, 
    icon, 
    iconBgColor, 
    iconColor, 
    valueColor, 
    onClick 
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    iconBgColor: string;
    iconColor: string;
    valueColor: string;
    onClick?: () => void;
  }) => (
    <div 
      className="w-full bg-white rounded-xl shadow-sm p-3 mb-3 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`${iconBgColor} p-2 rounded-lg`}>
            <div className={iconColor}>
              {icon}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-base">{title}</h3>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-xl font-bold ${valueColor}`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full min-h-full bg-gray-100">
      <div className="flex flex-col items-center px-4 w-full py-4 pb-20">
        {/* Health Monitoring Section */}
        <div className="w-full mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Health Metrics</h2>
          
          {/* Heart Rate */}
          <HealthMetricCard
            title="Heart Rate"
            value={`${heartRateData.current} BPM`}
            icon={<Activity className="w-5 h-5" />}
            iconBgColor="bg-red-50"
            iconColor="text-red-600"
            valueColor={getHeartRateColor()}
            onClick={onHeartRateClick}
          />

          {/* Blood Pressure */}
          <HealthMetricCard
            title="Blood Pressure"
            value={`${bloodPressureData.systolic}/${bloodPressureData.diastolic}`}
            icon={<Heart className="w-5 h-5" />}
            iconBgColor="bg-blue-50"
            iconColor="text-blue-600"
            valueColor={getBloodPressureColor()}
            onClick={onBloodPressureClick}
          />

          {/* Glucose */}
          <HealthMetricCard
            title="Glucose"
            value={`${glucoseData.current} ${glucoseData.unit}`}
            icon={<Droplets className="w-5 h-5" />}
            iconBgColor="bg-green-50"
            iconColor="text-green-600"
            valueColor={getGlucoseColor()}
            onClick={onGlucoseClick}
          />
        </div>

        {/* Today's Schedule */}
        <h2 className="text-lg font-semibold text-gray-700 mb-4 w-full">
          Today's Schedule
        </h2>

        {sortedEntries.length > 0 ? (
          <div className="w-full space-y-3">
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
          <div className="w-full flex items-center justify-center py-8">
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