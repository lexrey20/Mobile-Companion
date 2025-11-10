import React, { createContext, useContext, useState, ReactNode } from "react";
import { v4 as uuid } from "uuid";
import { format, isAfter, isBefore, parseISO } from "date-fns";

export type MedicationType = "pill" | "tablet" | "others";
export type FrequencyType = "daily" | "custom";

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  type: MedicationType;
  times: string[]; // ["08:00", "14:00", ...]
  status: Record<string, "taken" | "upcoming" | "missed">;
  frequency: FrequencyType;
  days?: string[]; // Only for custom frequency, e.g., ["Mon","Wed"]
  specialInstructions?: string;
  startDate?: string; // ISO string
  endDate?: string;   // ISO string
}

interface MedicationsContextProps {
  medications: Medication[];
  addMedication: (med: Omit<Medication, "id" | "status">) => void;
  editMedication: (id: string, updates: Partial<Omit<Medication, "id" | "status">>) => void;
  deleteMedication: (id: string) => void;
  toggleTaken: (id: string, time: string) => void;
  markMissed: (currentDate?: Date) => void;
}

export const MedicationsContext = createContext<MedicationsContextProps | undefined>(undefined);

export const MedicationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [medications, setMedications] = useState<Medication[]>([]);

  const addMedication = (med: Omit<Medication, "id" | "status">) => {
    const startDate = med.startDate || new Date().toISOString().slice(0, 10);

    const newMed: Medication = {
      id: uuid(),
      ...med,
      startDate,
      status: med.times.reduce((acc, time) => {
        acc[time] = "upcoming";
        return acc;
      }, {} as Record<string, "taken" | "upcoming" | "missed">),
    };

    setMedications((prev) => [...prev, newMed]);
  };

  const editMedication = (id: string, updates: Partial<Omit<Medication, "id" | "status">>) => {
    setMedications((prev) =>
      prev.map((med) => (med.id === id ? { ...med, ...updates } : med))
    );
  };

  const deleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
  };

  const toggleTaken = (id: string, time: string) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id !== id) return med;
        const currentStatus = med.status[time];
        const newStatus = currentStatus === "taken" ? "upcoming" : "taken";
        return {
          ...med,
          status: { ...med.status, [time]: newStatus },
        };
      })
    );
  };

  // Automatically mark past "upcoming" doses as "missed"
  const markMissed = (currentDate: Date = new Date()) => {
    setMedications((prev) =>
      prev.map((med) => {
        const medStart = med.startDate ? parseISO(med.startDate) : undefined;
        const medEnd = med.endDate ? parseISO(med.endDate) : undefined;

        // Skip medications not active today
        if (
          (medStart && isAfter(medStart, currentDate)) ||
          (medEnd && isBefore(medEnd, currentDate))
        ) {
          return med;
        }

        const updatedStatus = { ...med.status };
        med.times.forEach((time) => {
          const [hourStr, minuteStr] = time.split(":");
          const medTime = new Date(currentDate);
          medTime.setHours(Number(hourStr), Number(minuteStr), 0, 0);

          if (medTime < currentDate && updatedStatus[time] === "upcoming") {
            updatedStatus[time] = "missed";
          }
        });

        return { ...med, status: updatedStatus };
      })
    );
  };

  return (
    <MedicationsContext.Provider
      value={{
        medications,
        addMedication,
        editMedication,
        deleteMedication,
        toggleTaken,
        markMissed,
      }}
    >
      {children}
    </MedicationsContext.Provider>
  );
};

export const useMedications = () => {
  const context = useContext(MedicationsContext);
  if (!context) throw new Error("useMedications must be used within MedicationsProvider");
  return context;
};
