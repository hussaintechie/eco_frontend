import React from 'react';
import { FaApple, FaGooglePlay, FaEnvelope, FaPhoneAlt, FaLeaf } from 'react-icons/fa';
import { getSeason, SEASON_CONFIG } from './SEASON_CONFIG'; 

const Footer = () => {
  const currentSeason = getSeason();
  const theme = SEASON_CONFIG[currentSeason];

  return (
    <footer className={`hidden md:block w-full ${theme.gradient} pt-10 pb-6 px-4 md:px-8 lg:px-16 border-t ${theme.border} text-gray-700 text-sm relative z-10`}>
      
      {/* Top Section */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-10">
        
        {/* Column 1: Brand & Apps */}
        <div className="flex flex-col gap-6 lg:w-1/4">
          
          {/* --- NEW SB GROCES LOGO --- */}
          <div className="flex items-center gap-3">
            {/* Icon Container */}
            <div className={`p-2 rounded-xl ${theme.primary} text-white shadow-lg shadow-${theme.primary}/30`}>
              <FaLeaf className="text-white -rotate-12" size={22} />
            </div>
            {/* Text Container */}
            <div className="flex flex-col">
              <h1 className="font-extrabold text-2xl tracking-tight leading-none flex gap-1">
                <span className="text-gray-900">SB</span>
                <span className={`${theme.primaryText}`}>GROCES</span>
              </h1>
              <span className="text-[11px] font-bold text-gray-400 tracking-widest mt-0.5">FRESH & ORGANIC</span>
            </div>
          </div>
          {/* -------------------------- */}

          <div className="flex flex-col gap-3 mt-2">
            <p className="text-gray-500 text-xs">Download The SB Groces App</p>
            <div className="flex gap-2 sm:justify-start"> 
              <button className="bg-black text-white px-3 py-1.5 rounded-md flex items-center gap-2 hover:bg-gray-800 transition">
                <FaApple size={20} />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px]">Download on the</span>
                  <span className="font-semibold text-sm">App Store</span>
                </div>
              </button>
              <button className="bg-black text-white px-3 py-1.5 rounded-md flex items-center gap-2 hover:bg-gray-800 transition">
                <FaGooglePlay size={18} />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px]">GET IT ON</span>
                  <span className="font-semibold text-sm">Google Play</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: Useful Links */}
        

        {/* Column 3: Categories */}
        <div className="lg:w-1/2">
          <h3 className={`font-semibold mb-4 ${theme.primaryText}`}>Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-3 text-xs sm:text-sm">
            <a href="#" className="hover:text-gray-900 transition">Fresh Fruits</a>
            <a href="#" className="hover:text-gray-900 transition">Home Needs</a>
            <a href="#" className="hover:text-gray-900 transition">Fresh Vegetables</a>
            <a href="#" className="hover:text-gray-900 transition">Dairy, Eggs & Breads</a>
            
            <a href="#" className="hover:text-gray-900 transition">Masalas & Dry Fruits</a>
            <a href="#" className="hover:text-gray-900 transition">Edible Oil & Ghee</a>
            <a href="#" className="hover:text-gray-900 transition">Chips & Namkeens</a>
            <a href="#" className="hover:text-gray-900 transition">Rice, Atta & Dal</a>
            
            <a href="#" className="hover:text-gray-900 transition">Bakery & Biscuits</a>
            <a href="#" className="hover:text-gray-900 transition">Instant & Frozen</a>
            <a href="#" className="hover:text-gray-900 transition">Batter & Breakfast</a>
            <a href="#" className="hover:text-gray-900 transition">Drinks & Juices</a>
            
            <a href="#" className="hover:text-gray-900 transition">Cleaning Essentials</a>
            <a href="#" className="hover:text-gray-900 transition">Personal Care</a>
            <a href="#" className="hover:text-gray-900 transition">Health & Pharma</a>
            <a href="#" className="hover:text-gray-900 transition">Sweets & Chocolates</a>
          </div>
        </div>
      </div>

      <hr className={`my-8 ${theme.border} max-w-7xl mx-auto`} />

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-xs text-gray-500 pb-10 md:pb-0">
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <p>© 2026 SBS Groces, All Rights Reserved.</p>
          
        </div>

        <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
            <h4 className={`font-semibold ${theme.primaryText}`}>Contact us</h4>
            <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:sarathy8535@gmail.com" className={`flex items-center gap-2 hover:opacity-80 transition ${theme.accentText}`}>
                    <FaEnvelope /> sarathy8535@gmail.com
                </a>
                <a href="tel:7806931972" className={`flex items-center gap-2 hover:opacity-80 transition ${theme.accentText}`}>
                    <FaPhoneAlt /> 7806931972
                </a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;