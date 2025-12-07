import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, ShoppingBag, Plus, Minus, ChevronRight, 
  Home, User, Star, Filter, ArrowLeft, X, ChevronDown,
  Snowflake, Sun, Flower2, CloudRain
} from "lucide-react";

// --- 1. MOCK DATA ---
const CATEGORIES = [
  { id: "curd", name: "Curd & Yogurt", icon: "🥣" },
  { id: "paneer", name: "Paneer & Cream", icon: "🧀" },
  { id: "milk", name: "Fresh Milk", icon: "🥛" },
  { id: "butter", name: "Butter & Cheese", icon: "🧈" },
  { id: "bread", name: "Bread & Buns", icon: "🍞" },
  { id: "eggs", name: "Farm Eggs", icon: "🥚" },
];

const PRODUCTS = [
  { 
    id: 1, 
    category: "Butter & Cheese", 
    name: "Amul Pasteurized Butter", 
    rating: 4.8, 
    img: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=300&q=80",
    desc: "Amul Butter is a tasty spread for bread, a key ingredient in baking, and it makes food even tastier.",
    variants: [
        { weight: "100 g", price: 52, mrp: 58 },
        { weight: "500 g", price: 266, mrp: 295 }
    ]
  },
  { 
    id: 2, 
    category: "Curd & Yogurt", 
    name: "Creamy Fresh Curd", 
    rating: 4.8, 
    img: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=300&q=80",
    desc: "Thick and creamy curd made from pure pasteurized milk.",
    variants: [
        { weight: "200 g", price: 20, mrp: 25 },
        { weight: "400 g", price: 38, mrp: 45 }
    ]
  },
  { 
    id: 3, category: "Paneer & Cream", name: "Malai Paneer Cubes", rating: 4.5, img: "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=300&q=80", 
    desc: "Soft and fresh paneer cubes, perfect for curries and grills.",
    variants: [{ weight: "200 g", price: 204, mrp: 325 }] 
  },
  { 
    id: 4, category: "Farm Eggs", name: "White Farm Eggs", rating: 4.2, img: "https://images.unsplash.com/photo-1582722878654-02fd235dd7c2?auto=format&fit=crop&w=300&q=80", 
    desc: "High protein farm fresh eggs.",
    variants: [{ weight: "30 pcs", price: 225, mrp: 288 }] 
  },
  { 
    id: 5, category: "Butter & Cheese", name: "Cheddar Cheese Slice", rating: 4.6, img: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=300&q=80",
    desc: "Processed cheddar cheese slices for burgers and sandwiches.",
    variants: [{ weight: "200 g", price: 75, mrp: 90 }]
  },
  { 
    id: 6, category: "Paneer & Cream", name: "Heavy Whipping Cream", rating: 4.3, img: "https://images.unsplash.com/photo-1624536737505-14eb0e46f6f9?auto=format&fit=crop&w=300&q=80",
    desc: "Rich heavy cream for desserts and cooking.",
    variants: [{ weight: "200 ml", price: 36, mrp: 50 }]
  },
  { 
    id: 7, category: "Fresh Milk", name: "Full Cream Milk", rating: 4.7, img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80",
    desc: "Farm fresh full cream milk, pasteurized and homogenized.",
    variants: [{ weight: "1 L", price: 60, mrp: 70 }]
  },
  { 
    id: 8, category: "Curd & Yogurt", name: "Greek Yogurt Berry", rating: 4.8, img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80",
    desc: "High protein greek yogurt with real berry extracts.",
    variants: [{ weight: "150 g", price: 55, mrp: 70 }]
  },
];

// --- 2. SEASONAL CONFIG ---
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

// --- 3. PARTICLES COMPONENT ---
const SeasonalParticles = ({ season }) => {
  if (season === "winter") {
    return <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">{Array.from({length:15}).map((_,i)=><div key={i} className="absolute text-indigo-200/40 animate-fall" style={{left:`${Math.random()*100}%`,top:-20,fontSize:`${Math.random()*20+10}px`,animationDuration:`${Math.random()*5+5}s`}}>❄</div>)}<style>{`@keyframes fall {0%{transform:translateY(-20px) rotate(0deg);opacity:0}20%{opacity:0.8}100%{transform:translateY(100vh) rotate(360deg);opacity:0}}.animate-fall{animation:fall linear infinite}`}</style></div>;
  }
  if (season === "summer") {
    return <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden"><div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div></div>;
  }
  if (season === "monsoon") {
    return <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-900/5"></div>;
  }
  return null;
};

// --- 4. SUB-COMPONENTS ---

