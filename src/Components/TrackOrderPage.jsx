import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Phone, MessageSquare, MapPin, 
  CheckCircle2, Circle, Truck, Package, 
  Snowflake, Sun, CloudRain, Flower2, 
  MoreVertical, Share2, AlertTriangle, HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- 1. SEASON CONFIG (Consistent) ---
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

const TrackOrderPage = () => {
  const navigate = useNavigate();
  const currentSeason = getSeason();
  const theme = SEASON_CONFIG[currentSeason];
  const SeasonIcon = theme.icon;

  // --- STATE FOR MENU ---
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  // --- MOCK DATA ---
  const orderInfo = {
    id: "ORD-8821",
    eta: "15 - 20 mins",
    arrival: "02:45 PM",
    driver: {
      name: "Rajesh Kumar",
      rating: 4.8,
      vehicle: "Honda Activa • TN-38-BZ-1234",
      avatar: "https://i.pravatar.cc/150?img=11"
    }
  };

  const trackingSteps = [
    { label: "Order Placed", time: "1:30 PM", status: "completed", icon: Package },
   
    { label: "Out for Delivery", time: "2:15 PM", status: "current", icon: MapPin },
    { label: "Delivered", time: "Estimated 2:45 PM", status: "pending", icon: CheckCircle2 },
  ];

  return (
    <div className={`min-h-screen ${theme.gradient} relative overflow-hidden flex flex-col`}>
      
      {/* --- 1. Header (Floating) --- */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-slate-700 hover:bg-gray-50 transition"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="bg-white/90 backdrop-blur shadow-md px-4 py-2 rounded-full flex items-center gap-2">
            <span className="text-sm font-bold text-slate-700">Order #{orderInfo.id}</span>
          </div>

          {/* ⭐ MENU CONTAINER ⭐ */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className={`w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-slate-700 hover:bg-gray-50 transition ${showMenu ? 'ring-2 ring-indigo-100' : ''}`}
            >
              <MoreVertical size={20} />
            </button>

            {/* ⭐ DROPDOWN MENU ⭐ */}
            {showMenu && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                 <button className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <Share2 size={16} className="text-slate-400"/> Share Details
                 </button>
                 <button className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <HelpCircle size={16} className="text-slate-400"/> Help & Support
                 </button>
                 <div className="h-px bg-slate-100 my-0"></div>
                 <button className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium">
                    <AlertTriangle size={16} /> Report Issue
                 </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* --- 2. Map Area (Simulated) --- */}
      <div className="flex-1 bg-slate-200 relative w-full h-[45vh] lg:h-[50vh]">
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>
        
        {/* Path Line */}
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 stroke-slate-400 stroke-[3] fill-none stroke-dashed">
            <path d="M 10 10 Q 120 100 240 50" strokeDasharray="8 4" />
        </svg>

        {/* Store */}
        <div className="absolute top-[35%] left-[20%] flex flex-col items-center">
            <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center p-1.5">
               <SeasonIcon className={`w-full h-full text-slate-400`} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-white/80 px-1 rounded mt-1">Store</span>
        </div>

        {/* User */}
        <div className="absolute top-[40%] right-[15%] flex flex-col items-center">
            <div className={`w-4 h-4 ${theme.primary} rounded-full border-2 border-white shadow-lg animate-pulse`}></div>
            <span className="text-[10px] font-bold text-slate-800 bg-white/80 px-2 py-0.5 rounded mt-2 shadow-sm">Home</span>
        </div>

        {/* Truck */}
        <div className="absolute top-[55%] left-[50%] -translate-x-1/2 flex flex-col items-center animate-bounce">
            <div className={`${theme.primary} text-white p-2 rounded-full shadow-xl shadow-indigo-500/20 z-10 border-2 border-white`}>
                <Truck size={20} fill="currentColor" />
            </div>
            <div className="bg-white text-slate-800 text-xs font-bold px-2 py-1 rounded-md shadow mt-1">
                {orderInfo.eta}
            </div>
        </div>
      </div>

      {/* --- 3. Bottom Sheet (Details) --- */}
      <div className="bg-white rounded-t-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] flex-1 -mt-6 z-10 relative">
        <div className="max-w-2xl mx-auto p-6 md:p-8">
          
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>

          <div className="flex justify-between items-end mb-8">
          
            <div className={`px-3 py-1 rounded-full ${theme.light} ${theme.primaryText} text-xs font-bold flex items-center gap-1`}>
                <SeasonIcon size={12}/> {theme.name}
            </div>
          </div>

          <div className="mb-8 relative">
            <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-slate-100 z-0"></div>
            <div className="space-y-6 relative z-10">
                {trackingSteps.map((step, index) => (
                    <div key={index} className="flex gap-4 items-start group">
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-colors duration-300
                            ${step.status === 'completed' ? `${theme.primary} border-transparent text-white` : 
                              step.status === 'current' ? `bg-white ${theme.border} ${theme.primaryText} ring-4 ${theme.light}` : 
                              'bg-white border-slate-200 text-slate-300'}
                        `}>
                            {step.status === 'completed' ? <CheckCircle2 size={18} /> : 
                             step.status === 'current' ? <step.icon size={18} /> :
                             <Circle size={14} />}
                        </div>
                        <div className="pt-1 flex-1">
                            <h4 className={`text-sm font-bold ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>
                                {step.label}
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5">{step.time}</p>
                        </div>
                    </div>
                ))}
            </div>
          </div>

        
          

        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;