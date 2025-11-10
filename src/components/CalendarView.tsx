import React, { useState } from "react";
import { Calendar } from "./ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card } from "./ui/card";
import { Pill, Tablets, Syringe } from "lucide-react";
import { format, startOfWeek, addDays, parseISO } from "date-fns";
import { useMedications } from "@/context/MedicationsContext";

// Helper: convert 24-hour format like "14:00" → "2:00 PM"
const formatTo12Hour = (time: string): string => {
  if (!time) return "";
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
};

const CalendarView: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<string>("week"); // "week", "2weeks", "month"
  const { medications } = useMedications();

  const selectedDateKey = date ? format(date, "yyyy-MM-dd") : "";

  // Filter medications based on frequency and start/end dates
  const dayMedications = medications.filter((med) => {
    if (!date) return false;
    const current = date;
    const start = med.startDate ? parseISO(med.startDate) : new Date();
    const end = med.endDate ? parseISO(med.endDate) : undefined; // undefined = ongoing

    if (current < start) return false;
    if (end && current > end) return false;

    if (med.frequency === "daily") return true;
    if (med.frequency === "custom" && med.days) {
      const weekday = format(current, "EEE"); // Mon, Tue, etc.
      return med.days.includes(weekday);
    }
    return false;
  });

  // Generate week/2-week dates for display
  const getVisibleDates = () => {
    if (!date) return [];
    const start = startOfWeek(date, { weekStartsOn: 0 }); // Sunday start
    let days: Date[] = [];
    if (viewMode === "week") {
      for (let i = 0; i < 7; i++) days.push(addDays(start, i));
    } else if (viewMode === "2weeks") {
      for (let i = 0; i < 14; i++) days.push(addDays(start, i));
    }
    return days;
  };

  return (
    <div className="flex flex-col w-full min-h-full bg-gray-100">
      <div className="flex flex-col items-center px-4 w-full py-4 pb-20">
        {/* View selector */}
        <div className="w-full mb-4">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="2weeks">2 Weeks View</SelectItem>
              <SelectItem value="month">Month View</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calendar view */}
        <Card className="w-full p-4 bg-white mb-4">
          {viewMode === "month" ? (
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
            />
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {getVisibleDates().map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setDate(day)}
                  className={`p-2 rounded-lg text-center ${
                    format(day, "yyyy-MM-dd") === selectedDateKey
                      ? "bg-theme-light-bg text-theme-color font-semibold"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <div>{format(day, "EEE")}</div>
                  <div>{format(day, "d")}</div>
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Medication list */}
        {date && (
          <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Medications for {format(date, "MMMM d, yyyy")}
            </h3>
            {dayMedications.length > 0 ? (
              <div className="space-y-3">
                {dayMedications.map((med, index) => {
                  const Icon =
                    med.type === "pill"
                      ? Pill
                      : med.type === "tablet"
                      ? Tablets
                      : Syringe;

                  return (
                    <div key={index}>
                      {med.times.map((time) => {
                        const formattedTime = formatTo12Hour(time);
                        const status = med.status[time] || "upcoming";

                        let bgColor = "";
                        let textColor = "";

                        switch (status) {
                          case "taken":
                            bgColor = "#D1FAE5";
                            textColor = "#047857";
                            break;
                          default:
                            bgColor = "var(--theme-light-bg)";
                            textColor = "var(--theme-color)";
                        }

                        return (
                          <Card
                            key={time}
                            className="p-4 flex items-center gap-3 border-2 border-gray-100 rounded-2xl shadow-sm"
                          >
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: "var(--theme-light-bg)" }}
                            >
                              <Icon
                                className="w-6 h-6"
                                style={{ color: "var(--theme-color)" }}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{med.name}</p>
                              <p className="text-gray-500 text-sm">{med.dosage}</p>
                            </div>
                            <div
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: bgColor,
                                color: textColor,
                              }}
                            >
                              {status === "taken" ? "Taken" : "Upcoming"}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full flex items-center justify-center py-8">
                <p className="text-gray-500 text-center">
                  No medications scheduled for this day
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;