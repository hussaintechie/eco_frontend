import React, { useState, useEffect } from 'react';
import {
  Search, X, Clock, ArrowUpRight, Filter, ShoppingCart,
  Snowflake, Sun, Flower2, CloudRain, Gift, Thermometer, Leaf
} from 'lucide-react';
import API from "../api/auth";
import { useLocation, useNavigate } from "react-router-dom";
// --- SEASONAL CONFIG (Reused) ---
const SEASON_CONFIG = {
  winter: {
    name: "Winter Fest",
    gradient: "bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50",
    primary: "bg-indigo-600",
    primaryText: "text-indigo-600",
    accent: "bg-indigo-100",
    accentText: "text-indigo-700",
    cardBg: "bg-white/90 border-indigo-100",
    icon: Snowflake,
    bannerTone: "brightness-105 saturate-50",
  },
  summer: {
    name: "Summer Chill",
    gradient: "bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50",
    primary: "bg-orange-500",
    primaryText: "text-orange-600",
    accent: "bg-orange-100",
    accentText: "text-orange-700",
    cardBg: "bg-white/90 border-orange-100",
    icon: Sun,
    bannerTone: "saturate-150 contrast-110",
  },
  spring: {
    name: "Spring Bloom",
    gradient: "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50",
    primary: "bg-emerald-600",
    primaryText: "text-emerald-600",
    accent: "bg-emerald-100",
    accentText: "text-emerald-700",
    cardBg: "bg-white/90 border-emerald-100",
    icon: Flower2,
    bannerTone: "contrast-105 brightness-110",
  },
  monsoon: {
    name: "Monsoon",
    gradient: "bg-gradient-to-br from-slate-200 via-gray-100 to-slate-300",
    primary: "bg-teal-600",
    primaryText: "text-teal-600",
    accent: "bg-teal-100",
    accentText: "text-teal-700",
    cardBg: "bg-white/90 border-teal-100",
    icon: CloudRain,
    bannerTone: "contrast-125 brightness-90 sepia-[.2]",
  }
};

const getSeason = () => {
  const month = new Date().getMonth();
  if (month === 10 || month === 11 || month === 0) return "winter";
  if (month === 1 || month === 2) return "spring";
  if (month >= 3 && month <= 5) return "summer";
  return "monsoon";
};

// --- MOCK DATA ---
// const ALL_PRODUCTS = [
//   { id: 1, name: "Organic Bananas", category: "Fruits", price: 40, image: "https://placehold.co/150?text=Bananas" },
//   { id: 2, name: "Fresh Milk", category: "Dairy", price: 32, image: "https://placehold.co/150?text=Milk" },
//   { id: 3, name: "Dark Chocolate", category: "Snacks", price: 120, image: "https://placehold.co/150?text=Choco" },
//   { id: 4, name: "Green Tea", category: "Beverage", price: 250, image: "https://placehold.co/150?text=Tea" },
//   { id: 5, name: "Avocado", category: "Fruits", price: 80, image: "https://placehold.co/150?text=Avocado" },
//   { id: 6, name: "Almonds", category: "Nuts", price: 450, image: "https://placehold.co/150?text=Almonds" },
// ];

// const RECENT_SEARCHES = ["Milk", "Green Tea", "Sugar free"];
//const POPULAR_TAGS = ["Fresh Fruits", "Dairy", "Winter Snacks", "Hot Coffee", "Nuts"];

