import React, { createContext, useContext, useState } from "react";

type TabType = "dashboard" | "medicine-list" | "add-medicine" | "edit-medicine" | "calendar" | "contacts";

interface TabContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  editMedicationId: string | null;
  setEditMedicationId: (id: string | null) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export const TabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [editMedicationId, setEditMedicationId] = useState<string | null>(null);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab, editMedicationId, setEditMedicationId }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTab = () => {
  const context = useContext(TabContext);
  if (!context) throw new Error("useTab must be used within a TabProvider");
  return context;
};