// A. Product Card
const ProductCard = ({ data, cartQty, onAdd, onRemove, onClick, theme }) => {
  const displayVariant = data.variants[0];
  const discount = Math.round(((displayVariant.mrp - displayVariant.price) / displayVariant.mrp) * 100);

  return (
    <div 
      onClick={onClick} 
      className={`group bg-white rounded-xl p-2 md:p-4 border border-transparent hover:${theme.border} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden cursor-pointer`}
    >
      <div className={`absolute top-0 left-0 ${theme.primary} text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-br-lg z-10`}>
        {discount}% OFF
      </div>
      <div className="relative w-full h-24 md:h-40 mb-2 md:mb-3 flex items-center justify-center overflow-hidden">
        <img src={data.img} alt={data.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-1">
           <div className={`bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1`}>
              <Star size={8} className="text-gray-500 fill-gray-500" />
              <span className="text-[9px] md:text-[10px] font-bold text-gray-600">{data.rating}</span>
           </div>
           <span className="text-[9px] md:text-[10px] text-gray-400 font-medium bg-gray-50 px-1.5 py-0.5 rounded">{displayVariant.weight}</span>
        </div>
        <h3 className={`font-bold text-gray-800 text-xs md:text-sm line-clamp-2 leading-relaxed mb-1 group-hover:${theme.primaryText} transition-colors min-h-[2.5em]`}>
          {data.name}
        </h3>
        <div className="mt-auto pt-2 md:pt-3 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0">
          <div className="flex flex-col">
            <span className="text-[9px] md:text-xs text-gray-400 line-through">₹{displayVariant.mrp}</span>
            <span className="text-sm md:text-base font-black text-gray-900">₹{displayVariant.price}</span>
          </div>
          {cartQty === 0 ? (
            <button onClick={onAdd} className={`${theme.accent} border ${theme.border} ${theme.primaryText} hover:${theme.primary} hover:text-white text-xs font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-all active:scale-95 uppercase tracking-wide w-full md:w-auto`}>
              Add
            </button>
          ) : (
            <div className={`flex items-center ${theme.primary} rounded-lg h-7 md:h-9 shadow-md overflow-hidden w-full md:w-auto`}>
               <button onClick={onRemove} className="flex-1 md:w-9 h-full flex items-center justify-center text-white hover:brightness-110 active:brightness-90 transition"><Minus size={14} /></button>
               <span className="text-white text-xs md:text-sm font-bold min-w-[20px] text-center">{cartQty}</span>
               <button onClick={onAdd} className="flex-1 md:w-9 h-full flex items-center justify-center text-white hover:brightness-110 active:brightness-90 transition"><Plus size={14} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// B. Product Details Modal (FIXED RESPONSIVE LAYOUT)
const ProductDetailsModal = ({ product, isOpen, onClose, onAdd, cartQty, theme }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  useEffect(() => {
    if(isOpen) setSelectedVariantIndex(0);
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const currentVariant = product.variants[selectedVariantIndex];
  const discount = Math.round(((currentVariant.mrp - currentVariant.price) / currentVariant.mrp) * 100);

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center pointer-events-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative w-full md:w-[480px] bg-gray-50 md:bg-white h-[90vh] md:h-auto md:max-h-[85vh] rounded-t-[30px] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* Scrollable Area */}
        <div className="overflow-y-auto flex-1 pb-20 md:pb-6 scrollbar-hide">
            
            {/* Header Image Section */}
            <div className="relative bg-white pb-6 rounded-b-[30px] shadow-sm z-10">
                <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-black/5 hover:bg-black/10 rounded-full md:hidden">
                  <X size={20} />
                </button>
                <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-gray-100 hover:bg-gray-200 rounded-full hidden md:block">
                  <X size={20} />
                </button>
                
                <div className="absolute top-6 left-0 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-r-lg shadow-sm z-10">
                  {discount}% OFF
                </div>

                <div className="h-64 flex items-center justify-center p-8 bg-white">
                  <img src={product.img} alt={product.name} className="max-w-full max-h-full object-contain drop-shadow-xl" />
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 md:p-8 space-y-6">
              
              {/* Title & Desc */}
              <div>
                  <div className="flex items-start justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h2>
                    <div className="border border-green-600 p-1 rounded ml-2">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                    {product.desc || "Fresh and high quality product sourced directly from farms."}
                  </p>
              </div>

              {/* Variants Selection */}
              <div>
                 <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Select Pack Size</p>
                 <div className="space-y-3">
                  {product.variants.map((variant, idx) => {
                    const isSelected = selectedVariantIndex === idx;
                    
                    return (
                      <div 
                        key={idx}
                        onClick={() => setSelectedVariantIndex(idx)}
                        className={`relative rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden
                          ${isSelected 
                            ? 'bg-white border-yellow-400 shadow-md ring-1 ring-yellow-400 ring-opacity-50' 
                            : 'bg-white border-transparent hover:border-gray-200 shadow-sm'}`}
                      >
                        {/* Top Row: Radio + Info + Price */}
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                ${isSelected ? 'border-yellow-400' : 'border-gray-300'}`}>
                                {isSelected && <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />}
                              </div>
                              <span className={`font-bold text-base ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                                {variant.weight}
                              </span>
                            </div>
                            
                            <div className="text-right">
                              <span className="text-lg font-bold text-gray-900">₹{variant.price}</span>
                              <span className="text-xs text-gray-400 line-through ml-2">₹{variant.mrp}</span>
                            </div>
                        </div>

                        {/* Bottom Row: Action Button (Only visible when selected) */}
                        {isSelected && (
                          <div className="bg-yellow-50/50 border-t border-yellow-100 p-3 flex justify-end animate-in fade-in slide-in-from-top-1 duration-200">
                             {cartQty === 0 ? (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); onAdd(); }}
                                  className="w-full md:w-auto bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-2"
                                >
                                  ADD TO CART
                                </button>
                              ) : (
                                <div className="w-full md:w-auto flex items-center justify-center bg-green-600 text-white rounded-lg px-6 py-2.5 gap-2 shadow-sm">
                                  <span className="font-bold text-sm">ITEM ADDED</span>
                                  <div className="bg-white/20 rounded-full p-0.5"><ChevronDown size={12}/></div>
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                 </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- 5. MAIN PAGE COMPONENT ---
export default function CreativeCategoryPage() {
  const [activeCategory, setActiveCategory] = useState("Curd & Yogurt");
  const [cart, setCart] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSeason, setCurrentSeason] = useState("winter");
  
  // State for selected product for modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setCurrentSeason(getSeason());
  }, []);

  const theme = SEASON_CONFIG[currentSeason];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory = p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const addToCart = (id) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id) => setCart(prev => {
    const newCount = (prev[id] || 0) - 1;
    if (newCount <= 0) { const { [id]: _, ...rest } = prev; return rest; }
    return { ...prev, [id]: newCount };
  });

  const cartTotal = useMemo(() => {
    let count = 0;
    let price = 0;
    Object.entries(cart).forEach(([id, qty]) => {
      const product = PRODUCTS.find(p => p.id === parseInt(id));
      if (product) { count += qty; price += product.variants[0].price * qty; }
    });
    return { count, price };
  }, [cart]);

  return (
    <div className={`min-h-screen ${theme.gradient} font-sans text-gray-800 transition-colors duration-700 relative flex flex-col`}>
      
      <SeasonalParticles season={currentSeason} />

      {/* Render Modal */}
      <ProductDetailsModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)}
        onAdd={() => addToCart(selectedProduct.id)}
        cartQty={selectedProduct ? (cart[selectedProduct.id] || 0) : 0}
        theme={theme}
      />

      {/* HEADER */}
      <header className={`sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b ${theme.border} flex-shrink-0`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20} /></button>
            <h1 className={`text-2xl font-black tracking-tight ${theme.primaryText} hidden md:block`}>
              FRESH<span className="text-gray-800">MART.</span>
            </h1>
             <span className="md:hidden font-bold text-lg text-gray-800 truncate">Dairy & Breakfast</span>
          </div>

          <div className="flex-1 max-w-xl relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className={`w-full bg-gray-100 focus:bg-white border border-transparent focus:${theme.border} rounded-xl py-2.5 pl-10 pr-4 text-sm transition-all outline-none`}
            />
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className={`flex items-center gap-2 cursor-pointer hover:${theme.primaryText} transition`}>
              <User size={20} /> <span className="font-medium text-sm">Account</span>
            </div>
            <div className={`flex items-center gap-2 cursor-pointer hover:${theme.primaryText} transition relative`}>
              <ShoppingBag size={20} /> <span className="font-medium text-sm">Cart</span>
              {cartTotal.count > 0 && (
                <span className={`absolute -top-2 -right-2 w-5 h-5 ${theme.primary} text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce`}>
                  {cartTotal.count}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto w-full md:px-6 md:py-6 flex flex-row md:gap-6 h-[calc(100vh-64px)] md:h-auto relative z-10 overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className="w-[85px] md:w-64 flex-shrink-0 bg-white/60 backdrop-blur md:bg-white md:rounded-2xl md:border md:border-white/50 md:shadow-sm h-full overflow-y-auto md:h-fit md:sticky md:top-24 scrollbar-hide border-r border-gray-100/50 md:border-r-0">
           <div className={`hidden md:block p-4 border-b ${theme.border}`}>
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Filter size={16} /> Categories
              </h3>
           </div>
           <div className="flex flex-col pb-24 md:pb-0">
             {CATEGORIES.map((cat) => (
               <button
                 key={cat.id}
                 onClick={() => setActiveCategory(cat.name)}
                 className={`
                   group flex flex-col md:flex-row items-center md:gap-3 p-3 md:px-5 md:py-4 transition-all relative border-b md:border-b-0 ${theme.border}
                   ${activeCategory === cat.name 
                     ? `${theme.accent} ${theme.primaryText} border-r-4 ${theme.border.replace('border-', 'border-r-')}`.replace('border-orange-100', 'border-orange-600').replace('border-indigo-100', 'border-indigo-600').replace('border-emerald-100', 'border-emerald-600').replace('border-teal-100', 'border-teal-600')
                     : "text-gray-500 hover:bg-white/50 hover:text-gray-800"}
                 `}
               >
                 <span className={`text-2xl md:text-xl transition-transform group-hover:scale-110 ${activeCategory === cat.name ? 'scale-110' : 'grayscale opacity-70'}`}>{cat.icon}</span>
                 <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0 text-center md:text-left leading-tight line-clamp-2 md:line-clamp-1">{cat.name}</span>
                 {activeCategory === cat.name && <ChevronRight size={16} className={`hidden md:block ml-auto ${theme.primaryText}`} />}
               </button>
             ))}
           </div>
        </aside>

        {/* PRODUCT CONTENT */}
        <main className="flex-1 bg-white/40 md:bg-transparent h-full overflow-y-auto md:overflow-visible pb-32 md:pb-0 px-2 md:px-0 pt-4 md:pt-0 rounded-t-3xl md:rounded-none backdrop-blur-sm md:backdrop-blur-none">
          
          <div className="hidden md:flex justify-between items-end mb-6">
             <div>
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">Home <ChevronRight size={10}/> Dairy <ChevronRight size={10}/> {activeCategory}</p>
                <h2 className="text-2xl font-bold text-gray-800">{activeCategory}</h2>
             </div>
             <div className="flex items-center gap-2 text-xs font-bold bg-white px-3 py-1 rounded-full shadow-sm">
                {theme.icon && <theme.icon size={14} className={theme.primaryText}/>}
                <span className="uppercase text-gray-500">{theme.name} Mode</span>
             </div>
          </div>

          <div className="md:hidden flex justify-between items-center mb-4 px-1 sticky top-0 bg-white/5 backdrop-blur-sm py-2 z-10">
              <h2 className="font-bold text-gray-800 text-base">{activeCategory}</h2>
              <span className="text-[10px] text-gray-500 font-bold bg-white px-2 py-0.5 rounded-full">{filteredProducts.length} Items</span>
          </div>

          {/* Banner */}
          <div className={`relative w-full h-24 md:h-48 rounded-xl md:rounded-2xl overflow-hidden mb-4 md:mb-6 ${theme.bannerGradient} shadow-md flex-shrink-0`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-10 text-white z-10">
                 <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 md:mb-2 inline-block border border-white/30">
                   {currentSeason} Special
                 </span>
                 <h3 className="text-lg md:text-3xl font-black leading-tight">Fresh from Farm <br/> to Your Table</h3>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 md:w-40 md:h-40 bg-white/20 rounded-full blur-2xl"></div>
          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6 pb-24">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                data={product} 
                cartQty={cart[product.id] || 0}
                onClick={() => setSelectedProduct(product)}
                onAdd={(e) => { e.stopPropagation(); addToCart(product.id); }}
                onRemove={(e) => { e.stopPropagation(); removeFromCart(product.id); }}
                theme={theme}
              />
            ))}
          </div>
        </main>
      </div>

      {/* FLOATING CART BAR */}
      {cartTotal.count > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden animate-in slide-in-from-bottom duration-300">
           <div className="bg-gray-900 text-white p-3 rounded-xl shadow-2xl flex items-center justify-between">
              <div className="flex flex-col pl-2">
                 <span className="text-xs text-gray-400 font-medium">{cartTotal.count} ITEMS</span>
                 <span className="text-lg font-bold">₹{cartTotal.price}</span>
              </div>
              <button className={`${theme.primary} text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors`}>
                  View Cart <ChevronRight size={16} />
              </button>
           </div>
        </div>
      )}
    </div>
  );
}