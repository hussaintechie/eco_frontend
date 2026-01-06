import React, { useState, useEffect } from 'react';


import { 
  ArrowLeft, Bell, Smartphone, Mail,
  Snowflake, Sun, CloudRain, Flower2
} from 'lucide-react';

// --- SEASON CONFIG ---
const SEASON_CONFIG = {
  winter: {
    name: "Winter Fest",
    gradient: "bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50",
    primary: "bg-indigo-600",
    primaryText: "text-indigo-600",
    light: "bg-indigo-50",
    border: "border-indigo-100",
    icon: Snowflake,
  },
  summer: {
    name: "Summer Chill",
    gradient: "bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50",
    primary: "bg-orange-500",
    primaryText: "text-orange-600",
    light: "bg-orange-50",
    border: "border-orange-100",
    icon: Sun,
  },
  spring: {
    name: "Spring Bloom",
    gradient: "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50",
    primary: "bg-emerald-600",
    primaryText: "text-emerald-600",
    light: "bg-emerald-50",
    border: "border-emerald-100",
    icon: Flower2,
  },
  monsoon: {
    name: "Monsoon",
    gradient: "bg-gradient-to-br from-slate-200 via-gray-100 to-slate-300",
    primary: "bg-teal-600",
    primaryText: "text-teal-600",
    light: "bg-teal-50",
    border: "border-teal-100",
    icon: CloudRain,
  }
};

const getSeason = () => {
  const month = new Date().getMonth();
  if (month === 10 || month === 11 || month === 0) return "winter";
  if (month === 1 || month === 2) return "spring";
  if (month >= 3 && month <= 5) return "summer";
  return "monsoon";
};

// --- SETTINGS PAGE ---
const SettingsPage = () => {
  const [currentSeason, setCurrentSeason] = useState("spring");
  const [theme, setTheme] = useState(SEASON_CONFIG.spring);

  const [toggles, setToggles] = useState({
    push: true,
    email: false,
    sms: true,
  });

  useEffect(() => {
    const season = getSeason();
    setCurrentSeason(season);
    setTheme(SEASON_CONFIG[season]);
  }, []);

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Reusable components
  const SettingsSection = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="px-4 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
        {title}
      </h3>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {children}
      </div>
    </div>
  );

  const SettingsRow = ({ icon: Icon, label, subLabel, toggleKey }) => (
    <div
      onClick={() => handleToggle(toggleKey)}
      className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 cursor-pointer hover:bg-slate-50 transition"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${theme.light}`}>
          <Icon className={`w-5 h-5 ${theme.primaryText}`} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700">{label}</p>
          {subLabel && <p className="text-xs text-slate-400">{subLabel}</p>}
        </div>
      </div>

      {/* Toggle Switch */}
      <div
        className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 ${
          toggles[toggleKey] ? theme.primary : "bg-slate-200"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
            toggles[toggleKey] ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans ${theme.gradient} pb-10`}>

      {/* HEADER */}
      <div className="bg-white sticky top-0 z-20 shadow-sm mb-6">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
          <ArrowLeft className="w-6 h-6 text-slate-700 cursor-pointer" />
          <h1 className="font-bold text-lg text-slate-800">Settings</h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-2xl mx-auto px-4">

        {/* ONLY NOTIFICATIONS SECTION */}
        <SettingsSection title="Notifications">

          <SettingsRow
            icon={Bell}
            label="Push Notifications"
            subLabel="Order updates, offers"
            toggleKey="push"
          />

          
        </SettingsSection>

      </div>
    </div>
  );
};

export default SettingsPage;
