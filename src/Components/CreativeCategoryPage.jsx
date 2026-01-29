const STORE_ID = Number(import.meta.env.VITE_STORE_ID);
import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, ShoppingBag, Plus, Minus, ChevronRight, 
  Star, ArrowLeft, X,
  Snowflake, Sun, Flower2, CloudRain,Heart
} from "lucide-react";
import { useLocation,useNavigate} from "react-router-dom";
import API from "../api/auth.js";
import { addToCartAPI, removeCartItemAPI } from "../api/cartapi";
import { useCart } from "../context/CartContext";
import Footer from "./Footer.jsx";

import { SEASON_CONFIG, getSeason, SeasonalParticles} from './SEASON_CONFIG.jsx';



// --- 3. SUB-COMPONENTS ---

// A. Product Card
// const ProductCard = ({ data, cartQty, onAdd, onRemove, onClick, theme }) => {
//   const displayVariant = data.variants[0];
//   const discount = displayVariant.mrp > 0 ? Math.round(((displayVariant.mrp - displayVariant.price) / displayVariant.mrp) * 100) : 0;

//   return (
//     <div 
//       onClick={onClick} 
//       className={`group bg-white rounded-xl p-2 md:p-4 border border-transparent hover:${theme.border} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden cursor-pointer`}
//     >
//       {discount > 0 && (
//         <div className={`absolute top-0 left-0 ${theme.primary} text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-br-lg z-10`}>
//           {discount}% OFF
//         </div>
//       )}
//       <div className="relative w-full h-24 md:h-40 mb-2 md:mb-3 flex items-center justify-center overflow-hidden">
//         <img src={data.img} alt={data.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
//       </div>
//       <div className="flex flex-col flex-1">
//         <div className="flex items-center gap-1 mb-1">
//            {data.rating && (
//              <div className={`bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1`}>
//                 <Star size={8} className="text-gray-500 fill-gray-500" />
//                 <span className="text-[9px] md:text-[10px] font-bold text-gray-600">{data.rating}</span>
//              </div>
//            )}
//            {displayVariant.weight && (
//              <span className="text-[9px] md:text-[10px] text-gray-400 font-medium bg-gray-50 px-1.5 py-0.5 rounded">{displayVariant.weight}</span>
//            )}
//         </div>
//         <h3 className={`font-bold text-gray-800 text-xs md:text-sm line-clamp-2 leading-relaxed mb-1 group-hover:${theme.primaryText} transition-colors min-h-[2.5em]`}>
//           {data.name}
//         </h3>
//         <div className="mt-auto pt-2 md:pt-3 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0">
//           <div className="flex flex-col">
//             {displayVariant.mrp > displayVariant.price && (
//                 <span className="text-[9px] md:text-xs text-gray-400 line-through">₹{displayVariant.mrp}</span>
//             )}
//             <span className="text-sm md:text-base font-black text-gray-900">₹{displayVariant.price}</span>
//           </div>
//           {cartQty === 0 ? (
//             <button onClick={onAdd} className={`${theme.accent} border ${theme.border} ${theme.primaryText} hover:${theme.primary} hover:text-white text-xs font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-all active:scale-95 uppercase tracking-wide w-full md:w-auto`}>
//               Add
//             </button>
//           ) : (
//             <div className={`flex items-center ${theme.primary} rounded-lg h-7 md:h-9 shadow-md overflow-hidden w-full md:w-auto`}>
//                <button onClick={onRemove} className="flex-1 md:w-9 h-full flex items-center justify-center text-white hover:brightness-110 active:brightness-90 transition"><Minus size={14} /></button>
//                <span className="text-white text-xs md:text-sm font-bold min-w-[20px] text-center">{cartQty}</span>
//                <button onClick={onAdd} className="flex-1 md:w-9 h-full flex items-center justify-center text-white hover:brightness-110 active:brightness-90 transition"><Plus size={14} /></button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

