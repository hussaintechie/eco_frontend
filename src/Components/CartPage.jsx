import React, { useState } from 'react';
import { 
  Minus, 
  Plus, 
  Trash2, 
  ArrowRight, 
  ShoppingBag, 
  Snowflake, 
  Sun, 
  CloudRain, 
  Flower2, 
  MapPin,
  ChevronRight
} from 'lucide-react';

// --- 1. CONFIGURATION ---
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
  }
};

const getSeason = () => {
  const month = new Date().getMonth();
  if (month === 10 || month === 11 || month === 0) return "winter";
  if (month === 1 || month === 2) return "spring";
  if (month >= 3 && month <= 5) return "summer";
  return "monsoon";
};

// --- 2. MAIN COMPONENT ---
const CartPage = () => {
  const currentSeasonKey = getSeason();
  const theme = SEASON_CONFIG[currentSeasonKey];
  const SeasonIcon = theme.icon;

  // Mock Cart Data State
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Fresh Strawberries", weight: "500g", price: 120, qty: 1, img: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=150&q=80" },
    { id: 2, name: "Organic Avocados", weight: "2 pcs", price: 180, qty: 2, img: "https://images.unsplash.com/photo-1523049673856-42868928ae47?auto=format&fit=crop&w=150&q=80" },
    { id: 3, name: "Greek Yogurt", weight: "200g", price: 65, qty: 1, img: "https://images.unsplash.com/photo-1488477181946-6428a029177b?auto=format&fit=crop&w=150&q=80" },
  ]);

  // Handlers
  const updateQty = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Calculations
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // --- RENDER ---
  return (
    <div className={`min-h-screen ${theme.gradient} transition-colors duration-500 pb-32 md:pb-10 font-sans`}>
      
      {/* 1. Header */}
      <div className={`bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm border-b ${theme.border}`}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${theme.accent} ${theme.primaryText}`}>
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
                <h1 className="font-bold text-lg text-slate-800">My Cart</h1>
                <p className="text-xs text-slate-500">{cartItems.length} items</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-md ${theme.accent} border ${theme.border} flex items-center gap-1`}>
            <SeasonIcon className={`w-3 h-3 ${theme.primaryText}`} />
            <span className={`text-[10px] font-bold uppercase ${theme.primaryText}`}>{theme.name}</span>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="max-w-6xl mx-auto p-5 md:py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === LEFT COLUMN (Items & Address) === */}
        <div className="lg:col-span-2 space-y-5">
            
            {/* Delivery Address Snippet */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${theme.accent}`}>
                        <MapPin className={`w-5 h-5 ${theme.primaryText}`} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Delivering to</p>
                        <p className="text-sm font-bold text-slate-700">Home • 12/B Green Street</p>
                    </div>
                </div>
                <button className={`text-xs font-bold ${theme.primaryText} hover:underline`}>CHANGE</button>
            </div>

            {/* Cart Items List */}
            <div className="space-y-4">
            {cartItems.length === 0 ? (
                <div className="text-center py-12 opacity-60 bg-white rounded-2xl border border-dashed border-slate-300">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-slate-300"/>
                    <p className="font-medium text-slate-500">Your cart is empty</p>
                </div>
            ) : (
                cartItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 transition-transform hover:scale-[1.01]">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-slate-800 text-sm md:text-base">{item.name}</h3>
                            <button onClick={() => removeItem(item.id)} className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{item.weight}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-slate-800 text-lg">₹{item.price}</span>
                        
                        {/* Quantity Control */}
                        <div className={`flex items-center gap-3 px-2 py-1.5 rounded-lg ${theme.accent} border ${theme.border}`}>
                            <button onClick={() => updateQty(item.id, -1)} className={`p-1 bg-white rounded-md shadow-sm ${theme.primaryText} hover:bg-slate-50`}>
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold w-4 text-center text-slate-700">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} className={`p-1 ${theme.primary} text-white rounded-md shadow-sm hover:brightness-110`}>
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                    </div>
                </div>
                ))
            )}
            </div>
        </div>

        {/* === RIGHT COLUMN (Desktop Summary) === */}
        <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                <h3 className="font-bold text-slate-800 text-lg mb-6">Order Summary</h3>
                
                <div className="space-y-3 pb-6 border-b border-slate-100">
                    <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span className="font-medium">₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>Delivery</span>
                        <span className="text-green-600 font-medium">Free</span>
                    </div>
                </div>

                <div className="flex justify-between items-center py-4">
                    <span className="font-bold text-slate-800 text-lg">Total</span>
                    <span className="font-bold text-slate-800 text-2xl">₹{cartTotal}</span>
                </div>

                <button 
                    disabled={cartItems.length === 0}
                    className={`
                        w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95
                        ${cartItems.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : `${theme.bannerGradient} text-white shadow-indigo-200/50 hover:brightness-110`}
                    `}
                >
                    <span>Proceed to Checkout</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>

      {/* 3. Mobile Sticky Footer (Hidden on Large Screens) */}
      {cartItems.length > 0 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-5 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] rounded-t-3xl z-20">
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <p className="text-xs text-slate-500 font-medium uppercase">Subtotal</p>
                    <h2 className="text-2xl font-bold text-slate-800">₹{cartTotal}</h2>
                </div>
                <button className={`flex-1 ${theme.bannerGradient} text-white py-3.5 px-6 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200/50 flex items-center justify-center gap-2 active:scale-95 transition-transform`}>
                    <span>Proceed</span>
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
          </div>
      )}
    </div>
  );
};

export default CartPage;