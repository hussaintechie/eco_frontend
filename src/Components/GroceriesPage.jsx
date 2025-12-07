import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Search, ShoppingCart, User, 
  Snowflake, Sun, Flower2, CloudRain,
  Home, Heart
} from "lucide-react";

// --- MOCK NAVIGATION (Replaces react-router-dom for standalone preview) ---
const useNavigate = () => {
  return (path) => {
    console.log(`Navigation triggered to: ${path}`);
    if (path === -1) {
      console.log("Navigating Back");
    }
  };
};

// --- 1. SEASONAL CONFIGURATION (Shared) ---
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
    mobileHeader: "bg-gradient-to-r from-blue-600 to-indigo-600"
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
    mobileHeader: "bg-gradient-to-r from-orange-500 to-orange-600"
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
    mobileHeader: "bg-gradient-to-r from-emerald-500 to-teal-500"
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
    mobileHeader: "bg-gradient-to-r from-slate-700 to-teal-700"
  }
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
  if (season === "winter") {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-indigo-200/40 animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: -20,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDuration: `${Math.random() * 5 + 5}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            ❄
          </div>
        ))}
        <style>{`
          @keyframes fall {
            0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
            20% { opacity: 0.8; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
          .animate-fall { animation: fall linear infinite; }
        `}</style>
      </div>
    );
  }
  if (season === "summer") {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>
    );
  }
  if (season === "spring") {
      return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
             {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute text-emerald-100/40"
                    style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    fontSize: `${Math.random() * 20 + 10}px`,
                    transform: `rotate(${Math.random() * 360}deg)`
                    }}
                >
                    🌸
                </div>
            ))}
        </div>
      )
  }
  if (season === "monsoon") {
    return <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-900/5"></div>;
  }
  return null;
};

// --- 3. INTERNAL BOTTOM NAV COMPONENT ---
const BottomNav = ({ theme }) => {
  const [active, setActive] = useState('home');
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'cart', icon: ShoppingCart, label: 'Cart', special: true },
    { id: 'saved', icon: Heart, label: 'Saved' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-6 inset-x-0 mx-auto w-[90%] md:hidden z-50">
      <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl shadow-gray-200/50 rounded-2xl flex justify-between items-center px-2 py-3">
        {navItems.map((item) => {
          const isActive = active === item.id;
          if (item.special) {
            return (
              <button 
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`relative -top-8 ${theme?.primary || 'bg-gray-800'} text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform`}
              >
                <item.icon size={24} />
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-white border-2 border-transparent rounded-full box-content text-[9px] font-bold text-black flex items-center justify-center">3</span>
              </button>
            )
          }
          return (
            <button 
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex flex-col items-center justify-center w-12 gap-1 transition-all ${isActive ? (theme?.primaryText || 'text-gray-900') : 'text-gray-400'}`}
            >
               <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
               {isActive && <span className="text-[9px] font-bold">{item.label}</span>}
            </button>
          )
        })}
      </div>
    </div>
  );
};