const ProductCard = ({ data, theme, onAdd, onRemove, onClick }) => {
  const displayVariant = data?.variants?.[0] || {};
  const curstk = Number(displayVariant.current_stock) || 0;
  const isOutOfStock = curstk <= 0;

  // ✅ SAME AS HOME PAGE
  const [qty, setQty] = useState(0);

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    setQty((prev) => prev + 1);
    onAdd();
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (qty > 0) {
      setQty((prev) => prev - 1);
      onRemove();
    }
  };

  return (
    <div
      onClick={!isOutOfStock ? onClick : undefined}
      className={`bg-white rounded-xl p-3 shadow-sm border border-gray-100 transition-all group
      ${isOutOfStock ? "opacity-70" : "hover:shadow-lg cursor-pointer"}`}
    >
      {/* IMAGE */}
      <div className="relative h-28 md:h-36 bg-gray-50 rounded-lg mb-3 overflow-hidden">
        <img
          src={data.img}
          alt={data.name}
          className={`w-full h-full object-contain transition-transform duration-500
          ${isOutOfStock ? "blur-sm grayscale" : "group-hover:scale-110"}`}
        />

        {/* ❤️ HEART (MATCH HOME PAGE) */}
        {!isOutOfStock && (
          <button
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full shadow hover:text-red-500 transition"
          >
            <Heart size={14} />
          </button>
        )}

        {/* OUT OF STOCK */}
        {isOutOfStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs font-bold">
            OUT OF STOCK
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="space-y-1">
        <p className="text-[10px] text-gray-400 font-bold uppercase">
          {displayVariant.weight}
        </p>

        <h4 className="font-bold text-gray-800 text-sm line-clamp-2 min-h-[2.5em]">
          {data.name}
        </h4>

        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-black text-gray-900">
            ₹{displayVariant.price}
          </span>

          {/* ➕➖ SAME UX AS HOME */}
          {qty === 0 ? (
            <button
              disabled={isOutOfStock}
              onClick={handleIncrement}
              className={`${theme.accent} ${theme.primaryText} p-2 rounded-lg hover:scale-105 transition`}
            >
              <Plus size={16} strokeWidth={3} />
            </button>
          ) : (
            <div className={`flex items-center gap-1 ${theme.accent} rounded-lg px-1 py-1`}>
              <button
                onClick={handleDecrement}
                className="bg-white rounded p-0.5 shadow hover:scale-110 transition"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              <span className={`text-xs font-black w-4 text-center ${theme.primaryText}`}>
                {qty}
              </span>
              <button
                onClick={handleIncrement}
                className="bg-white rounded p-0.5 shadow hover:scale-110 transition"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// B. Product Details Modal
const ProductDetailsModal = ({ product, isOpen, onClose, onAdd, cartQty, theme }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  useEffect(() => {
    if(isOpen) setSelectedVariantIndex(0);
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const currentVariant = product.variants[selectedVariantIndex];
  const discount = currentVariant.mrp > 0 ? Math.round(((currentVariant.mrp - currentVariant.price) / currentVariant.mrp) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center pointer-events-auto">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full md:w-[480px] bg-gray-50 md:bg-white h-[90vh] md:h-auto md:max-h-[85vh] rounded-t-[30px] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="overflow-y-auto flex-1 pb-20 md:pb-6 scrollbar-hide">
            <div className="relative bg-white pb-6 rounded-b-[30px] shadow-sm z-10">
                <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-gray-100 hover:bg-gray-200 rounded-full">
                  <X size={20} />
                </button>
                {discount > 0 && (
                  <div className="absolute top-6 left-0 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-r-lg shadow-sm z-10">
                    {discount}% OFF
                  </div>
                )}
                <div className="h-64 flex items-center justify-center p-8 bg-white">
                  <img src={product.img} alt={product.name} className="max-w-full max-h-full object-contain drop-shadow-xl" />
                </div>
            </div>
            <div className="p-5 md:p-8 space-y-6">
              <div>
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h2>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                    {product.desc || "Fresh and high quality product sourced directly from farms."}
                  </p>
              </div>
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
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                ${isSelected ? 'border-yellow-400' : 'border-gray-300'}`}>
                                {isSelected && <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />}
                              </div>
                              <span className={`font-bold text-base ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                                {variant.weight || 'Standard'}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-gray-900">₹{variant.price}</span>
                              {variant.mrp > variant.price && <span className="text-xs text-gray-400 line-through ml-2">₹{variant.mrp}</span>}
                            </div>
                        </div>
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

// --- 4. MAIN PAGE COMPONENT ---
export default function CreativeCategoryPage() {
  const navigate = useNavigate();
  const { cartCount, incrementCartCount, decrementCartCount } = useCart();

  const [activeCategory, setActiveCategory] = useState("All");

  const [searchQuery, setSearchQuery] = useState("");
  const [currentSeason, setCurrentSeason] = useState("winter");
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [PRODUCTS, setProducts] = useState([]);

  const { state } = useLocation();
  const { id, name, img } = state || { id: 0, name: 'Category', img: '' };

  useEffect(() => {
    setCurrentSeason(getSeason());
  }, []);

  const fetchCategoryItems = async () => {
    try {
      const response = await API.post(
        "product/catitems",
        { cate_id: id,
          register_id: STORE_ID,
         }
      );
      const formatted = formatProducts(response.data.data);
      setProducts(formatted);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategoryItems();
  }, []);

  const formatProducts = (items) => {
    if(!items) return [];
    return items.map((item) => ({
      id: item.product_id,
      category: "General",
      name: item.title || "",
      rating: "4.5", // default mock
      img: item.image || "",
      desc: item.description || "",
      variants: [
        {
          weight: item.unit || "1 pc", 
          price: Number(item.price) || 0,
          mrp: Number(item.mrp) || 0,
          current_stock: Number(item.current_stock) || 0,
          
        }
      ]
    }));
  };

  const theme = SEASON_CONFIG[currentSeason];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      // Since buttons are removed, activeCategory is always "All"
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery, PRODUCTS]);

  const handleAddToCart = async (product_id) => {
  try {
    await addToCartAPI(product_id, 1);
    incrementCartCount(); // global
  } catch (err) {
    alert("Please login to add items");
  }
};

const handleRemoveFromCart = async (product_id) => {
  try {
    await removeCartItemAPI(product_id);
    decrementCartCount(); // global
  } catch (err) {
    console.error(err);
  }
};

  

  return (
    <div className={`min-h-screen ${theme.gradient} font-sans text-gray-800 transition-colors duration-700 relative flex flex-col`}>
      
      <SeasonalParticles season={currentSeason} />

      <ProductDetailsModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)}
       onAdd={() => handleAddToCart(selectedProduct.id)}
       

        cartQty={0}

        theme={theme}
      />

      {/* HEADER */}
      <header className={`sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b ${theme.border} flex-shrink-0`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full" onClick={() => window.history.back()}>
                <ArrowLeft size={20} />
            </button>
          
          </div>

          <div className="flex-1 max-w-xl relative group ml-2">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className={`w-full bg-gray-100 focus:bg-white border border-transparent focus:${theme.border} rounded-xl py-2 pl-10 pr-4 text-sm transition-all outline-none`}
            />
          </div>

          <div className="hidden md:flex items-center gap-6">
           <div
  onClick={() => navigate("/cart")}
  className={`flex items-center gap-2 cursor-pointer hover:${theme.primaryText} transition relative`}
>
  <ShoppingBag size={20} />
  <span className="font-medium text-sm">Cart</span>

  {cartCount > 0 && (
    <span
      className={`absolute -top-2 -right-2 w-5 h-5 ${theme.primary} text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce`}
    >
      {cartCount}
    </span>
  )}
</div>

          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto w-full md:px-6 md:py-6 h-[calc(100vh-64px)] md:h-auto relative z-10">
        
        {/* PRODUCT CONTENT */}
        <main className="w-full bg-white/40 md:bg-transparent h-full overflow-y-auto md:overflow-visible pb-32 md:pb-0 px-2 md:px-0 pt-4 md:pt-0 rounded-t-3xl md:rounded-none backdrop-blur-sm md:backdrop-blur-none">
          
          {/* Banner */}
          
          {/* FILTER BAR (Category buttons removed) */}
          <div className="flex justify-between items-center mb-4 px-1">
              <h2 className="font-bold text-gray-800 text-lg">All Products</h2>
              <span className="text-[10px] text-gray-500 font-bold bg-white px-2 py-0.5 rounded-full shadow-sm">{filteredProducts.length} Items</span>
          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 pb-24">
  {filteredProducts.length > 0 ? (
    filteredProducts.map((product) => (
      <ProductCard
        key={product.id}
        data={product}
        theme={theme}
        onAdd={() => handleAddToCart(product.id)}
        onRemove={() => handleRemoveFromCart(product.id)}
        onClick={() => setSelectedProduct(product)}
      />
    ))
  ) : (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
      <Search size={40} className="mb-2 opacity-20" />
      <p>No products found</p>
    </div>
  )}
</div>

        </main>
      </div>

      {/* FLOATING CART BAR */}
     {cartCount > 0 && (
  <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-300 md:hidden">
    <div className="bg-gray-900 text-white p-3 rounded-xl shadow-2xl flex items-center justify-between">
      <div className="flex flex-col pl-2">
        <span className="text-xs text-gray-400 font-medium">
          {cartCount} ITEMS
        </span>

    
      </div>

      <button 
      onClick={() => navigate("/cart")}
      className={`${theme.primary} text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors`}>
        View Cart <ChevronRight size={16} />
      </button>
    </div>
  </div>
)}
<Footer theme={theme} />
    </div>
  );
}