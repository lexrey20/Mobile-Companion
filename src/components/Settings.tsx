import React, { useState, useEffect } from "react";
import Header from "./Header";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";

const themeColors = [
  { name: "Blue", class: "bg-blue-600", value: "blue" },
  { name: "Red", class: "bg-red-600", value: "red" },
  { name: "Green", class: "bg-green-600", value: "green" },
  { name: "Purple", class: "bg-purple-600", value: "purple" },
  { name: "Orange", class: "bg-orange-500", value: "orange" },
];

const notificationIntensities = [
  { label: "Low", value: "low", description: "Subtle vibration, fewer alerts" },
  { label: "Normal", value: "normal", description: "Standard alerts" },
  { label: "High", value: "high", description: "Loud vibration, frequent alerts" },
];

const Settings: React.FC = () => {
  const [language, setLanguage] = useState<string>("English");
  const [theme, setTheme] = useState<string>("blue");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<boolean>(true);
  const [notificationIntensity, setNotificationIntensity] = useState<string>("normal");

  // Update primary theme color
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary",
      theme === "blue"
        ? "222.2 47.4% 11.2%"
        : theme === "red"
        ? "0 70% 30%"
        : theme === "green"
        ? "120 60% 25%"
        : theme === "purple"
        ? "270 60% 25%"
        : "30 100% 40%" // orange
    );
  }, [theme]);

  // Update dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 dark:bg-gray-900 transition-colors">
      <div className="relative w-[390px] h-[844px] bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl border-[10px] border-black overflow-hidden flex flex-col transition-colors">
        <div className="flex-grow w-full overflow-y-auto pb-[80px]">
          <Header title="Settings" backButton />

          <div className="flex flex-col items-center mt-6 w-full px-4 space-y-6">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 w-full">
              App Settings
            </h2>

            {/* Language selector */}
            <div className="w-full bg-white dark:bg-gray-700 rounded-2xl shadow-md p-4 space-y-2 transition-colors">
              <label className="text-gray-700 dark:text-gray-200 font-medium text-base">
                Language
              </label>
              <Select
                value={language.toLowerCase()}
                onValueChange={(val) =>
                  setLanguage(val === "english" ? "English" : "Filipino")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="filipino">Filipino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Theme color selector */}
            <div className="w-full bg-white dark:bg-gray-700 rounded-2xl shadow-md p-4 space-y-2 transition-colors">
              <label className="text-gray-700 dark:text-gray-200 font-medium text-base">
                Theme Color
              </label>
              <div className="flex gap-3 mt-2">
                {themeColors.map((color) => (
                  <button
                    key={color.value}
                    className={`w-10 h-10 rounded-lg border-2 ${
                      theme === color.value ? "border-black dark:border-white" : "border-gray-200"
                    } ${color.class}`}
                    onClick={() => setTheme(color.value)}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Dark mode switch */}
            <div className="w-full bg-white dark:bg-gray-700 rounded-2xl shadow-md p-4 flex justify-between items-center transition-colors">
              <span className="text-gray-700 dark:text-gray-200 font-medium text-base">
                Dark Mode
              </span>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            {/* Notifications toggle */}
            <div className="w-full bg-white dark:bg-gray-700 rounded-2xl shadow-md p-4 flex justify-between items-center transition-colors">
              <span className="text-gray-700 dark:text-gray-200 font-medium text-base">
                Notifications
              </span>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            {/* Notification Intensity */}
            {notifications && (
              <div className="w-full bg-white dark:bg-gray-700 rounded-2xl shadow-md p-4 space-y-2 transition-colors">
                <label className="text-gray-700 dark:text-gray-200 font-medium text-base">
                  Notification Intensity
                </label>
                <Select
                  value={notificationIntensity}
                  onValueChange={setNotificationIntensity}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select intensity" />
                  </SelectTrigger>
                  <SelectContent>
                    {notificationIntensities.map((i) => (
                      <SelectItem key={i.value} value={i.value}>
                        {i.label} - <span className="text-gray-500 dark:text-gray-300 text-xs">{i.description}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-4">
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