function GroceriesPage() {
  const navigate = useNavigate();
  const [currentSeason, setCurrentSeason] = useState("winter");

  useEffect(() => {
    setCurrentSeason(getSeason());
  }, []);

  const theme = SEASON_CONFIG[currentSeason];

  const categories = [
    { name: "Dairy, Eggs & Breads", img: "https://i.postimg.cc/ZRZrjYGJ/1.png" },
    { name: "Rice, Atta & Dal", img: "https://i.postimg.cc/tTKPMT9r/2.png" },
    { name: "Masalas & Dry Fruits", img: "https://i.postimg.cc/XYx9nSg4/3.png" },
    { name: "Edible Oil & Ghee", img: "https://i.postimg.cc/VvRP8yS8/4.png" },
    { name: "Chips & Namkeens", img: "https://i.postimg.cc/L4wpJ17d/5.png" },
    { name: "Drinks & Juices", img: "https://i.postimg.cc/GhMY3VVq/6.png" },
    { name: "Sweets & Chocolates", img: "https://i.postimg.cc/VNtnQh33/7.png" },
    { name: "Bakery & Biscuits", img: "https://i.postimg.cc/kXKcLrwB/8.png" },
    { name: "Instant & Frozen", img: "https://i.postimg.cc/jd8Q8mPS/9.png" },
    { name: "Batter & Breakfast", img: "https://i.postimg.cc/hPy0bSH3/10.png" },
    { name: "Mayonnaise & Sauces", img: "https://i.postimg.cc/fWPfMZbN/11.png" },
    { name: "Tea, Coffee & More", img: "https://i.postimg.cc/nLKcYS02/12.png" },
    { name: "Cleaning Essentials", img: "https://i.postimg.cc/jdXP14k0/13.png" },
    { name: "Personal Care", img: "https://i.postimg.cc/gjyHfH56/14.png" },
    { name: "Health & Pharma", img: "https://i.postimg.cc/T1VS4GJK/15.png" },
    { name: "Stationery & Party Needs", img: "https://i.postimg.cc/XJDbHj6V/16.png" },
    { name: "Baby Care", img: "https://i.postimg.cc/T1PdJGW3/17.png" },
    { name: "Home Needs", img: "https://i.postimg.cc/ZnmwJNCf/18.png" },
  ];

  return (
    // MAIN WRAPPER
    <div className={`w-full min-h-screen relative ${theme.gradient} transition-colors duration-700 font-sans`}>

      <SeasonalParticles season={currentSeason} />

      {/* ======================= */}
      {/* MOBILE HEADER (< md)    */}
      {/* ======================= */}
      <div className={`md:hidden fixed top-0 w-full z-50 ${theme.mobileHeader} h-20 flex items-center px-4 shadow-none text-white transition-colors duration-500`}>
        <ArrowLeft 
          className="w-6 h-6 cursor-pointer" 
          onClick={() => navigate(-1)} 
        />
        <p className="flex-1 text-xl font-bold text-center pr-2">Groceries</p>
        <Search className="w-6 h-6" />
      </div>

      {/* ======================= */}
      {/* DESKTOP HEADER (>= md)  */}
      {/* ======================= */}
      <div className="hidden md:flex fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm h-20 items-center px-8 shadow-sm justify-between">
        {/* Logo Area */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className={`w-8 h-8 ${theme.primary} rounded-lg flex items-center justify-center transition-colors`}>
                <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className={`text-2xl font-bold ${theme.primaryText} tracking-tight transition-colors`}>GroceryApp</span>
        </div>

        {/* Desktop Search Bar */}
        <div className="flex-1 max-w-2xl mx-8 relative">
            <input 
                type="text" 
                placeholder="Search for milk, bread, eggs..." 
                className={`w-full bg-gray-50 border border-gray-200 rounded-full py-3 px-6 pl-12 focus:ring-2 focus:ring-opacity-50 outline-none text-gray-700 focus:${theme.border.replace('border-', 'ring-')}`}
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        </div>

        {/* Desktop Nav Icons */}
        <div className="flex items-center gap-6 text-gray-600">
            <div className={`flex flex-col items-center cursor-pointer hover:${theme.primaryText} transition`}>
                <User className="w-6 h-6" />
                <span className="text-xs font-medium">Profile</span>
            </div>
            <div className={`flex flex-col items-center cursor-pointer hover:${theme.primaryText} transition relative`}>
                <ShoppingCart className="w-6 h-6" />
                <span className="text-xs font-medium">Cart</span>
                <span className={`absolute -top-1 -right-1 ${theme.primary} text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full transition-colors`}>2</span>
            </div>
        </div>
      </div>


      {/* ======================= */}
      {/* CONTENT AREA            */}
      {/* ======================= */}
      
      <div className="pt-20 md:pt-28 md:px-8 md:pb-12 relative z-10">
        
        {/* DESKTOP HERO BANNER (Hidden on Mobile) */}
        <div className={`hidden md:block max-w-7xl mx-auto mb-8 rounded-2xl overflow-hidden shadow-lg relative h-64 ${theme.bannerGradient} transition-colors duration-700`}>
             <div className="absolute inset-0 flex items-center px-12 text-white">
                 <div className="max-w-lg relative z-10">
                     <span className="bg-white/20 backdrop-blur px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 inline-block border border-white/30">
                        {currentSeason} Essentials
                     </span>
                     <h1 className="text-4xl font-bold mb-4">Fresh Groceries & Household Essentials</h1>
                     <p className="text-white/90 text-lg mb-6">Get everything delivered to your doorstep in minutes.</p>
                     <button className={`bg-white ${theme.primaryText} px-6 py-2 rounded-full font-bold hover:bg-gray-50 transition shadow-sm`}>Shop Now</button>
                 </div>
                 {/* Decorative Circle */}
                 <div className="absolute -right-20 -bottom-40 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
             </div>
        </div>

        {/* MAIN CARD / GRID CONTAINER */}
        <div className="bg-white/95 md:bg-white w-full rounded-t-[30px] md:rounded-2xl md:max-w-7xl md:mx-auto min-h-[calc(100vh-80px)] md:min-h-0 px-4 pt-6 pb-24 md:p-8 md:shadow-xl md:border md:border-gray-100 backdrop-blur-sm">
          
          {/* Section Title */}
          <div className="mb-6 flex items-center gap-2">
            <div>
               <h2 className="text-lg md:text-2xl font-bold text-gray-800 md:mb-1">Shop by Category</h2>
               <p className="hidden md:block text-gray-500 text-sm">Explore our wide range of products</p>
            </div>
            <div className={`hidden md:flex ml-auto items-center gap-2 text-xs font-bold ${theme.accent} ${theme.primaryText} px-3 py-1 rounded-full`}>
               {theme.icon && <theme.icon size={14} />}
               <span className="uppercase">{theme.name} Mode Active</span>
            </div>
          </div>
          
          <div className="h-[1px] bg-gray-100 mb-6 md:hidden" />

          {/* GRID LAYOUT */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8">
            {categories.map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center cursor-pointer group">
                
                {/* Image Container */}
                <div className={`bg-gray-50 md:bg-white md:border md:border-gray-100 rounded-xl p-2 w-full aspect-square flex items-center justify-center transition-all duration-300 group-hover:${theme.accent} md:group-hover:shadow-lg md:group-hover:${theme.border} md:group-hover:-translate-y-1`}>
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-contain rounded-lg mix-blend-multiply md:mix-blend-normal"
                  />
                </div>
                
                <p className={`text-xs md:text-sm mt-3 font-medium leading-tight text-gray-700 md:text-gray-800 group-hover:${theme.primaryText} transition-colors`}>
                    {item.name}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* MOBILE BOTTOM NAV (< md) */}
      <div className="md:hidden">
         <BottomNav theme={theme} />
      </div>

      {/* DESKTOP FOOTER (>= md) */}
      <div className="hidden md:block bg-gray-900 text-gray-400 py-12 mt-12 relative z-10">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-4 gap-8">
              <div>
                  <h3 className="text-white font-bold text-lg mb-4">GroceryApp</h3>
                  <p className="text-sm">Freshness delivered to your doorstep.</p>
              </div>
              <div>
                  <h4 className="text-white font-bold mb-4">Company</h4>
                  <ul className="space-y-2 text-sm">
                      <li>About Us</li>
                      <li>Careers</li>
                      <li>Blog</li>
                  </ul>
              </div>
              <div>
                  <h4 className="text-white font-bold mb-4">Help</h4>
                  <ul className="space-y-2 text-sm">
                      <li>FAQs</li>
                      <li>Contact Us</li>
                      <li>Shipping</li>
                  </ul>
              </div>
              <div>
                  <h4 className="text-white font-bold mb-4">Social</h4>
                  <div className="flex gap-4">
                      <div className="w-8 h-8 bg-gray-800 rounded-full hover:bg-white/20 transition cursor-pointer"></div>
                      <div className="w-8 h-8 bg-gray-800 rounded-full hover:bg-white/20 transition cursor-pointer"></div>
                      <div className="w-8 h-8 bg-gray-800 rounded-full hover:bg-white/20 transition cursor-pointer"></div>
                  </div>
              </div>
          </div>
      </div>

    </div>
  );
}

export default function App() {
  return <GroceriesPage />;
}