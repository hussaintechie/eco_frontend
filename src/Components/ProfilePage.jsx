import React, { useState } from 'react';
import { 
  Snowflake, Sun, CloudRain, Flower2, 
  User, MapPin, ShoppingBag, Settings, 
  LogOut, ChevronRight, Edit2, Phone, Mail, 
  Camera, X, Check 
} from 'lucide-react';

import { useNavigate } from "react-router-dom";

// --- 1. SEASON CONFIG (Kept same) ---
const SEASON_CONFIG = {
  winter: {
    name: "Winter Fest",
    gradient: "bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50",
    primary: "bg-indigo-600",
    primaryText: "text-indigo-600",
    accent: "bg-indigo-50",
    border: "border-indigo-100",
    icon: Snowflake,
    bannerGradient: "bg-gradient-to-r from-blue-900 to-indigo-800",
    ring: "focus:ring-indigo-500"
  },
  summer: {
    name: "Summer Chill",
    gradient: "bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50",
    primary: "bg-orange-500",
    primaryText: "text-orange-600",
    accent: "bg-orange-50",
    border: "border-orange-100",
    icon: Sun,
    bannerGradient: "bg-gradient-to-r from-orange-400 to-amber-300",
    ring: "focus:ring-orange-500"
  },
  spring: {
    name: "Spring Bloom",
    gradient: "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50",
    primary: "bg-emerald-600",
    primaryText: "text-emerald-600",
    accent: "bg-emerald-50",
    border: "border-emerald-100",
    icon: Flower2,
    bannerGradient: "bg-gradient-to-r from-emerald-500 to-teal-400",
    ring: "focus:ring-emerald-500"
  },
  monsoon: {
    name: "Monsoon",
    gradient: "bg-gradient-to-br from-slate-200 via-gray-100 to-slate-300",
    primary: "bg-teal-600",
    primaryText: "text-teal-600",
    accent: "bg-teal-50",
    border: "border-teal-100",
    icon: CloudRain,
    bannerGradient: "bg-gradient-to-r from-slate-700 to-teal-800",
    ring: "focus:ring-teal-500"
  }
};

const getSeason = () => {
  const month = new Date().getMonth();
  if (month === 10 || month === 11 || month === 0) return "winter";
  if (month === 1 || month === 2) return "spring";
  if (month >= 3 && month <= 5) return "summer";
  return "monsoon";
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const currentSeason = getSeason();
  const theme = SEASON_CONFIG[currentSeason];
  const SeasonIcon = theme.icon;

  // --- STATE MANAGEMENT ---
  const [isEditing, setIsEditing] = useState(false);
  
  // Real User State
  const [user, setUser] = useState({
    name: "Alex Johnson",
    phone: "+91 98765 43210",
    email: "alex.j@example.com",
    avatar: "https://i.pravatar.cc/150?img=12"
  });

  // Temporary Form State (for editing)
  const [formData, setFormData] = useState(user);

  // --- HANDLERS ---
  const handleEditClick = () => {
    setFormData(user); // Reset form to current user data
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser(formData); // Commit changes
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const menuItems = [
    { icon: ShoppingBag, label: "My Orders", sub: "Check order status", route: "/orders" },
    { icon: MapPin, label: "Saved Addresses", sub: "Home, Office", route: "/addresses" },
    { icon: Settings, label: "Settings", sub: "Notifications, Privacy", route: "/settings" },
  ];

  return (
    <div className={`min-h-screen ${theme.gradient} transition-colors duration-500 pb-10 relative`}>

      {/* --- Top Banner --- */}
      <div className={`${theme.bannerGradient} h-48 relative overflow-hidden rounded-b-[2rem] shadow-lg`}>
        <div className="absolute top-6 left-6">
          <h1 className="text-white text-xl font-bold">My Profile</h1>
        </div>
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30">
          <SeasonIcon className="w-4 h-4 text-white" />
          <span className="text-white text-xs font-semibold">{theme.name}</span>
        </div>
      </div>

      {/* --- Profile Card --- */}
      <div className="px-5 -mt-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 relative">

          {/* Edit Button Trigger */}
          <button 
            onClick={handleEditClick}
            className={`absolute top-4 right-4 p-2 rounded-full ${theme.accent} ${theme.primaryText} hover:bg-gray-100 transition`}
          >
            <Edit2 size={16} />
          </button>

          {/* User Display Info */}
          <div className="flex flex-col items-center">
            <img 
              src={user.avatar} 
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
            />
            <h2 className="mt-3 text-2xl font-bold text-slate-800">{user.name}</h2>

            <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
              <Phone size={14}/> <span>{user.phone}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Mail size={14}/> <span>{user.email}</span>
            </div>
          </div>

          {/* Wallet */}
          <div className={`mt-6 p-4 rounded-xl ${theme.accent} border ${theme.border} flex justify-between items-center`}>
            <div>
              <p className={`${theme.primaryText} text-xs font-semibold`}>Wallet Balance</p>
              <h3 className={`${theme.primaryText} text-xl font-bold`}>₹450.00</h3>
            </div>
            <button className={`bg-white px-4 py-2 rounded-lg text-sm font-semibold shadow ${theme.primaryText}`}>
              Add Money
            </button>
          </div>
        </div>

        {/* --- Menu --- */}
        <div className="mt-6 space-y-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.route)}
              className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${theme.accent} ${theme.primaryText}`}>
                  <item.icon size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-left">{item.label}</h4>
                  <p className="text-xs text-slate-400 text-left">{item.sub}</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </button>
          ))}

          <button className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 text-red-500 hover:bg-red-50 transition border border-transparent hover:border-red-200">
            <div className="p-3 rounded-lg bg-red-50">
              <LogOut size={22} />
            </div>
            <span className="font-semibold">Log Out</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center pb-6">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
            Designed with <SeasonIcon className={`w-3 h-3 ${theme.primaryText}`} /> for {theme.name}
          </p>
        </div>
      </div>

      {/* --- EDIT MODAL OVERLAY --- */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className={`p-4 border-b ${theme.border} flex justify-between items-center bg-gray-50`}>
              <h3 className="font-bold text-lg text-slate-800">Edit Profile</h3>
              <button onClick={() => setIsEditing(false)} className="p-1 rounded-full hover:bg-gray-200 text-slate-500">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              
              {/* Avatar Change (Visual Only) */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                   <img src={formData.avatar} className="w-20 h-20 rounded-full object-cover opacity-80" alt="edit" />
                   <div className={`absolute inset-0 flex items-center justify-center bg-black/30 rounded-full cursor-pointer`}>
                      <Camera className="text-white w-8 h-8" />
                   </div>
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 ${theme.ring} transition`}
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 ${theme.ring} transition`}
                  />
                </div>
              </div>

               {/* Email Input */}
               <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 ${theme.ring} transition`}
                  />
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 rounded-xl font-semibold text-slate-600 bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className={`flex-1 py-3 rounded-xl font-semibold text-white ${theme.primary} shadow-lg shadow-indigo-200 hover:opacity-90 transition flex items-center justify-center gap-2`}
              >
                <Check size={18} /> Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;