const STORE_ID = Number(import.meta.env.VITE_STORE_ID);
import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingBasket,
  Star,
  Leaf,
  Apple,
  Carrot,
  Citrus,
  Salad,
  Menu,
  Heart,
  Phone,
  ChevronDown,
  MapPin,
  Search,
  Home,
  ShoppingBag,
  User,
  Snowflake,
  Sun,
  Flower2,
  Flame,
  ArrowRight,
  Plus,
  Minus,
  Clock,
  X,
  CloudRain,
  Gift,
  CreditCard,
  Tag,
  Thermometer,
  Percent,
  Zap,
  Truck,
  CheckCircle2,
  Bell,
  AlertCircle,
  Package,
  Route,
  Repeat,
  Store,
 
} from "lucide-react";
import API from "../api/auth";
import { useNavigate, BrowserRouter } from "react-router-dom";
import {
  SEASON_CONFIG,
  getSeason,
  SeasonalParticles,
} from "../SEASON_CONFIG.jsx";
import {
  addToCartAPI,
  getCartAPI,
  updateCartQtyAPI,
  removeCartItemAPI,
} from "../api/cartapi";

import { toast } from "react-toastify";

import { useCart } from "../context/CartContext.jsx";
import Footer from "./Footer.jsx";
import { FaLeaf } from "react-icons/fa";

const NOTIFICATIONS = [
  {
    id: 1,
    type: "order",
    title: "Order Delivered",
    msg: "Your order #12345 has been delivered successfully.",
    time: "2 mins ago",
    icon: Package,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    id: 2,
    type: "offer",
    title: "50% Off on Fruits",
    msg: "Flash sale is live! Get fresh apples at half price.",
    time: "1 hour ago",
    icon: Percent,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    id: 3,
    type: "system",
    title: "Wallet Updated",
    msg: "₹50 cashback added to your SB Wallet.",
    time: "Yesterday",
    icon: CreditCard,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: 4,
    type: "alert",
    title: "Rain Alert",
    msg: "Deliveries might be slightly delayed due to rain.",
    time: "Yesterday",
    icon: CloudRain,
    color: "text-gray-600",
    bg: "bg-gray-100",
  },
];

// --- SUB-COMPONENTS ---

const SectionHeader = ({ title, action = "See All", icon: Icon, theme }) => (
  <div className="flex justify-between items-end px-1 mb-4">
    <h3 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
      {Icon && <Icon size={20} className={theme.primaryText} />}
      {title}
    </h3>
    <span
      className={`${theme.primaryText} text-xs font-bold cursor-pointer hover:underline flex items-center gap-1`}
    >
      {/* {action} <ChevronDown className="-rotate-90" size={14} /> */}
    </span>
  </div>
);

