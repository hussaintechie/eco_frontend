// src/SEASON_CONFIG.jsx
import { Snowflake, Sun, CloudRain, Flower2 } from "lucide-react";

// --- THEME CONFIGURATION ---
const COMMON = {
  cardBg: "bg-white",
  badge: "bg-black/60",
  bannerTone: "",
  accentText: "text-gray-900",
};

const SEASON_CONFIG = {
  winter: {
    name: "Winter Fest",
    // Deep, crisp blues and violets
    gradient: "bg-slate-50", 
    primary: "bg-indigo-600",
    primaryText: "text-indigo-600",
    accent: "bg-indigo-50",
    accentText: "text-indigo-700",
    border: "border-indigo-100",
    icon: Snowflake,
    bannerGradient: "bg-gradient-to-r from-blue-900 to-indigo-800",
    mobileHeader: "bg-gradient-to-r from-blue-600 to-indigo-600",
    ...COMMON,
  },

  summer: {
    name: "Summer Chill",
    // Warm, golden glow
    gradient: "bg-orange-50/30",
    primary: "bg-orange-500",
    primaryText: "text-orange-600",
    accent: "bg-orange-50",
    accentText: "text-orange-700",
    border: "border-orange-100",
    icon: Sun,
    bannerGradient: "bg-gradient-to-r from-orange-400 to-amber-300",
    mobileHeader: "bg-gradient-to-r from-orange-500 to-orange-600",
    ...COMMON,
  },

  spring: {
    name: "Spring Bloom",
    // Fresh greens and soft pinks
    gradient: "bg-emerald-50/30",
    primary: "bg-emerald-600",
    primaryText: "text-emerald-600",
    accent: "bg-emerald-50",
    accentText: "text-emerald-700",
    border: "border-emerald-100",
    icon: Flower2,
    bannerGradient: "bg-gradient-to-r from-emerald-500 to-teal-400",
    mobileHeader: "bg-gradient-to-r from-emerald-500 to-teal-500",
    ...COMMON,
  },

  monsoon: {
    name: "Monsoon",
    // Cool, moody teals and grays
    gradient: "bg-slate-100",
    primary: "bg-teal-600",
    primaryText: "text-teal-600",
    accent: "bg-teal-50",
    accentText: "text-teal-700",
    border: "border-teal-100",
    icon: CloudRain,
    bannerGradient: "bg-gradient-to-r from-slate-700 to-teal-800",
    mobileHeader: "bg-gradient-to-r from-slate-700 to-teal-700",
    ...COMMON,
  },
};

const getSeason = () => {
  const month = new Date().getMonth();
  if (month === 10 || month === 11 || month === 0) return "winter";
  if (month === 1 || month === 2) return "spring";
  if (month >= 3 && month <= 5) return "summer";
  return "monsoon"; 
};

// --- NEW CREATIVE BACKGROUND COMPONENT ---
const SeasonalParticles = ({ season }) => {
  
  // 1. Texture Overlay (Makes it look like premium paper/grain)
  const NoiseOverlay = () => (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
      }}
    />
  );

  /* --- WINTER: Northern Lights Vibe --- */
  if (season === "winter") {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-50">
        <NoiseOverlay />
        {/* Large breathing blue/purple orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-300/30 rounded-full blur-[100px] animate-float-slow delay-0"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-300/20 rounded-full blur-[120px] animate-float-slow delay-1000"></div>
        <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] bg-violet-200/30 rounded-full blur-[80px] animate-pulse-slow"></div>
        
        <style>{`
          @keyframes float-slow {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(30px, 40px); }
          }
          @keyframes pulse-slow {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.1); opacity: 0.5; }
          }
          .animate-float-slow { animation: float-slow 15s ease-in-out infinite; }
          .animate-pulse-slow { animation: pulse-slow 10s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  /* --- SUMMER: Heat Haze & Golden Hour --- */
  if (season === "summer") {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FFFBF0]">
        <NoiseOverlay />
        {/* A large "Sun" glow that rotates slowly */}
        <div className="absolute top-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-gradient-to-b from-orange-300/30 to-yellow-200/10 rounded-full blur-[100px] animate-spin-slow"></div>
        
        {/* Rising heat blobs */}
        <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] bg-amber-200/40 rounded-full blur-[80px] animate-rise"></div>
        
        <style>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes rise {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-50px) scale(1.1); }
          }
          .animate-spin-slow { animation: spin-slow 60s linear infinite; }
          .animate-rise { animation: rise 20s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  /* --- SPRING: Soft Pastel Bloom --- */
  if (season === "spring") {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-emerald-50/20">
        <NoiseOverlay />
        {/* Pink and Green merging blobs */}
        <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-green-200/30 rounded-full blur-[90px] animate-drift-1"></div>
        <div className="absolute top-[20%] right-[10%] w-[35vw] h-[35vw] bg-pink-200/30 rounded-full blur-[90px] animate-drift-2"></div>
        <div className="absolute bottom-[-10%] left-[30%] w-[50vw] h-[50vw] bg-emerald-100/40 rounded-full blur-[100px] animate-drift-3"></div>

        <style>{`
          @keyframes drift-1 { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(40px, 20px); } }
          @keyframes drift-2 { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-30px, 40px); } }
          @keyframes drift-3 { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
          .animate-drift-1 { animation: drift-1 20s ease-in-out infinite; }
          .animate-drift-2 { animation: drift-2 18s ease-in-out infinite; }
          .animate-drift-3 { animation: drift-3 25s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  /* --- MONSOON: Moody Glass Window --- */
  if (season === "monsoon") {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-100">
        <NoiseOverlay />
        {/* Cool teal/gray blobs */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-200/50 to-transparent z-0"></div>
        
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-teal-200/30 rounded-full blur-[100px] animate-sway"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] bg-slate-300/40 rounded-full blur-[100px] animate-sway-reverse"></div>

        <style>{`
          @keyframes sway { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(50px); } }
          @keyframes sway-reverse { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-50px); } }
          .animate-sway { animation: sway 15s ease-in-out infinite; }
          .animate-sway-reverse { animation: sway-reverse 18s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  return null;
};

export { SEASON_CONFIG, getSeason, SeasonalParticles };