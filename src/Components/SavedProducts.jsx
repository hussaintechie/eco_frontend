import React, { useState } from 'react';
import { 
  Heart, Trash2, ShoppingCart, ArrowLeft, 
  Snowflake, Sun, Flower2, CloudRain, Gift, Thermometer, Leaf 
} from 'lucide-react';

// --- 1. YOUR SEASONAL CONFIGURATION ---
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
    badge: "bg-indigo-500 text-white",
    offerIcon: <Gift size={18} className="text-indigo-600"/>
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
    badge: "bg-orange-500 text-white",
    offerIcon: <Thermometer size={18} className="text-orange-600"/>
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
    badge: "bg-emerald-500 text-white",
    offerIcon: <Leaf size={18} className="text-emerald-600"/>
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
    badge: "bg-teal-600 text-white",
    offerIcon: <CloudRain size={18} className="text-teal-600"/>
  }
};

const getSeason = () => {
  const month = new Date().getMonth(); 
  if (month === 10 || month === 11 || month === 0) return "winter";
  if (month === 1 || month === 2) return "spring";
  if (month >= 3 && month <= 5) return "summer";
  return "monsoon";
};

const SavedProducts = () => {
  // --- 2. DETERMINE CURRENT THEME ---
  const currentKey = getSeason();
  const theme = SEASON_CONFIG[currentKey];
  const SeasonIcon = theme.icon; // Component for the main season icon

  const [savedItems, setSavedItems] = useState([
    {
      id: 1,
      name: "Organic Bananas",
      price: 40,
      image: "https://placehold.co/150?text=Bananas",
      inStock: true,
      unit: "1 Dozen"
    },
    {
      id: 2,
      name: "Fresh Whole Milk",
      price: 32,
      image: "https://placehold.co/150?text=Milk",
      inStock: true,
      unit: "1 Liter"
    },
    {
      id: 3,
      name: "Almonds Premium",
      price: 450,
      image: "https://placehold.co/150?text=Almonds",
      inStock: false,
      unit: "500g"
    }
  ]);

  const handleRemove = (id) => {
    setSavedItems(savedItems.filter(item => item.id !== id));
  };

  const handleAddToCart = (item) => {
    alert(`Added ${item.name} to cart!`);
  };

  return (
    // APPLY SEASONAL GRADIENT HERE
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-500 ${theme.gradient}`}>
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Heart className={`fill-current ${theme.primaryText}`} /> Saved Items
            <span className="text-sm font-normal text-gray-500 ml-2">({savedItems.length})</span>
            </h1>
            {/* Seasonal Badge */}
            <div className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${theme.accent} ${theme.accentText}`}>
                <SeasonIcon size={12} />
                {theme.name} Edition
            </div>
        </div>
        
        <button className={`text-sm font-semibold hover:underline flex items-center gap-1 ${theme.primaryText}`}>
            <ArrowLeft size={16} /> Continue Shopping
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        {savedItems.length === 0 ? (
          /* Empty State - Themed */
          <div className={`${theme.cardBg} backdrop-blur-sm rounded-2xl shadow-sm p-12 text-center border`}>
            <div className={`mx-auto w-20 h-20 ${theme.accent} rounded-full flex items-center justify-center mb-4`}>
              <Heart className={`w-10 h-10 ${theme.primaryText}`} />
            </div>
            <h3 className="text-xl font-bold text-gray-700">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Explore our {theme.name} collection and save your favorites.</p>
            <button className={`${theme.primary} text-white px-8 py-3 rounded-xl shadow-lg hover:opacity-90 transition flex items-center gap-2 mx-auto`}>
              {theme.offerIcon}
              Browse {theme.name} Deals
            </button>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 gap-4">
            {savedItems.map((item) => (
              <div key={item.id} className={`${theme.cardBg} p-4 rounded-xl shadow-sm flex gap-4 items-center border transition hover:shadow-md`}>
                
                {/* Product Image with Seasonal Tone */}
                <div className={`w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden ${theme.bannerTone}`}>
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                      <p className="text-gray-500 text-sm">{item.unit}</p>
                    </div>
                    <p className={`font-bold text-lg ${theme.primaryText}`}>₹{item.price}</p>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    {item.inStock ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">In Stock</span>
                    ) : (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">Out of Stock</span>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="mt-4 flex gap-3">
                    <button 
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.inStock}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm
                        ${item.inStock 
                          ? `${theme.primary} text-white hover:opacity-90` 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                    
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedProducts;