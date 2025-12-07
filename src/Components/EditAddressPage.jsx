import React, { useState } from 'react';
import { 
  ArrowLeft, MapPin, Home, Briefcase, 
  Navigation, Save, Snowflake, Sun, CloudRain, Flower2 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// --- SEASON CONFIG (Consistent) ---
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

const EditAddressPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentSeason = getSeason();
  const theme = SEASON_CONFIG[currentSeason];

  // Get address passed from previous page, or use defaults
  const initialData = location.state?.address || {
    type: "Home",
    line1: "",
    line2: "",
    city: ""
  };

  const [formData, setFormData] = useState(initialData);

  const handleSave = () => {
    // In a real app, you would API call here
    alert("Address Updated Successfully!");
    navigate(-1); // Go back
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme.gradient}`}>
      
      {/* --- 1. Top Half: Map View --- */}
      <div className="relative h-[40vh] bg-slate-200 w-full overflow-hidden">
        {/* Header (Absolute) */}
        <div className="absolute top-0 left-0 right-0 p-4 z-20 flex items-center justify-between">
             <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-50">
                <ArrowLeft size={20} />
             </button>
             <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm text-xs font-bold text-slate-600">
                Adjust Pin
             </div>
        </div>

        {/* Simulated Map Background */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>

        {/* Center Pin (Draggable simulation) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-4 flex flex-col items-center">
            <div className={`p-3 rounded-full ${theme.primary} shadow-xl ring-4 ring-white animate-bounce`}>
                <MapPin className="text-white w-6 h-6" fill="currentColor" />
            </div>
            <div className="w-2 h-2 bg-black/20 rounded-full blur-[2px] mt-1"></div>
        </div>

        {/* "Locate Me" Button */}
        <button className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg text-slate-700 hover:bg-slate-50">
            <Navigation size={20} />
        </button>
      </div>

      {/* --- 2. Bottom Half: Edit Form --- */}
      <div className="flex-1 bg-white rounded-t-[2rem] -mt-6 relative z-10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] p-6 md:p-8">
         <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6"></div>

         <h2 className="text-xl font-bold text-slate-800 mb-6">Edit Location Details</h2>

         {/* Form Fields */}
         <div className="space-y-5">
            
            {/* Tag Selection */}
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Save As</label>
                <div className="flex gap-3">
                    {['Home', 'Work', 'Other'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFormData({...formData, type})}
                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition flex items-center gap-2
                                ${formData.type === type 
                                    ? `${theme.light} ${theme.primaryText} ${theme.border}` 
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}
                            `}
                        >
                            {type === 'Home' && <Home size={14}/>}
                            {type === 'Work' && <Briefcase size={14}/>}
                            {type === 'Other' && <MapPin size={14}/>}
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">House / Flat / Block No.</label>
                    <input 
                        type="text" 
                        value={formData.line1}
                        onChange={(e) => setFormData({...formData, line1: e.target.value})}
                        className="w-full p-4 bg-slate-50 rounded-xl font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 transition"
                    />
                </div>
                
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Area / Street</label>
                        <input 
                            type="text" 
                            value={formData.line2}
                            onChange={(e) => setFormData({...formData, line2: e.target.value})}
                            className="w-full p-4 bg-slate-50 rounded-xl font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 transition"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">City</label>
                        <input 
                            type="text" 
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            className="w-full p-4 bg-slate-50 rounded-xl font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 transition"
                        />
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <button 
                onClick={handleSave}
                className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg shadow-indigo-200 hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center gap-2 mt-4 ${theme.primary}`}
            >
                <Save size={20} /> Save Address
            </button>

         </div>
      </div>
    </div>
  );
};

export default EditAddressPage;