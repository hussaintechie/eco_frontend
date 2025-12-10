// src/SEASON_CONFIG.jsx
import { Snowflake, Sun, CloudRain, Flower2 } from "lucide-react";

const COMMON = {
  cardBg: "bg-white",
  badge: "bg-black/60",
  bannerTone: "",
  accentText: "text-gray-800",
};

const SEASON_CONFIG = {
  winter: {
    name: "Winter Fest",
    gradient: "bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50",
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
    gradient: "bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50",
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
    gradient: "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50",
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
    gradient: "bg-gradient-to-br from-slate-200 via-gray-100 to-slate-300",
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
  // Month is 0-indexed (0 = Jan, 11 = Dec)
  if (month === 10 || month === 11 || month === 0) return "winter";
  if (month === 1 || month === 2) return "spring";
  if (month >= 3 && month <= 5) return "summer";
  return "monsoon"; // June - Oct roughly
};

// --- 2. PARTICLES COMPONENT ---
const SeasonalParticles = ({ season }) => {
  const particles = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${Math.random() * 5 + 5}s`,
    size: Math.random() * 15 + 5,
  }));

  if (season === "winter") {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute text-white/60 animate-fall"
            style={{
              left: p.left,
              top: -50,
              fontSize: `${p.size}px`,
              animationDelay: p.animationDelay,
              animationDuration: `${parseFloat(p.animationDuration) + 5}s`,
            }}
          >
            ❄
          </div>
        ))}
        <style>{`
          @keyframes fall {
            0% { transform: translateY(-50px) rotate(0deg); opacity: 0; }
            10% { opacity: 0.8; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
          .animate-fall { animation-name: fall; animation-timing-function: linear; animation-iteration-count: infinite; }
        `}</style>
      </div>
    );
  }

  if (season === "summer") {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Sun Glare Effect */}
        <div className="absolute top-[-150px] right-[-150px] w-[500px] h-[500px] bg-yellow-400/20 rounded-full blur-[100px] animate-pulse"></div>
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bg-orange-200/40 rounded-full animate-float"
            style={{
              left: p.left,
              bottom: -20,
              width: `${p.size / 2}px`,
              height: `${p.size / 2}px`,
              animationDelay: p.animationDelay,
              animationDuration: `${parseFloat(p.animationDuration) * 0.5}s`,
            }}
          ></div>
        ))}
        <style>{`
          @keyframes float {
            0% { transform: translateY(100px) translateX(0); opacity: 0; }
            20% { opacity: 0.6; }
            100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
          }
          .animate-float { animation-name: float; animation-timing-function: ease-in; animation-iteration-count: infinite; }
        `}</style>
      </div>
    );
  }

  if (season === "spring") {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute text-pink-400/50 animate-sway"
            style={{
              left: p.left,
              top: -50,
              fontSize: `${p.size}px`,
              animationDelay: p.animationDelay,
              animationDuration: `${parseFloat(p.animationDuration) * 1.5}s`,
            }}
          >
            🌸
          </div>
        ))}
        <style>{`
          @keyframes sway {
            0% { transform: translateY(-50px) translateX(0) rotate(0deg); opacity: 0; }
            20% { opacity: 0.8; }
            50% { transform: translateY(50vh) translateX(100px) rotate(180deg); }
            100% { transform: translateY(100vh) translateX(-50px) rotate(360deg); opacity: 0; }
          }
          .animate-sway { animation-name: sway; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        `}</style>
      </div>
    );
  }

  if (season === "monsoon") {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Gloomy Sky Overlay */}
        <div className="absolute inset-0 bg-slate-900/5 z-0"></div>
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bg-blue-400/60 rounded-full animate-rain"
            style={{
              left: p.left,
              top: -50,
              width: '2px',
              height: `${p.size * 1.5}px`,
              animationDelay: `${Math.random()}s`,
              animationDuration: `0.8s`,
            }}
          ></div>
        ))}
        <style>{`
          @keyframes rain {
            0% { transform: translateY(-50px); opacity: 0; }
            20% { opacity: 0.7; }
            100% { transform: translateY(100vh); opacity: 0; }
          }
          .animate-rain { animation-name: rain; animation-timing-function: linear; animation-iteration-count: infinite; }
        `}</style>
      </div>
    );
  }

  return null;
};
export { SEASON_CONFIG, getSeason, SeasonalParticles };