import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { ArrowLeft, Bell, Palette, Moon, Languages, Bluetooth } from "lucide-react";

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

interface SettingsProps {
  onBack?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const [language, setLanguage] = useState<string>("english");
  const [theme, setTheme] = useState<string>("blue");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<boolean>(true);
  const [notificationIntensity, setNotificationIntensity] = useState<string>("normal");
  const [bluetoothStatus, setBluetoothStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [lastSync, setLastSync] = useState<string>("Never");

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

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

  const handleBluetoothSync = async () => {
    if (bluetoothStatus === "connected") {
      // Disconnect
      setBluetoothStatus("disconnected");
      setLastSync("Never");
      return;
    }

    setBluetoothStatus("connecting");
    
    // Simulate Bluetooth connection process
    setTimeout(() => {
      setBluetoothStatus("connected");
      setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 2000);
  };

  const handleSaveSettings = () => {
    // Save settings logic here
    console.log("Settings saved:", {
      language,
      theme,
      darkMode,
      notifications,
      notificationIntensity,
      bluetoothStatus
    });
    if (onBack) {
      onBack();
    }
  };

  const getBluetoothStatusColor = () => {
    switch (bluetoothStatus) {
      case "connected":
        return "text-green-600 bg-green-50 border-green-200";
      case "connecting":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "disconnected":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getBluetoothStatusText = () => {
    switch (bluetoothStatus) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      case "disconnected":
        return "Disconnected";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="flex-shrink-0 w-full shadow-sm py-4 px-6 flex items-center gap-4 bg-blue-600 h-16">
        <button 
          onClick={handleBack}
          className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-white">Settings</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-6">
        <div className="space-y-4">
          {/* Bluetooth Sync */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Bluetooth className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Smartwatch</h3>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Device Status</p>
                <span className={`text-xs px-2 py-1 rounded-full border ${getBluetoothStatusColor()}`}>
                  {getBluetoothStatusText()}
                </span>
              </div>
              <div className="text-right">
                <p className="text-gray-600 dark:text-gray-400 text-sm">Last Sync</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{lastSync}</p>
              </div>
            </div>

            <button
              onClick={handleBluetoothSync}
              disabled={bluetoothStatus === "connecting"}
              className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                bluetoothStatus === "connected"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } disabled:opacity-50`}
            >
              <Bluetooth className="w-4 h-4" />
              {bluetoothStatus === "connected" 
                ? "Disconnect Device" 
                : bluetoothStatus === "connecting"
                ? "Connecting..."
                : "Connect Smartwatch"
              }
            </button>
          </div>

          {/* Language selector */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Languages className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Language</h3>
            </div>
            <Select
              value={language}
              onValueChange={setLanguage}
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Palette className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Theme Color</h3>
            </div>
            <div className="flex gap-3 justify-center">
              {themeColors.map((color) => (
                <button
                  key={color.value}
                  className={`w-10 h-10 rounded-lg border-2 transition-transform ${
                    theme === color.value 
                      ? "border-black dark:border-white scale-110" 
                      : "border-gray-300 dark:border-gray-600 hover:scale-105"
                  } ${color.class}`}
                  onClick={() => setTheme(color.value)}
                  aria-label={color.name}
                />
              ))}
            </div>
          </div>

          {/* Dark mode switch */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Dark Mode</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Switch between light and dark theme</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </div>

          {/* Notifications toggle */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Enable or disable app notifications</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </div>

          {/* Notification Intensity */}
          {notifications && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Bell className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Notification Intensity</h3>
            </div>
            <Select
              value={notificationIntensity}
              onValueChange={setNotificationIntensity}
            >
              <SelectTrigger className="w-full text-left">
                <SelectValue placeholder="Select intensity" />
              </SelectTrigger>
              <SelectContent>
                {notificationIntensities.map((intensity) => (
                  <SelectItem key={intensity.value} value={intensity.value} className="text-left">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{intensity.label}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        {intensity.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

          {/* Save Button */}
          <Button 
            onClick={handleSaveSettings}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-3 mt-4"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;