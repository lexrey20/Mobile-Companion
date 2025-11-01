import React, { useState } from "react";
import Header from "./Header";
import { Calendar } from "./ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { Pill, HeartPulse, Syringe } from "lucide-react";
import { format } from "date-fns";

const CalendarView: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<string>("week");

  // Mock data for medications on specific dates
  const medications = {
    [format(new Date(), "yyyy-MM-dd")]: [
      { name: "Amoxicillin", time: "8:00 AM", icon: Pill, status: "taken" },
      { name: "Metformin", time: "9:30 AM", icon: HeartPulse, status: "upcoming" },
      { name: "Insulin", time: "12:00 PM", icon: Syringe, status: "upcoming" },
    ],
  };

  const selectedDateKey = date ? format(date, "yyyy-MM-dd") : "";
  const dayMedications = medications[selectedDateKey] || [];

  return (
    <div className="flex flex-col items-center w-full min-h-full bg-gray-100 pb-24">
      <div className="w-full">
        <Header title="Calendar" />
      </div>

      <div className="flex flex-col items-center mt-4 px-4 w-full">
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

        <Card className="w-full p-4 bg-white">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
          />
        </Card>

        {date && (
          <div className="w-full mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Medications for {format(date, "MMMM d, yyyy")}
            </h3>
            {dayMedications.length > 0 ? (
              <div className="space-y-3">
                {dayMedications.map((med, index) => {
                  const Icon = med.icon;
                  return (
                    <Card key={index} className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{med.name}</p>
                        <p className="text-sm text-gray-600">{med.time}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        med.status === "taken" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {med.status === "taken" ? "Taken" : "Upcoming"}
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No medications scheduled for this day</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
