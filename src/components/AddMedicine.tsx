import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMedications, Medication, MedicationType } from "@/context/MedicationsContext";
import { Clock, X, Check, ArrowLeft } from "lucide-react";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface AddMedicineProps {
  medicationToEdit?: Medication;
  onClose?: () => void;
  showHeader?: boolean; // New prop to control header visibility
}

const AddMedicine: React.FC<AddMedicineProps> = ({ 
  medicationToEdit, 
  onClose, 
  showHeader = false 
}) => {
  const { toast } = useToast();
  const { addMedication, editMedication } = useMedications();

  // Initialize form data, use medicationToEdit if available
  const [formData, setFormData] = useState({
    name: medicationToEdit?.name || "",
    dosage: medicationToEdit?.dosage || "",
    type: medicationToEdit?.type || "pill",
    specialInstructions: medicationToEdit?.specialInstructions || "",
    frequency: medicationToEdit?.frequency || "daily",
    days: medicationToEdit?.days || [...daysOfWeek],
    startDate: medicationToEdit?.startDate || "",
    endDate: medicationToEdit?.endDate || "",
  });

  const [times, setTimes] = useState<string[]>(medicationToEdit?.times || ["08:00 AM", "01:00 PM", "08:00 PM"]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [tempFrequency, setTempFrequency] = useState<"daily" | "custom">(formData.frequency);
  const [tempDays, setTempDays] = useState<string[]>([...formData.days]);

  // Time helpers
  const to12Hour = (time24: string): string => {
    if (!time24) return "";
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr);
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, "0")}:${minute} ${period}`;
  };

  const to24Hour = (time12: string) => {
    if (!time12) return "";
    const [time, period] = time12.split(" ");
    let [hour, minute] = time.split(":").map(Number);
    if (period === "PM" && hour < 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  };

  // Frequency modal logic
  const toggleDay = (day: string) => {
    setTempDays(prev => {
      const days = prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day];
      setTempFrequency(days.length === daysOfWeek.length ? "daily" : "custom");
      return days;
    });
  };

  const toggleDaily = () => {
    if (tempFrequency === "daily") {
      setTempFrequency("custom");
      setTempDays([]);
    } else {
      setTempFrequency("daily");
      setTempDays([...daysOfWeek]);
    }
  };

  // Time management
  const addTime = () => setTimes([...times, "08:00 AM"]);
  const removeTime = (index: number) => setTimes(times.filter((_, i) => i !== index));

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage || times.some(t => !t)) {
      toast({
        title: "Missing Info",
        description: "Please fill in all required fields and times.",
      });
      return;
    }

    if (medicationToEdit) {
      // Editing existing medication
      editMedication(medicationToEdit.id, { ...formData, times });
      toast({
        title: "Medicine Updated",
        description: `${formData.name} has been updated.`,
      });
    } else {
      // Adding new medication
      addMedication({ ...formData, times });
      toast({
        title: "Medicine Added",
        description: `${formData.name} has been added.`,
      });
    }

    // Reset or close
    if (onClose) onClose();
    else {
      setFormData({
        name: "",
        dosage: "",
        type: "pill",
        specialInstructions: "",
        frequency: "daily",
        days: [...daysOfWeek],
        startDate: "",
        endDate: "",
      });
      setTimes(["08:00 AM", "01:00 PM", "08:00 PM"]);
      setOpenIndex(null);
      setTempDays([...daysOfWeek]);
      setTempFrequency("daily");
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col w-full h-full bg-gray-100"> {/* Changed to h-full */}
      {/* Conditional Header */}
      {showHeader && (
        <div className="flex-shrink-0 w-full shadow-sm py-4 px-6 flex items-center gap-4 bg-blue-600">
          <button 
            onClick={onClose} 
            className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">
            {medicationToEdit ? "Edit Medicine" : "Add Medicine"}
          </h1>
        </div>
      )}

      {/* Content - Made scrollable but contained */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center w-full px-4 py-4"> {/* Reduced padding */}
          <form className="w-full space-y-4 bg-white rounded-2xl p-4 shadow-md" onSubmit={handleSubmit}> {/* Reduced padding and spacing */}
            {/* Medicine Name */}
            <div className="space-y-2">
              <Label>Medicine Name *</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Amoxicillin"
                required
              />
            </div>

            {/* Dosage */}
            <div className="space-y-2">
              <Label>Dosage *</Label>
              <Input
                value={formData.dosage}
                onChange={e => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="e.g., 500 mg"
                required
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label>Type *</Label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as MedicationType })}
                className="w-full border rounded-lg p-3 text-base"
              >
                <option value="pill">Pill</option>
                <option value="tablet">Tablet</option>
                <option value="others">Others</option>
              </select>
            </div>

            {/* Frequency Selector */}
            <div className="space-y-2">
              <Label>Frequency *</Label>
              <Button type="button" onClick={() => setShowFrequencyModal(true)} className="w-full bg-blue-500 hover:bg-blue-600">
                {formData.frequency === "daily" ? "Daily" : formData.days.length > 0 ? formData.days.join(", ") : "Select Frequency"}
              </Button>
            </div>

            {/* Start / End Dates */}
            <div className="flex justify-between gap-3">
              <div className="flex flex-col w-1/2 space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  className="p-2 text-sm"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  min={todayStr}
                />
              </div>
              <div className="flex flex-col w-1/2 space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  className="p-2 text-sm"
                  value={formData.endDate}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  min={todayStr}
                />
              </div>
            </div>

            {/* Times */}
            <div className="space-y-2">
              <Label>Medication Times *</Label>
              {times.map((time, i) => (
                <div key={i} className="relative flex items-center gap-2">
                  <div className="relative w-full">
                    <input
                      readOnly
                      value={time}
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      className="w-full p-3 pr-10 border rounded-lg cursor-pointer"
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 w-5 h-5 cursor-pointer" onClick={() => setOpenIndex(openIndex === i ? null : i)} />

                    {openIndex === i && (
                      <div className="absolute top-full mt-2 bg-white border rounded-xl shadow-lg p-4 flex flex-col gap-3 z-50 w-[300px]">
                        <input
                          type="time"
                          value={to24Hour(time)}
                          onChange={e => {
                            const newTimes = [...times];
                            newTimes[i] = to12Hour(e.target.value);
                            setTimes(newTimes);
                          }}
                          className="w-full p-3 border rounded-lg text-center text-base"
                        />
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setOpenIndex(null)}>Cancel</Button>
                          <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setOpenIndex(null)}>Set</Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {times.length > 1 && <Button type="button" onClick={() => removeTime(i)} className="bg-red-500">Remove</Button>}
                </div>
              ))}
              <Button type="button" onClick={addTime} className="bg-green-500 w-full">Add Time</Button>
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <Label>Special Instructions</Label>
              <Textarea value={formData.specialInstructions} onChange={e => setFormData({ ...formData, specialInstructions: e.target.value })} placeholder="e.g., Take after meals" />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full bg-green-500 text-white font-semibold">
              {medicationToEdit ? "Update Medicine" : "Add Medicine"}
            </Button>
          </form>
        </div>
      </div>

      {/* Frequency Modal */}
      {showFrequencyModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl relative">
            <button onClick={() => setShowFrequencyModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <X />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-center">Select Frequency</h3>

            <button type="button" onClick={toggleDaily} className={`w-full p-4 border-2 rounded-xl flex items-center justify-center gap-2 mb-4 transition ${tempFrequency === "daily" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}>
              <Check className={`w-5 h-5 ${tempFrequency === "daily" ? "text-blue-600" : "text-gray-400"}`} />
              <span className="text-lg font-medium">Daily</span>
            </button>

            <div className="flex flex-wrap justify-center gap-2">
              {daysOfWeek.map(day => (
                <button key={day} type="button" onClick={() => toggleDay(day)} className={`px-4 py-2 rounded-full border-2 transition ${tempDays.includes(day) ? "bg-blue-500 text-white border-blue-500" : "border-gray-300"}`}>
                  {day}
                </button>
              ))}
            </div>

            <Button type="button" disabled={tempDays.length === 0} onClick={() => {
              setFormData(prev => ({ ...prev, frequency: tempFrequency, days: [...tempDays] }));
              setShowFrequencyModal(false);
            }} className={`w-full mt-5 ${tempDays.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white`}>
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMedicine;