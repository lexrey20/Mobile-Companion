import React, { useState } from "react";
import Header from "./Header";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";

const AddMedicine: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Medicine Added",
      description: `${formData.name} has been added to your schedule.`,
    });
    setFormData({
      name: "",
      dosage: "",
      frequency: "",
      time: "",
      notes: "",
    });
  };

  return (
    <div className="flex flex-col w-full min-h-full bg-gray-100 pb-24">
      <Header title="Add Medicine" />
      <div className="flex flex-col items-center mt-6 w-full px-4">
        <form onSubmit={handleSubmit} className="w-full space-y-6 bg-white rounded-2xl p-6 shadow-md">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-semibold">
              Medicine Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Amoxicillin"
              required
              className="text-base p-3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dosage" className="text-base font-semibold">
              Dosage *
            </Label>
            <Input
              id="dosage"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              placeholder="e.g., 500 mg"
              required
              className="text-base p-3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency" className="text-base font-semibold">
              How Often? *
            </Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => setFormData({ ...formData, frequency: value })}
            >
              <SelectTrigger className="text-base p-3">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once-daily">Once Daily</SelectItem>
                <SelectItem value="twice-daily">Twice Daily</SelectItem>
                <SelectItem value="three-times-daily">Three Times Daily</SelectItem>
                <SelectItem value="four-times-daily">Four Times Daily</SelectItem>
                <SelectItem value="as-needed">As Needed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="text-base font-semibold">
              Time *
            </Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
              className="text-base p-3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base font-semibold">
              Special Instructions
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g., Take with food, before meals, etc."
              className="text-base p-3 min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-6">
            Add Medicine
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;
