import React, { useState, useEffect } from 'react';
import { 
  Snowflake, Sun, CloudRain, Flower2, 
  User, MapPin, ShoppingBag,
  LogOut, ChevronRight, Edit2, Phone,  
   X,  
} from 'lucide-react';
import { getProfileAPI, updateProfileAPI } from "../api/profileAPI";
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

  // --- USER STATE (Backend returns only name + phone) ---
  const [user, setUser] = useState({
    name: "",
    phone: "",
    avatar: "null" // fallback avatar
  });

  // Temporary Form State (for editing)
  const [formData, setFormData] = useState(user);

  const [isEditing, setIsEditing] = useState(false);

  // --- LOAD PROFILE FROM BACKEND ---
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfileAPI();

      // Merge with fallback avatar/email
      const profileData = {
        ...user,
        ...res.data
      };

      setUser(profileData);
      setFormData(profileData);
    } catch (err) {
      console.log("Error loading profile:", err);
    }
  };

  // --- SAVE PROFILE ---
  const handleSave = async () => {
    try {
      await updateProfileAPI(formData);
      setUser(formData);
      setIsEditing(false);
    } catch (err) {
      console.log("Error updating profile:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleremove = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/", { replace: true });
};

  const menuItems = [
    { icon: ShoppingBag, label: "My Orders", sub: "Check order status", route: "/orders" },
    { icon: MapPin, label: "Saved Addresses", sub: "Home, Office", route: "/addresses" },
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

          {/* Edit Button */}
          <button 
            onClick={() => setIsEditing(true)}
            className={`absolute top-4 right-4 p-2 rounded-full ${theme.accent} ${theme.primaryText}`}
          >
            <Edit2 size={16} />
          </button>

          {/* User Display Info */}
          <div className="flex flex-col items-center">
           <div
  className={`
    w-24 h-24 rounded-full border-4 border-white shadow-md
    flex items-center justify-center
    ${theme.primary} text-white
    text-3xl font-bold uppercase
  `}
>
  {user.name?.charAt(0) || "?"}
</div>

            <h2 className="mt-3 text-2xl font-bold text-slate-800">{user.name}</h2>

            <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
              <Phone size={14}/> <span>{user.phone}</span>
            </div>

            
          </div>
        </div>

        {/* Menu */}
        <div className="mt-6 space-y-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.route)}
              className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${theme.accent} ${theme.primaryText}`}>
                  <item.icon size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">{item.label}</h4>
                  <p className="text-xs text-slate-400">{item.sub}</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </button>
          ))}

          <button className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 text-red-500" onClick={handleremove}>
            <LogOut size={22} />
            <span className="font-semibold">Log Out</span>
          </button>
        </div>
      </div>

      {/* EDIT POPUP */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">

            {/* Header */}
            <div className={`p-4 border-b ${theme.border} flex justify-between bg-gray-50`}>
              <h3 className="font-bold text-lg text-slate-800">Edit Profile</h3>
              <button onClick={() => setIsEditing(false)} className="p-1">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 py-3 rounded-xl bg-slate-50 outline-none focus:ring-2 ${theme.ring}`}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 py-3 rounded-xl bg-slate-50 outline-none focus:ring-2 ${theme.ring}`}
                  />
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t flex gap-3">
              <button 
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className={`flex-1 py-3 rounded-xl text-white ${theme.primary}`}
              >
                 Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
