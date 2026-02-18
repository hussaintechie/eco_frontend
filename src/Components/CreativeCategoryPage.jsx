const STORE_ID = Number(import.meta.env.VITE_STORE_ID);
import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  ChevronRight,
  ArrowLeft,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/auth.js";

import { useCart } from "../context/CartContext";
import Footer from "./Footer.jsx";
import {
  addToCartAPI,
  getCartAPI,
  updateCartQtyAPI,
  removeCartItemAPI,
} from "../api/cartapi";
import { toast } from "react-toastify";
import {
  SEASON_CONFIG,
  getSeason,
  SeasonalParticles,
} from "./SEASON_CONFIG.jsx";

/* ---------------- PRODUCT CARD ---------------- */

const ProductCard = ({
  data,
  theme,
  qty,
  loading,
  onAdd,
  onRemove,
  onClick,
}) => {
  const displayVariant = data?.variants?.[0] || {};
  const curstk = Number(displayVariant.current_stock) || 0;
  const isOutOfStock = curstk <= 0;

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (isOutOfStock || loading) return;
    onAdd(data.id);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (loading) return;
    if (qty > 0) onRemove(data.id);
  };

  return (
    <div
      onClick={!isOutOfStock ? onClick : undefined}
      className={`bg-white rounded-xl p-3 shadow-sm border border-gray-100 transition-all group
      ${isOutOfStock ? "opacity-70" : "hover:shadow-lg cursor-pointer"}`}
    >
      {/* IMAGE */}
      <div className="relative h-28 md:h-36 rounded-lg mb-3 overflow-hidden">
        <img
          src={data.img}
          alt={data.name}
          className={`w-full h-full object-contain transition-transform duration-500
          ${isOutOfStock ? "blur-sm grayscale" : "group-hover:scale-110"}`}
        />

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
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-gray-900">
              ₹{displayVariant.price}
            </span>
            {displayVariant.mrp > displayVariant.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{displayVariant.mrp}
              </span>
            )}
          </div>

          {/* ADD / QTY */}
          {qty === 0 ? (
            <button
              disabled={isOutOfStock || loading}
              onClick={handleIncrement}
              className={`p-2 rounded-lg transition flex items-center justify-center
                ${
                  isOutOfStock || loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : `${theme.accent} ${theme.primaryText} hover:scale-105`
                }
              `}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus size={16} strokeWidth={3} />
              )}
            </button>
          ) : (
            <div
              className={`flex items-center gap-1 ${theme.accent} rounded-lg px-1 py-1`}
            >
              <button
                disabled={loading}
                onClick={handleDecrement}
                className={`bg-white rounded p-0.5 shadow transition ${
                  loading ? "opacity-60 cursor-not-allowed" : "hover:scale-110"
                }`}
              >
                <Minus size={14} strokeWidth={3} />
              </button>

              <span
                className={`text-xs font-black w-4 text-center ${theme.primaryText}`}
              >
                {loading ? "..." : qty}
              </span>

              <button
                disabled={loading}
                onClick={handleIncrement}
                className={`bg-white rounded p-0.5 shadow transition ${
                  loading ? "opacity-60 cursor-not-allowed" : "hover:scale-110"
                }`}
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

/* ---------------- PRODUCT DETAILS MODAL ---------------- */

const ProductDetailsModal = ({
  product,
  isOpen,
  onClose,
  onAdd,
  cartQty,
  theme,
}) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  useEffect(() => {
    if (isOpen) setSelectedVariantIndex(0);
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const currentVariant = product.variants[selectedVariantIndex];
  const discount =
    currentVariant.mrp > 0
      ? Math.round(
          ((currentVariant.mrp - currentVariant.price) / currentVariant.mrp) *
            100,
        )
      : 0;

  return (
    
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center pointer-events-auto">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative w-full md:w-[480px] bg-gray-50 md:bg-white h-[90vh] md:h-auto md:max-h-[85vh] rounded-t-[30px] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="overflow-y-auto flex-1 pb-20 md:pb-6 scrollbar-hide">
          <div className="relative bg-white pb-6 rounded-b-[30px] shadow-sm z-10">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
            >
              <X size={20} />
            </button>

            {discount > 0 && (
              <div className="absolute top-6 left-0 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-r-lg shadow-sm z-10">
                {discount}% OFF
              </div>
            )}

            <div className="h-64 flex items-center justify-center p-8 bg-white">
              <img
                src={product.img}
                alt={product.name}
                className="max-w-full max-h-full object-contain drop-shadow-xl"
              />
            </div>
          </div>

          <div className="p-5 md:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h2>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                {product.desc ||
                  "Fresh and high quality product sourced directly from farms."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- MAIN PAGE ---------------- */

export default function CreativeCategoryPage() {
  const [cartItems, setCartItems] = useState([]);
  const cartCount = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );

  // ✅ loading states
  const [pageLoading, setPageLoading] = useState(true);
  const [cartLoadingId, setCartLoadingId] = useState(null);

  const navigate = useNavigate();
  const { incrementCartCount, decrementCartCount } = useCart(); // optional

  const [searchQuery, setSearchQuery] = useState("");
  const [currentSeason, setCurrentSeason] = useState("winter");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [PRODUCTS, setProducts] = useState([]);

  // const { state } = useLocation();
  // const { id } = state || { id: 0 };
  const location = useLocation();
  const id = location?.state?.id;

  useEffect(() => {
    if (!id) {
      navigate("/home");
      return;
    }
    fetchCategoryItems();
  }, [id]);

  useEffect(() => {
    setCurrentSeason(getSeason());
  }, []);

  const theme = SEASON_CONFIG[currentSeason];

  const refreshCart = async () => {
    try {
      const res = await getCartAPI();
      setCartItems(res.data.cart || []);
    } catch (err) {
      console.log("refreshCart error", err);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const formatProducts = (items) => {
    if (!items) return [];
    return items.map((item) => ({
      id: item.product_id,
      category: "General",
      name: item.title || "",
      img: item.image || "",
      desc: item.description || "",
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

  const fetchCategoryItems = async () => {
    try {
      setPageLoading(true);

      const response = await API.post("product/catitems", {
        cate_id: id,
        register_id: STORE_ID,
      });

      const formatted = formatProducts(response.data.data);
      setProducts(formatted);
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryItems();
  }, []);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, PRODUCTS]);

  /* ------------ CART ACTIONS (WITH LOADING) ------------ */

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
      className={`min-h-screen ${theme.gradient} font-sans text-gray-800 transition-colors duration-700 relative flex flex-col`}
    >
       {pageLoading && (
      <div className="fixed inset-0 z-[999] bg-white/70 backdrop-blur-sm flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-300  rounded-full animate-spin"></div>
      </div>
    )}
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
      <header
        className={`sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b ${theme.border} flex-shrink-0`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full"
              onClick={() => window.history.back()}
            >
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
        <main className="w-full bg-white/40 md:bg-transparent h-full overflow-y-auto md:overflow-visible pb-32 md:pb-0 px-2 md:px-0 pt-4 md:pt-0 rounded-t-3xl md:rounded-none backdrop-blur-sm md:backdrop-blur-none">
          <div className="flex justify-between items-center mb-4 px-1">
            <h2 className="font-bold text-gray-800 text-lg">All Products</h2>
            <span className="text-[10px] text-gray-500 font-bold bg-white px-2 py-0.5 rounded-full shadow-sm">
              {filteredProducts.length} Items
            </span>
          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 pb-24">
            {pageLoading ? (
              [...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
                >
                  <div className="h-28 md:h-36 rounded-lg bg-gray-200 animate-pulse mb-3" />
                  <div className="h-3 w-16 bg-gray-200 animate-pulse rounded mb-2" />
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded mb-2" />
                  <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded" />
                </div>
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  data={product}
                  theme={theme}
                  qty={
                    cartItems.find((c) => c.product_id === product.id)
                      ?.quantity || 0
                  }
                  loading={cartLoadingId === product.id}
                  onAdd={handleAddToCart}
                  onRemove={handleRemoveFromCart}
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
              className={`${theme.primary} text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors`}
            >
              View Cart <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <Footer theme={theme} />
    </div>
  );
}
