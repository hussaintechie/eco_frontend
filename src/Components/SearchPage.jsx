import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  X,
  Snowflake,
  Sun,
  Flower2,
  CloudRain,
  ShoppingBasket,
  Leaf,
} from "lucide-react";

import API from "../api/auth";
import { useLocation, useNavigate } from "react-router-dom";

import {
  addToCartAPI,
  getCartAPI,
  updateCartQtyAPI,
  removeCartItemAPI,
} from "../api/cartapi";
import { toast } from "react-toastify";

/* --- SEASONAL CONFIG --- */
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
  },
};

const getSeason = () => {
  const month = new Date().getMonth();
  if (month === 10 || month === 11 || month === 0) return "winter";
  if (month === 1 || month === 2) return "spring";
  if (month >= 3 && month <= 5) return "summer";
  return "monsoon";
};

const cleanSearchText = (text = "") => {
  return text.replace(/\s*--\s*\(.*?\)/g, "").trim();
};

export default function SearchPage() {
  const inputRef = useRef(null);

  const currentKey = getSeason();
  const theme = SEASON_CONFIG[currentKey];
  const SeasonIcon = theme.icon;

  const navigate = useNavigate();
  const location = useLocation();

  const name = location.state?.name || "";

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [popularTags, setPopularTags] = useState([]);

  const [cartItems, setCartItems] = useState([]);

  // ✅ Loading states
  const [searchLoading, setSearchLoading] = useState(false);
  const [cartLoadingId, setCartLoadingId] = useState(null);

  const cartCount = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  useEffect(() => {
    const clean = cleanSearchText(name);
    if (clean) setQuery(clean);
  }, [name]);

  const refreshCart = async () => {
    try {
      const res = await getCartAPI();
      setCartItems(res.data.cart || []);
    } catch (err) {
      console.log("refreshCart error:", err);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  /* ✅ SAME METHOD AS CATEGORY PAGE */
  const formatProducts = (items) => {
    if (!items) return [];
    return items.map((item) => ({
      id: item.product_id || item.id,
      category: item.category || "General",
      name: item.title || item.name || "",
      img: item.image || item.img || "",
      desc: item.description || item.desc || "",
      variants: [
        {
          weight: item.unit || "1 pc",
          price: Number(item.price) || 0,
          mrp: Number(item.mrp) || 0,
          current_stock: Number(item.current_stock) || 0,
        },
      ],
    }));
  };

  const fetchSearchData = async (mode = 1) => {
    const cleanQuery = cleanSearchText(query);

    try {
      setSearchLoading(true);

      const response = await API.post("product/SearchItems", {
        searchtxt: cleanQuery,
        mode: mode,
      });

      const formatted = formatProducts(response.data.data || []);
      setAllProducts(formatted);
      setPopularTags(response.data.popularTags || []);
    } catch (error) {
      console.error("Search fetch error:", error);
      setAllProducts([]);
      setPopularTags([]);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchData(2);
  }, []);

  useEffect(() => {
    if (query.trim().length >= 2) {
      fetchSearchData(1);
    } else {
      setAllProducts([]);
    }
  }, [query]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return (allProducts || []).filter(
      (p) =>
        p.name?.toLowerCase().includes(query.toLowerCase()) ||
        p.category?.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allProducts]);

  /* ---------------- CART ACTIONS (WITH LOADING) ---------------- */

  const handleAddToCart = async (product_id) => {
    if (cartLoadingId === product_id) return;

    try {
      setCartLoadingId(product_id);

      await addToCartAPI(product_id, 1);
      await refreshCart();
    } catch (err) {
      toast.error("Please login to add items");
      navigate("/login");
    } finally {
      setCartLoadingId(null);
    }
  };

  const handleRemoveFromCart = async (product_id) => {
    if (cartLoadingId === product_id) return;

    try {
      setCartLoadingId(product_id);

      const cartItem = cartItems.find((c) => c.product_id === product_id);
      if (!cartItem) return;

      const newQty = cartItem.quantity - 1;

      if (newQty <= 0) {
        await removeCartItemAPI(cartItem.cart_id);
      } else {
        await updateCartQtyAPI(cartItem.cart_id, newQty);
      }

      await refreshCart();
    } catch (err) {
      console.error(err);
    } finally {
      setCartLoadingId(null);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${theme.gradient}`}
    >
      {/* --- STICKY HEADER --- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-3 md:gap-8">
          {/* Logo */}
          <div
            className="hidden md:flex items-center gap-3 shrink-0 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div
              className={`p-2 rounded-xl ${theme.primary} text-white shadow-lg`}
            >
              <Leaf size={20} fill="currentColor" className="opacity-90" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-800 leading-tight">
                SBS <span className="text-[#009661]">GROCES</span>
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5">
                Fresh & Organic
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 relative group py-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search groceries..."
              className={`w-full pl-10 md:pl-12 pr-10 py-2.5 md:py-3 rounded-xl md:rounded-2xl border-none outline-none transition-all text-sm md:text-base
                ${
                  isFocused
                    ? "bg-white ring-2 ring-emerald-100 shadow-md"
                    : "bg-gray-100/80 hover:bg-gray-100"
                }
              `}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />

            <Search
              className={`absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 transition-colors ${
                isFocused ? "text-emerald-600" : "text-gray-400"
              }`}
            />

            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Cart Desktop */}
          <div className="hidden md:block shrink-0">
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#F0FFF4] text-[#009661] border border-emerald-100 hover:bg-emerald-100 transition-all font-bold text-sm"
            >
              <div className="relative">
                <ShoppingBasket size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#F0FFF4]">
                    {cartCount}
                  </span>
                )}
              </div>
              <span>My Cart</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {query ? (
          <div>
            {searchLoading && (
              <div className="mb-4 text-sm font-bold text-gray-400 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Searching...
              </div>
            )}

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {results.map((item) => {
                  const qty =
                    cartItems.find((c) => c.product_id === item.id)?.quantity ||
                    0;

                  const loading = cartLoadingId === item.id;

                  // ✅ STOCK FROM variants (IMPORTANT)
                  const displayVariant = item?.variants?.[0] || {};
                  const stock = Number(displayVariant.current_stock) || 0;
                  const isOutOfStock = stock <= 0;

                  return (
                    <div
                      key={item.id}
                      className={`bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-row sm:flex-col gap-4 sm:gap-0
                        ${isOutOfStock ? "opacity-70" : ""}
                      `}
                    >
                      {/* Image */}
                      <div className="relative w-24 h-24 sm:w-full sm:aspect-square shrink-0 rounded-xl md:rounded-2xl mb-0 sm:mb-4 overflow-hidden">
                        <img
                          src={item.img}
                          alt={item.name}
                          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500
                            ${isOutOfStock ? "blur-[1px] grayscale" : ""}
                          `}
                        />

                        {isOutOfStock && (
                          <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-bold">
                            OUT OF STOCK
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col justify-between flex-1 min-w-0 py-1 sm:py-0">
                        <div>
                          <h3 className="font-bold text-gray-800 text-sm md:text-base mb-0.5 truncate leading-tight">
                            {item.name}
                          </h3>

                          <p className="text-[10px] md:text-xs text-gray-400 mb-1 truncate">
                            {item.category}
                          </p>

                          {/* ✅ STOCK DISPLAY */}
                          <p
                            className={`text-[11px] font-bold ${
                              isOutOfStock
                                ? "text-red-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {isOutOfStock
                              ? "Out of stock"
                              : `In stock: ${stock}`}
                          </p>
                        </div>

                        <div className="flex justify-between items-center mt-auto">
                          <span className="text-base md:text-lg font-black text-gray-900">
                            ₹{displayVariant.price}
                          </span>

                          {/* Controls */}
                          <div className="shrink-0">
                            {qty === 0 ? (
                              <button
                                disabled={loading || isOutOfStock}
                                onClick={() => handleAddToCart(item.id)}
                                className={`px-4 md:px-5 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[11px] md:text-xs font-bold transition-colors flex items-center justify-center gap-2
                                  ${
                                    loading || isOutOfStock
                                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                                  }
                                `}
                              >
                                {loading ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  "ADD"
                                )}
                              </button>
                            ) : (
                              <div className="flex items-center gap-2 md:gap-3 bg-gray-100 rounded-lg md:rounded-xl px-1.5 md:px-2 py-1">
                                <button
                                  disabled={loading}
                                  onClick={() => handleRemoveFromCart(item.id)}
                                  className={`w-6 h-6 md:w-7 md:h-7 bg-white rounded-md md:rounded-lg shadow-sm font-bold text-emerald-600 text-sm
                                    ${
                                      loading
                                        ? "opacity-60 cursor-not-allowed"
                                        : ""
                                    }
                                  `}
                                >
                                  -
                                </button>

                                <span className="text-xs md:text-sm font-bold w-4 text-center">
                                  {loading ? "..." : qty}
                                </span>

                                <button
                                  disabled={loading || isOutOfStock}
                                  onClick={() => handleAddToCart(item.id)}
                                  className={`w-6 h-6 md:w-7 md:h-7 bg-white rounded-md md:rounded-lg shadow-sm font-bold text-emerald-600 text-sm
                                    ${
                                      loading || isOutOfStock
                                        ? "opacity-60 cursor-not-allowed"
                                        : ""
                                    }
                                  `}
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <SeasonIcon size={64} className="mx-auto mb-4 text-gray-200" />
                <p className="text-gray-400 font-medium">
                  No results found for "{query}"
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-20">
            Start typing to search products...
          </div>
        )}
      </main>

      {/* MOBILE CART */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-50 md:hidden">
          <button
            onClick={() => navigate("/cart")}
            className="w-full bg-gray-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <ShoppingBasket className="text-emerald-400" />
              <span className="font-bold">{cartCount} Items</span>
            </div>
            <span className="bg-emerald-600 px-4 py-1.5 rounded-xl text-sm font-bold uppercase tracking-wider">
              View Cart
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