const ProductCardVertical = ({
  product,
  theme,
  qty,  // ✅ coming from parent
  onAddToCart,
  onRemoveFromCart,
}) => {
  const curstk = Number(product?.current_stock) || 0;
  const isOutOfStock = curstk <= 0;

  const handleIncrement = () => {
    if (isOutOfStock) return;
    onAddToCart(product.product_id);
  };

  const handleDecrement = () => {
    if (qty > 0) {
      onRemoveFromCart(product.product_id);
    }
  };


  return (
    <div
      className={`min-w-[150px] md:min-w-[180px] bg-white rounded-xl p-3 shadow-sm border border-gray-100 
      ${isOutOfStock ? "opacity-70" : "hover:shadow-lg"} transition-all group`}
    >
      {/* IMAGE */}
      <div className="h-28 md:h-36 bg-gray-50 rounded-lg mb-3 relative overflow-hidden">
        <img
          src={product.img}
          alt={product.name}
          className={`w-full h-full object-cover mix-blend-multiply transition-transform duration-500
          ${isOutOfStock ? "blur-sm grayscale" : "group-hover:scale-110"}`}
        />

        {/* DISCOUNT */}
        {product.discount && !isOutOfStock && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
            {product.discount} OFF
          </span>
        )}

        {/* OUT OF STOCK BADGE */}
        {isOutOfStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs font-bold">
            OUT OF STOCK
          </span>
        )}

        {/* WISHLIST */}
        {/* {!isOutOfStock && (
          <button className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:text-red-500">
            <Heart size={14} />
          </button>
        )} */}
      </div>

      {/* CONTENT */}
      <div className="space-y-1">
        <p className="text-[10px] text-gray-400 font-bold uppercase">
          {product.weight}
        </p>

        <h4 className="font-bold text-gray-800 text-sm line-clamp-2 h-10">
          {product.name}
        </h4>

        <div className="flex justify-between items-center mt-2">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 line-through">
              ₹{product.oldPrice}
            </span>
            <span className="text-sm font-black text-gray-900">
              ₹{product.price}
            </span>
          </div>

          {/* ADD / MINUS CONTROLS */}
          {qty === 0 ? (
            <button
              disabled={isOutOfStock}
              onClick={handleIncrement}
              className={`p-2 rounded-lg transition
                ${
                  isOutOfStock
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : `${theme.accent} ${theme.primaryText} hover:scale-105`
                }
              `}
            >
              <Plus size={16} strokeWidth={3} />
            </button>
          ) : (
            <div
              className={`flex items-center gap-1.5 ${theme.accent} rounded-lg px-1 py-1`}
            >
              <button
                onClick={handleDecrement}
                className="bg-white rounded p-0.5 shadow-sm text-gray-800 hover:scale-110 transition"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              <span
                className={`text-xs font-black w-4 text-center ${theme.primaryText}`}
              >
                {qty}
              </span>
              <button
                onClick={handleIncrement}
                className="bg-white rounded p-0.5 shadow-sm text-gray-800 hover:scale-110 transition"
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

// New Component for Recommended Grid Items to handle state
const RecommendedProductCard = ({
  prod,
  idx,
  theme,
  onAddToCart,
  onRemoveFromCart,
}) => {
  const curstk = Number(prod?.m) || 0;
  const isOutOfStock = curstk <= 0;
  const [qty, setQty] = useState(0);

  const handleIncrement = () => {
    if (isOutOfStock) return;
    setQty((prev) => prev + 1);
    onAddToCart(prod.product_id);
  };

  const handleDecrement = () => {
    if (qty > 0) {
      setQty((prev) => prev - 1);
      onRemoveFromCart(prod.product_id);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl p-3 shadow-sm border border-gray-100 transition-all duration-300 group
      ${isOutOfStock ? "opacity-70" : "hover:shadow-xl hover:-translate-y-1"}`}
    >
      {/* IMAGE */}
      <div className="relative h-32 md:h-40 mb-3 rounded-xl overflow-hidden bg-gray-50">
        
        {/* 🔥 FIXED IMAGE LOADING FOR PRODUCTS 🔥 */}
       

        {/* WISHLIST */}
        {/* {!isOutOfStock && (
          <button className="absolute top-2 right-2 bg-white/80 backdrop-blur p-1.5 rounded-full text-gray-400 hover:text-red-500 transition shadow-sm">
            <Heart size={14} />
          </button>
        )} */}

        {/* ORGANIC */}
        {idx % 3 === 0 && !isOutOfStock && (
          <span className="absolute bottom-0 left-0 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-tr-lg">
            ORGANIC
          </span>
        )}

        {/* OUT OF STOCK OVERLAY */}
        {isOutOfStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs font-bold tracking-widest">
            OUT OF STOCK
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="space-y-1">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          {prod.weight}
        </p>

        <h4 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2 min-h-[2.5em]">
          {prod.name}
        </h4>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-black text-gray-900">
            ₹{prod.price}
          </span>
          <span className="text-xs text-gray-400 line-through">
            ₹{prod.oldPrice}
          </span>
        </div>

        {/* ADD TO CART / QUANTITY CONTROLS */}
        {qty === 0 ? (
          <button
            disabled={isOutOfStock}
            onClick={handleIncrement}
            className={`w-full mt-3 py-2 rounded-xl text-xs font-bold border transition-colors
            ${
              isOutOfStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : `${theme.cardBg.replace(
                    "bg-white/80",
                    "bg-transparent"
                  )} ${theme.primaryText} hover:${
                    theme.primary
                  } hover:text-white`
            }
          flex items-center justify-center gap-2`}
          >
            {isOutOfStock ? "OUT OF STOCK" : "ADD"}
            {!isOutOfStock && <Plus size={14} strokeWidth={3} />}
          </button>
        ) : (
          <div className="w-full mt-3 flex items-center justify-between bg-gray-100 rounded-xl p-1">
            <button
              onClick={handleDecrement}
              className="p-1.5 bg-white rounded-lg shadow-sm text-gray-800 hover:text-red-600"
            >
              <Minus size={16} strokeWidth={3} />
            </button>
            <span className="font-black text-sm text-gray-800">{qty}</span>
            <button
              onClick={handleIncrement}
              className="p-1.5 bg-white rounded-lg shadow-sm text-gray-800 hover:text-green-600"
            >
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const HorizontalScrollRow = ({
  data,
  theme,
  cartItems =[],
  onAddToCart,
  onRemoveFromCart,
}) => (
  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 pl-1 scroll-smooth">
    {data.map((item, i) => (
      <ProductCardVertical
        key={i}
        product={item}
        theme={theme}
        qty={cartItems.find((c) => c.product_id === item.product_id)?.quantity || 0}
        onAddToCart={onAddToCart}
        onRemoveFromCart={onRemoveFromCart}
      />
    ))}

    {/* View All inside same return ✅ */}
    {/* <div className="min-w-[100px] flex flex-col items-center justify-center text-gray-400 cursor-pointer group">
      <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center transition">
        <ArrowRight size={20} />
      </div>
      <span className="text-xs font-bold mt-2">View All</span>
    </div> */}
  </div>
);


const NotificationDrawer = ({ isOpen, onClose, theme }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] md:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className={`p-4 border-b border-gray-100 flex justify-between items-center ${theme.gradient}`}
        >
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Bell size={20} className={theme.primaryText} fill="currentColor" />{" "}
            Notifications
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-white/50 rounded-full hover:bg-white transition"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="overflow-y-auto h-full pb-20 p-4 space-y-3">
          {NOTIFICATIONS.map((notif) => (
            <div
              key={notif.id}
              className="flex gap-3 p-3 bg-gray-50/50 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors cursor-pointer group"
            >
              <div
                className={`w-10 h-10 rounded-full ${notif.bg} ${notif.color} flex items-center justify-center shrink-0`}
              >
                <notif.icon size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-800 text-sm group-hover:text-black">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {notif.time}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {notif.msg}
                </p>
              </div>
              {notif.type === "order" && (
                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5"></div>
              )}
            </div>
          ))}
          <div className="text-center pt-4">
            <button
              className={`text-xs font-bold ${theme.primaryText} hover:underline`}
            >
              View All History
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// --- AD TEMPLATES ---
const BANNER_IMAGES = [
  {
    desktop: "https://res.cloudinary.com/duzladayx/image/upload/v1769343614/banner5_kkye4k.png",
    mobile: "https://res.cloudinary.com/duzladayx/image/upload/v1769343614/banner5_kkye4k.png",
  },
  {
    desktop: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    mobile: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
  },
  
];





const ParallaxAdBanner = ({ theme }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // ✅ Detect screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Auto slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="
        w-full
        
       aspect-[16/8]
        md:aspect-[32/8]

        rounded-2xl
        overflow-hidden
        relative
        mb-8 md:mb-12
        group
        cursor-pointer
        shadow-lg
        bg-gray-900
      "
    >
      {/* SLIDESHOW IMAGES */}
      <div className="absolute inset-0 w-full h-full">
        {BANNER_IMAGES.map((img, index) => (
          <img
            key={index}
            src={isMobile ? img.mobile : img.desktop}
            className={`absolute inset-0 w-full h-full object-cover
              transition-all duration-[2000ms] ease-in-out
              ${index === currentImage ? "opacity-60" : "opacity-0"}
              group-hover:scale-105
            `}
            alt={`Banner ${index + 1}`}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ))}
      </div>
<div className="absolute inset-0 flex flex-col justify-center items-start p-3 md:p-12 z-10">
        <span className="hidden md:inline-block bg-yellow-400 text-black text-xs font-black px-1 py-1 rounded mb-2 uppercase tracking-wider">
  Market Day Special
</span>

        <h3 className="text-2xl md:text-5xl font-black text-white mb-2 leading-none drop-shadow-lg">
          Fresh from <br /> the Farm
        </h3>
        <p className="text-gray-200 text-xs md:text-base mb-6 max-w-[200px] md:max-w-md drop-shadow-md hidden md:block">
    Get 100% organic vegetables delivered directly from local farmers.
  </p>
       <button className="bg-white text-gray-900 text-sm md:text-base font-bold py-2 px-5 md:py-3 md:px-8 rounded-full hover:bg-gray-100 transition shadow-xl flex items-center gap-2">
    Shop Now <ArrowRight size={14} className="md:w-4 md:h-4" />
  </button>
      </div>

      {/* DOT INDICATORS */}
      <div className="absolute bottom-2 md:bottom-3 left-0 right-0 flex justify-center gap-2 z-20">
        {BANNER_IMAGES.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
              index === currentImage
                ? "w-6 bg-white"
                : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const Header = ({ theme, setMenuOpen, onOpenNotifications, cartCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navigate = useNavigate();
  return (
    <header
      className={`sticky top-0 z-50 w-full font-sans transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl shadow-md py-1"
          : "bg-transparent py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* TOP ROW: Logo + Actions */}
        <div className="flex items-center justify-between gap-4 py-2">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-xl ${theme.primary} text-white shadow-lg shadow-${theme.primary}/30`}
            >
             <FaLeaf className="text-white -rotate-12" size={22} />
            </div>
            <div className="flex flex-col">
              <h1
                className={`text-xl md:text-2xl font-black tracking-tighter text-gray-800 leading-none`}
              >
                SBS<span className={theme.primaryText}> GROCES</span>
              </h1>
              <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase hidden md:block">
                Fresh & Organic
              </span>
            </div>
          </div>

          {/* Desktop Search (Centered) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-auto relative group"  onClick={() => navigate("/search")}>
            <input
              type="text"
              placeholder="Search for fresh groceries..."
              className={`w-full bg-gray-100/50 border-2 border-transparent hover:bg-white hover:border-gray-100 focus:bg-white focus:border-${theme.primary.replace(
                "bg-",
                ""
              )}/30 focus:ring-4 focus:ring-${theme.primary.replace(
                "bg-",
                ""
              )}/10 text-gray-800 text-sm rounded-full py-2.5 px-5 pl-12 transition-all duration-300 outline-none`}
            />
            <Search
              size={18}
              className="absolute left-4 top-3 text-gray-400 group-hover:text-gray-600 transition-colors"
            />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3 md:gap-5">
            <div
              onClick={onOpenNotifications}
              className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition group"
            ></div>

            {/* Desktop Cart */}
            <div
              onClick={() => navigate("/cart")}
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full ${theme.accent} ${theme.accentText} cursor-pointer hover:shadow-lg hover:scale-105 transition-all`}
            >
              <div className="relative">
                <ShoppingBasket size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>

              <span className="text-xs font-bold">My Cart</span>
            </div>

            {/* Profile Icon */}
            <div
              onClick={() => navigate("/profile")}
              className="hidden md:block p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 cursor-pointer transition"
            >
              <User size={20} />
            </div>
          </div>
        </div>

        {/* MOBILE SEARCH BAR (Floating) */}
        <div className="md:hidden pb-3 pt-1">
       <div className="relative shadow-lg shadow-gray-200/50 rounded-2xl">
    <input
      readOnly
      onFocus={() => navigate("/search")}
      placeholder="Search 'Strawberries'..."
      className="w-full bg-white text-sm rounded-2xl py-3 pl-11 pr-4 cursor-pointer focus:outline-none text-gray-700 placeholder-gray-400 shadow-sm border border-gray-100/50"
    />
    <div
      className={`absolute left-3 top-2.5 p-1 rounded-lg ${theme.accent} ${theme.primaryText}`}
    >
      <Search size={14} strokeWidth={3} />
    </div>
  </div>
</div>
      </div>
    </header>
  );
};

const BottomNav = ({ theme, cartCount }) => {
  const [active, setActive] = useState("home");
  const navigate = useNavigate();

  const navItems = [
    { id: "home", icon: Home, label: "Home", route: "/home" },
    { id: "search", icon: Repeat, label: "orders", route: "/orders" },
    {
      id: "cart",
      icon: ShoppingBag,
      label: "Cart",
      special: true,
      route: "/cart",
    },
     { id: "saved", icon: Store, label: "Groceries", route: "/groceries" },
    { id: "profile", icon: User, label: "Profile", route: "/profile" },
  ];

  return (
    <div className="fixed bottom-6 inset-x-0 mx-auto w-[90%] md:hidden z-50">
      {/* UPDATED: Solid background (no blur), thicker border, shadow for "Bold" look */}
      <div className="bg-white border-2 border-gray-100 shadow-2xl shadow-gray-300 rounded-2xl flex justify-between items-center px-4 py-4">
        {navItems.map((item) => {
          const isActive = active === item.id;
          if (item.special) {
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActive(item.id);
                  navigate(item.route);
                }}
                className={`relative -top-10 ${theme.primary} text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform border-4 border-white`}
              >
                <item.icon size={28} />

                {cartCount > 0 && (
                  <span
                    className="
    absolute -top-1 -right-1
    min-w-[20px] h-5
    px-1
    bg-red-600
    text-white
    text-xs
    font-black
    rounded-full
    flex items-center justify-center
    shadow-lg
  "
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            );
          }
          return (
            <button
              key={item.id}
              onClick={() => {
                setActive(item.id);
                navigate(item.route);
              }}
              className={`flex flex-col items-center justify-center w-12 gap-1 transition-all ${
                isActive ? theme.primaryText : "text-gray-400"
              }`}
            >
              {/* UPDATED: Thicker icons (strokeWidth) */}
              <item.icon size={24} strokeWidth={isActive ? 3 : 2.5} />
              {isActive && (
                <span className="text-[10px] font-black">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
// ✅ CLOUDINARY BANNERS (ONLY ONE SOURCE)
// 3. MAIN PAGE CONTENT
const MainContent = () => {


  const [cartItems, setCartItems] = useState([]);
    const cartCount = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);


  const { incrementCartCount } = useCart(); // optional if you use it


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

  /* ---------------- CART LOGIC (UNCHANGED) ---------------- */
 const handleAddToCart = async (product_id) => {
  try {
    await addToCartAPI(product_id, 1);
    await refreshCart();
  } catch (err) {
    console.error(err);
    toast.error("Please login to add items");
    navigate("/login");
  }
};


 const handleRemoveFromCart = async (product_id) => {
  try {
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
    console.error("remove error", err);
  }
};

  /* ---------------- THEME / BASIC STATE (UNCHANGED) ---------------- */
  const [currentSeason, setCurrentSeason] = useState("winter");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const theme = SEASON_CONFIG[currentSeason];
  const ThemeIcon = theme.icon;
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentSeason(getSeason());
  }, []);

  /* =========================================================
     ✅ CLOUDINARY BANNERS (ONLY ONE SOURCE – FIXED)
     ========================================================= */
  const BANNERS = [
  {
    desktop: "https://res.cloudinary.com/duzladayx/image/upload/v1769334911/banner1_ximafq.png",
    mobile: "https://res.cloudinary.com/duzladayx/image/upload/v1769337855/banner2_qkweie.png",
  },
  {
    desktop: "https://res.cloudinary.com/duzladayx/image/upload/v1769335725/banner2_xgdmes.png",
    mobile: "https://res.cloudinary.com/duzladayx/image/upload/v1769337869/banner3_qz3vej.png",
  },
  {
    desktop: "https://res.cloudinary.com/duzladayx/image/upload/v1769334868/banner3_mnbf4k.png",
    mobile: "https://res.cloudinary.com/duzladayx/image/upload/v1769337247/banner1_nvryqi.png",
  },
];

  /* ---------------- SLIDER STATE (FIXED ORDER) ---------------- */
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % BANNERS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- DATA STATE (UNCHANGED) ---------------- */
  const [CATEGORIES, setCategories] = useState([]);
  const [SUPER_DEALS_DATA, setDealdata] = useState([]);
  const [FRUITS_DATA, setFruitdata] = useState([]);
  const [VEG_DATA, setVegdata] = useState([]);
  const [FEED_PRODUCTS, setRecomentdata] = useState([]);

  const fetchCategory = async () => {
  try {
    const response = await API.post(
      "product/allcatedetails",
      {
        mode_fetchorall: 0,
        register_id: STORE_ID, // ✅ INSIDE BODY
      }
    );

    setCategories(formatCategories(response.data.data));
  } catch (error) {
    console.error("Category fetch error:", error);
  }
};
  const fetchDeals = async () => {
    try {
      const response = await API.post(
        "product/superdealsdata",
        { register_id: STORE_ID } 
      );
      const { deals, veg, fruit, reco } = response.data.data;

      setDealdata(deals);
      setFruitdata(fruit);
      setVegdata(veg);
      setRecomentdata(reco);

      console.log("Deals data:", response.data.data);
    } catch (error) {
      console.error("Deals data fetch error:", error);
    }
  };


  const formatCategories = (items) => {
    return items.map((item) => ({
      cat_id: item.categories_id || 0,
      title: item.categories_name || "",
      subtitle: "",
      img: item.image_url,
    }));
  };
  useEffect(() => {
    fetchCategory();
    fetchDeals();
  }, []);
  
  const handleCateitm = (category) => {
    console.log(category, "categorycategorycategory");

    if (!category.cat_id) {
      alert("Undefinded Categories");
      return;
    }

    navigate("/category", {
      state: {
        id: category.cat_id,
        name: category.name,
        img: category.img,
      },
    });
  };

  /* =========================================================
     ✅ JSX STARTS
     ========================================================= */
  return (
    <div
      className={`min-h-screen ${theme.gradient} transition-colors duration-700 font-sans pb-28 md:pb-0 relative`}
    >
      <SeasonalParticles season={currentSeason} />

      {/* Header with toggle function */}
      <Header
        theme={theme}
        setMenuOpen={setMenuOpen}
        onOpenNotifications={() => setShowNotifications(true)}
        cartCount={cartCount}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        theme={theme}
      />

      {/* ATMOSPHERE - REMOVED animate-pulse TO STOP BLINKING */}
   

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-2">
{/* --- 1. HERO SECTION --- */}
        <div className="w-full mb-8">
  <div className="relative w-full overflow-hidden rounded-2xl shadow-xl
  aspect-[16/10]
  md:aspect-[32/10]
">

    {BANNERS.map((banner, i) => (
      <div
        key={i}
        className={`absolute inset-0 transition-opacity duration-1000 ${
          i === slideIndex ? "opacity-100 z-10" : "opacity-0 z-0"
        }`}
      >
        {/* DESKTOP IMAGE */}
        <img
          src={banner.desktop}
          alt="Banner desktop"
          className="hidden md:block w-full h-full object-cover"
        />

        {/* MOBILE IMAGE */}
        <img
          src={banner.mobile}
          alt="Banner mobile"
          className="block md:hidden w-full h-full object-cover"
        />

        {/* Overlay Text */}
      
      </div>
    ))}

    {/* Dots */}
    <div className="absolute bottom-4 left-6 z-20 flex gap-2">
      {BANNERS.map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === slideIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
          }`}
        />
      ))}
    </div>
  </div>
</div>
        
        {/* --- 2. CATEGORIES --- */}
        {/* --- CATEGORIES SECTION --- */}
        <div className="mb-8">
          {/* Section Header (NOT scrollable) */}
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-lg md:text-xl font-bold text-gray-800">
              Categories
            </h3>

            <button 
            onClick={() => navigate("/groceries")}
            className={`text-sm font-semibold ${theme.primaryText} hover:underline flex items-center gap-1`}>
              See all <ChevronDown className="-rotate-90" size={14} />
            </button>
          </div>

          {/* Scrollable Categories */}
          <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
            {/* UPDATED: SLICE TO SHOW ONLY 10 ITEMS */}
            {CATEGORIES.slice(0, 10).map((cat, i) => (
              <div
                key={i}
                className="min-w-[90px] flex flex-col items-center text-center cursor-pointer group"
                onClick={() => {
                  handleCateitm(cat);
                }}
              >
                {/* Image Circle */}
                <div
                  className="
            w-20 h-20
            rounded-full
            overflow-hidden
            bg-white
            shadow-sm
            ring-1 ring-gray-100
            transition-all duration-300
            group-hover:shadow-md
            group-hover:-translate-y-1
          "
                >
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="
              w-full h-full
              object-cover
              transition-transform duration-300
              group-hover:scale-110
            "
                    onError={(e) =>
                      (e.currentTarget.src = "/images/category-placeholder.png")
                    }
                  />
                </div>

                {/* Text */}
                <p className="mt-2 text-xs font-semibold text-gray-800 leading-tight">
                  {cat.title}
                </p>

                {cat.subtitle && (
                  <span className="text-[11px] text-gray-500">
                    {cat.subtitle}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* --- 3. SUPER DISCOUNT ROW (New) --- */}
        {SUPER_DEALS_DATA.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4 bg-red-50 p-3 rounded-xl border border-red-100">
              <div className="flex items-center gap-2 text-red-600">
                <Percent
                  size={24}
                  fill="currentColor"
                  className="animate-pulse"
                />
                <h3 className="text-xl font-black italic tracking-tighter">
                  SUPER DEALS
                </h3>
              </div>
              {/* <div className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm animate-bounce">
                <Clock size={12} /> Ends in 12h
              </div> */}
            </div>
            <HorizontalScrollRow
              data={SUPER_DEALS_DATA}
              onAddToCart={handleAddToCart}
              cartItems={cartItems} 
              onRemoveFromCart={handleRemoveFromCart}
              theme={{
                ...theme,
                accent: "bg-red-50",
                primaryText: "text-red-600",
                primary: "bg-red-600",
              }}
            />
          </div>
        )}
        {/* --- 4. AD BANNER 1 (New) --- */}
        <ParallaxAdBanner theme={theme} />

       
      {VEG_DATA?.length > 0 && (
  <div className="mb-10">
    <SectionHeader
      title="Fresh Vegetables"
      icon={Carrot}
      theme={theme}
    />
    <HorizontalScrollRow
      data={VEG_DATA}
      theme={theme}
      cartItems={cartItems}
      onAddToCart={handleAddToCart}
      onRemoveFromCart={handleRemoveFromCart}
    />
  </div>
)}


        {/* --- 6. VEGETABLES ROW (New) --- */}
      {FRUITS_DATA?.length > 0 && (
  <div className="mb-10">
    <SectionHeader
      title="Seasonal Fruit"
      icon={Carrot}
      theme={theme}
    />
    <HorizontalScrollRow
      data={FRUITS_DATA}
      theme={theme}
      cartItems={cartItems}
      onAddToCart={handleAddToCart}
      onRemoveFromCart={handleRemoveFromCart}
    />
  </div>
)}

        

     {/* --- 7. WINTER FEST ESSENTIALS (Merged Grid) --- */}
        <div className="mb-12">
          {/* Header */}
          <div className="flex justify-between items-end px-1 mb-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
              <ThemeIcon className={theme.primaryText} size={20} /> 
              {theme.name} Essentials
            </h3>
          </div>

          {/* Unified Grid Layout */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* 1. SPOTLIGHT (Large Left) - Full Image */}
            <div className={`col-span-2 row-span-2 rounded-2xl relative overflow-hidden group cursor-pointer border border-gray-100 shadow-sm hover:shadow-md transition-all h-64 md:h-auto`}>
              <img
                src="https://res.cloudinary.com/duzladayx/image/upload/v1769347659/banner_6_uhhblj.png"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="immunity"
              />
            </div>

            {/* 2. FRESH JUICES (Small Top) - Full Image */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group h-32 md:h-40 cursor-pointer hover:-translate-y-1 transition-transform">
              <img
                src="https://res.cloudinary.com/duzladayx/image/upload/v1769349038/banner8_aqhjpq.png"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt="juice"
              />
            </div>

            {/* 3. DAIRY (Small Top) - Full Image */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group h-32 md:h-40 cursor-pointer hover:-translate-y-1 transition-transform">
              <img
                src="https://res.cloudinary.com/duzladayx/image/upload/v1769349416/banner7_nxhmmw.png"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt="dairy"
              />
            </div>

            {/* 5. BREAKFAST SPECIAL (Bottom Left) - Full Image */}
            <div className="col-span-2 md:col-span-2 bg-[#FFF8E7] rounded-2xl relative overflow-hidden h-48 md:h-52 cursor-pointer hover:shadow-md transition-all group">
              <img
                src="https://res.cloudinary.com/duzladayx/image/upload/v1769349969/banner9_pwmw3v.png"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt="breakfast"
              />
            </div>

            

          </div>
        </div>
        {/* --- 10. PRODUCT FEED --- */}
        <div className="mb-20">
          <SectionHeader
            title="Recommended For You"
          
            theme={theme}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {FEED_PRODUCTS.map((prod, idx) => (
              <RecommendedProductCard
                key={idx}
                prod={prod}
                idx={idx}
                theme={theme}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
              />
            ))}
          </div>
          {/* <div className="text-center pb-8 mt-8">
            <button className="text-gray-400 font-semibold text-sm hover:text-gray-800 transition">
              Show More Products
            </button>
          </div> */}
        </div>
      </main>
      <Footer theme={theme} />
      <BottomNav theme={theme} cartCount={cartCount} />
    </div>
  );
};

// Wrapper for Router
export default MainContent;