const SearchPage = () => {
  const currentKey = getSeason();
  const theme = SEASON_CONFIG[currentKey];
  const SeasonIcon = theme.icon;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [ALL_PRODUCTS, setAllproduct] = useState([]);
  const [POPULAR_TAGS, setpopTags] = useState([]);

  const { state } = useLocation();
  const { id, name, img } = state || { id: 0, name: "", img: "" };

  // ✅ Set query from navigation state
  useEffect(() => {
    const cleanQuery = cleanSearchText(name);
    if (cleanQuery) {
      setQuery(cleanQuery);
    }
  }, [name]);

  // ✅ Fetch from API
  useEffect(() => {
    if (query.trim().length >= 2) {
      handledataprocess();
    } else {
      setAllproduct([]);
      setpopTags([]);
    }
  }, [query]);
  // ✅ Fetch from API
  useEffect(() => {
    handledataprocess(2);
  }, []);

  const handledataprocess = async (mode = 1) => {
    const cleanQuery = cleanSearchText(query);

    console.log(cleanQuery, "cleanQuery");
    try {
      const response = await API.post(
        "product/SearchItems",
        {
          searchtxt: cleanQuery,
          mode: mode,
        }
      );

      setAllproduct(response.data.data || []);
      setpopTags(response.data.popularTags || []);
    } catch (error) {
      console.error("Searchdata fetch error:", error);
      setAllproduct([]);
      setpopTags([]);
    }
  };
  const cleanSearchText = (text = "") => {
    return text
      .replace(/\s*--\s*\(.*?\)/g, "") // remove --(...)
      .trim();
  };
  // ✅ Instant client-side filter
  useEffect(() => { if (query.trim() === "") { setResults([]); } else { const filtered = ALL_PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())); setResults(filtered); } }, [query]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme.gradient}`}>

      {/* --- 1. Sticky Search Header --- */}
      <div className="sticky top-0 z-50 p-4 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            placeholder={`Search for ${theme.name} specials...`}
            className={`w-full pl-12 pr-10 py-3.5 rounded-xl border-none ring-1 outline-none transition-all shadow-sm
              ${isFocused
                ? `ring-2 ring-offset-2 ${theme.accent} ring-${theme.primaryText.split('-')[1]}-400` // Dynamic focus ring
                : 'ring-gray-200 bg-gray-50'
              }
            `}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />

          {/* Search Icon (Left) */}
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isFocused ? theme.primaryText : 'text-gray-400'}`}
          />

          {/* Clear Button (Right) - Only shows when typing */}
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200 rounded-full p-1 hover:bg-gray-300"
            >
              <X size={14} className="text-gray-600" />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 pb-20">

        {/* --- 2. State: User is Searching (Showing Results) --- */}
        {query ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-700">
                Found {results.length} results
              </h2>
              <button className={`text-xs flex items-center gap-1 font-medium ${theme.primaryText}`}>
                <Filter size={14} /> Filter
              </button>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {results.map(item => (
                  <div key={item.id} className={`${theme.cardBg} p-3 rounded-xl border shadow-sm`}>
                    <div className={`aspect-square rounded-lg bg-gray-100 mb-3 overflow-hidden ${theme.bannerTone}`}>
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-medium text-gray-800 text-sm line-clamp-1">{item.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`font-bold ${theme.primaryText}`}>₹{item.price}</span>
                      <button className={`${theme.accent} p-1.5 rounded-lg ${theme.primaryText}`}>
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SeasonIcon size={48} className={`mx-auto mb-3 opacity-30 ${theme.primaryText}`} />
                <p className="text-gray-500">No items found for "{query}"</p>
              </div>
            )}
          </div>
        ) : (
          /* --- 3. State: Default (History & Trending) --- */
          <div className="space-y-8 animate-fade-in">

            {/* Recent Searches */}
            {/* <section>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Recent</h3>
                <button className="text-xs text-gray-400 hover:text-red-500">Clear</button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {RECENT_SEARCHES.map((term, index) => (
                  <button 
                    key={index}
                    onClick={() => setQuery(term)}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 border-b last:border-0 border-gray-50 transition"
                  >
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-700 flex-1">{term}</span>
                    <ArrowUpRight size={16} className="text-gray-300" />
                  </button>
                ))}
              </div>
            </section> */}

            {/* Popular/Trending Categories */}
            <section>
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                Trending {theme.name} <SeasonIcon size={14} className={theme.primaryText} />
              </h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition active:scale-95
                      ${index === 0 ? `${theme.primary} text-white` : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}
                    `}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;