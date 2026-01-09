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
  Package, // Added AlertCircle, Package
  Route,
} from "lucide-react";
import axios from "axios";
import { useNavigate, BrowserRouter } from "react-router-dom";
import {
  SEASON_CONFIG,
  getSeason,
  SeasonalParticles,
} from "../SEASON_CONFIG.jsx";

// --- MOCK DATA ---
// const CATEGORIES = [
//   { title: "Price Drop", subtitle: "VIEW ALL", icon: <Star size={20} className="text-yellow-500" />, color: "bg-yellow-50" },
//   { title: "Daily Picks", subtitle: "FROM ₹25", icon: <ShoppingBasket size={20} className="text-blue-500" />, color: "bg-blue-50" },
//   { title: "Local Veg", subtitle: "FROM ₹15", icon: <Carrot size={20} className="text-orange-500" />, color: "bg-orange-50" },
//   { title: "Fruits", subtitle: "FROM ₹38", icon: <Apple size={20} className="text-red-500" />, color: "bg-red-50" },
//   { title: "Exotic", subtitle: "FROM ₹33", icon: <Citrus size={20} className="text-purple-500" />, color: "bg-purple-50" },
//   { title: "Greens", subtitle: "FROM ₹9", icon: <Salad size={20} className="text-green-500" />, color: "bg-green-50" },
//   { title: "Roots", subtitle: "FROM ₹26", icon: <Leaf size={20} className="text-emerald-500" />, color: "bg-emerald-50" },
// ];

// const FRUITS_DATA = [
//     { name: "Shimla Apples", weight: "4pcs", price: 120, oldPrice: 150, img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300&q=80", discount: "20%" },
//     { name: "Robusta Banana", weight: "1kg", price: 45, oldPrice: 60, img: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=300&q=80", discount: "25%" },
//     { name: "Pomegranate", weight: "3pcs", price: 89, oldPrice: 110, img: "https://images.unsplash.com/photo-1596386461350-326ea7750550?auto=format&fit=crop&w=300&q=80", discount: "18%" },
//     { name: "Kiwi Green", weight: "3pcs", price: 99, oldPrice: 140, img: "https://images.unsplash.com/photo-1585059895524-72359e06138a?auto=format&fit=crop&w=300&q=80", discount: "30%" },
//     { name: "Dragon Fruit", weight: "1pc", price: 75, oldPrice: 100, img: "https://images.unsplash.com/photo-1527357416398-1e4e554907a4?auto=format&fit=crop&w=300&q=80", discount: "25%" },
// ];

// const VEG_DATA = [
//     { name: "Fresh Broccoli", weight: "250g", price: 45, oldPrice: 65, img: "https://images.unsplash.com/photo-1459411621453-7fb8db8feaa2?auto=format&fit=crop&w=300&q=80", discount: "30%" },
//     { name: "Red Bell Pepper", weight: "2pcs", price: 55, oldPrice: 80, img: "https://images.unsplash.com/photo-1563565375-f3fdf5dbc240?auto=format&fit=crop&w=300&q=80", discount: "31%" },
//     { name: "Button Mushroom", weight: "200g", price: 40, oldPrice: 55, img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80", discount: "27%" },
//     { name: "Cherry Tomato", weight: "250g", price: 35, oldPrice: 50, img: "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=300&q=80", discount: "30%" },
//     { name: "Sweet Corn", weight: "2pcs", price: 25, oldPrice: 40, img: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=300&q=80", discount: "37%" },
// ];

// const SUPER_DEALS_DATA = [
//     { name: "Fortune Oil", weight: "1L", price: 105, oldPrice: 145, img: "https://images.unsplash.com/photo-1474979266404-7cadd259d3cf?auto=format&fit=crop&w=300&q=80", discount: "40%" },
//     { name: "Basmati Rice", weight: "5kg", price: 399, oldPrice: 650, img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80", discount: "45%" },
//     { name: "Tata Salt", weight: "1kg", price: 20, oldPrice: 28, img: "https://images.unsplash.com/photo-1518110925495-569698eb4667?auto=format&fit=crop&w=300&q=80", discount: "30%" },
//     { name: "Sugar", weight: "1kg", price: 38, oldPrice: 55, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80", discount: "35%" },
// ];

// const FEED_PRODUCTS = Array(8).fill({
//   name: "Fresh Premium Avocados",
//   weight: "500g",
//   price: 120,
//   oldPrice: 160,
//   discount: "25%",
//   img: "https://images.unsplash.com/photo-1523049673856-6468baca292f?auto=format&fit=crop&w=300&q=80"
// });

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
      {action} <ChevronDown className="-rotate-90" size={14} />
    </span>
  </div>
);

const ProductCardVertical = ({ product, theme }) => (
  <div className="min-w-[150px] md:min-w-[180px] bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
    <div className="h-28 md:h-36 bg-gray-50 rounded-lg mb-3 relative overflow-hidden">
      <img
        src={product.img}
        className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
        alt={product.name}
      />
      {product.discount && (
        <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
          {product.discount} OFF
        </span>
      )}
      <button className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:text-red-500">
        <Heart size={14} />
      </button>
    </div>
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
        <button
          className={`${theme.accent} ${theme.primaryText} p-2 rounded-lg hover:scale-105 transition`}
        >
          <Plus size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  </div>
);

const HorizontalScrollRow = ({ data, theme }) => (
  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 pl-1 scroll-smooth">
    {data.map((item, i) => (
      <ProductCardVertical key={i} product={item} theme={theme} />
    ))}
    <div className="min-w-[100px] flex flex-col items-center justify-center text-gray-400 cursor-pointer group">
      <div
        className={`w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center group-hover:border-${theme.primary.replace(
          "bg-",
          ""
        )} transition`}
      >
        <ArrowRight size={20} />
      </div>
      <span className="text-xs font-bold mt-2">View All</span>
    </div>
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

const ParallaxAdBanner = ({ theme }) => (
  <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden relative mb-12 group cursor-pointer shadow-lg">
    <div className="absolute inset-0 bg-gray-900">
      <img
        src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
        alt="Ad"
      />
    </div>
    <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-12">
      <span className="bg-yellow-400 text-black text-xs font-black px-2 py-1 rounded mb-2 uppercase tracking-wider">
        Market Day Special
      </span>
      <h3 className="text-3xl md:text-5xl font-black text-white mb-2 leading-none">
        Fresh from <br /> the Farm
      </h3>
      <p className="text-gray-300 text-sm md:text-base mb-6 max-w-md">
        Get 100% organic vegetables delivered directly from local farmers to
        your doorstep within 24 hours.
      </p>
      <button className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition shadow-xl flex items-center gap-2">
        Shop Now <ArrowRight size={16} />
      </button>
    </div>
  </div>
);

const GridAd = ({ theme }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
    <div className="bg-[#FFF8E7] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden h-48 cursor-pointer hover:shadow-md transition">
      <div className="relative z-10">
        <span className="text-orange-600 font-bold text-xs">
          BREAKFAST SPECIAL
        </span>
        <h4 className="text-2xl font-black text-gray-800 mt-1">
          Kellogg's & <br />
          Oats
        </h4>
        <p className="text-sm text-gray-600 mt-2">Up to 30% OFF</p>
      </div>
      <img
        src="https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=300&q=80"
        className="absolute -bottom-4 -right-4 w-40 object-contain rotate-12"
        alt="ad1"
      />
    </div>
    <div className="bg-[#EAFBF3] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden h-48 cursor-pointer hover:shadow-md transition">
      <div className="relative z-10">
        <span className="text-green-600 font-bold text-xs">HYGIENE STORE</span>
        <h4 className="text-2xl font-black text-gray-800 mt-1">
          Cleaning <br />
          Essentials
        </h4>
        <p className="text-sm text-gray-600 mt-2">Starting ₹99</p>
      </div>
      <img
        src="https://images.unsplash.com/photo-1585421514738-01798e14806c?auto=format&fit=crop&w=300&q=80"
        className="absolute bottom-0 right-0 w-32 object-contain"
        alt="ad2"
      />
    </div>
  </div>
);

const Header = ({ theme, setMenuOpen, onOpenNotifications }) => {
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
              <Leaf size={20} fill="currentColor" className="opacity-90" />
            </div>
            <div className="flex flex-col">
              <h1
                className={`text-xl md:text-2xl font-black tracking-tighter text-gray-800 leading-none`}
              >
                SB<span className={theme.primaryText}> GROCES</span>
              </h1>
              <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase hidden md:block">
                Fresh & Organic
              </span>
            </div>
          </div>

          {/* Location Pill (Hidden on tiny screens) */}

          {/* Desktop Search (Centered) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-auto relative group">
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
              <ShoppingBasket size={18} />
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
              className="w-full bg-white text-sm rounded-2xl py-3 pl-11 pr-4 focus:outline-none text-gray-700 placeholder-gray-400 shadow-sm border border-gray-100/50"
              placeholder="Search 'Strawberries'..."
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

const BottomNav = ({ theme }) => {
  const [active, setActive] = useState("home");
  const navigate = useNavigate();

  const navItems = [
    { id: "home", icon: Home, label: "Home", route: "/home" },
    { id: "search", icon: Search, label: "Search", route: "/search" },
    {
      id: "cart",
      icon: ShoppingBag,
      label: "Cart",
      special: true,
      route: "/cart",
    },
    { id: "saved", icon: Heart, label: "Saved", route: "/saved" },
    { id: "profile", icon: User, label: "Profile", route: "/profile" },
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
                onClick={() => {
                  setActive(item.id);
                  navigate(item.route);
                }}
                className={`relative -top-8 ${theme.primary} text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform`}
              >
                <item.icon size={24} />
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-white border-2 border-transparent rounded-full box-content text-[9px] font-bold text-black flex items-center justify-center">
                  3
                </span>
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
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <span className="text-[9px] font-bold">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 3. MAIN PAGE CONTENT
const MainContent = () => {
  const [currentSeason, setCurrentSeason] = useState("winter");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // State for notifications
  const theme = SEASON_CONFIG[currentSeason];
  const ThemeIcon = theme.icon;

  useEffect(() => {
    setCurrentSeason(getSeason());
  }, []);

  const [slideIndex, setSlideIndex] = useState(0);
  const banners = [1, 2, 3];
  const [CATEGORIES, setCategories] = useState([]);
  const [SUPER_DEALS_DATA, setDealdata] = useState([]);
  const [FRUITS_DATA, setFruitdata] = useState([]);
  const [VEG_DATA, setVegdata] = useState([]);
  const [FEED_PRODUCTS, setRecomentdata] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchCategory = async () => {
    try {
      const response = await axios.post(
        "https://api.sribalajistores.com/product/allcatedetails",
        { mode_fetchorall: 0 }
      );

      const formatted = formatCategories(response.data.data);

      setCategories(formatted);

      console.log("Formatted Categories:", formatted);
    } catch (error) {
      console.error("Category fetch error:", error);
    }
  };
  const fetchDeals = async () => {
    try {
      const response = await axios.post(
        "https://api.sribalajistores.com/product/superdealsdata"
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
      img: item.cat_img,
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
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        theme={theme}
      />

      {/* ATMOSPHERE */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute top-0 left-0 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${theme.primary} animate-pulse`}
        ></div>
        <div
          className={`absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${theme.accent} animate-pulse`}
        ></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-2">
        {/* --- 1. HERO SECTION --- */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 items-start">
          <div className="w-full md:w-2/3 lg:w-3/4 relative rounded-2xl overflow-hidden shadow-xl aspect-[16/8] md:aspect-[16/7] group">
            {banners.map((_, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  i === slideIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <img
                  src={`https://picsum.photos/1200/600?random=${i + 10}`}
                  className={`w-full h-full object-cover ${theme.bannerTone}`}
                  alt="Banner"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent p-6 md:p-12 flex flex-col justify-center text-white">
                  <span
                    className={`inline-block w-fit px-3 py-1 rounded-md text-xs font-bold mb-3 ${theme.badge} uppercase tracking-wider`}
                  >
                    {theme.name}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                    Fresh & Organic <br /> Delivered Fast.
                  </h2>
                  <p className="text-sm md:text-lg opacity-90 mb-6 max-w-md hidden md:block">
                    Experience the best quality seasonal produce.
                  </p>
                  <button className="bg-white text-gray-900 font-bold py-2.5 px-6 rounded-full w-fit hover:bg-gray-100 transition shadow-lg">
                    Shop {theme.name}
                  </button>
                </div>
              </div>
            ))}
            <div className="absolute bottom-4 left-6 z-20 flex gap-2">
              {banners.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === slideIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-3">
            <div
              className={`flex items-center gap-3 p-4 rounded-2xl ${
                theme.cardBg
              } shadow-sm border ${theme.accent.replace(
                "bg-",
                "border-"
              )} cursor-pointer hover:shadow-lg transition-all`}
            >
              <div
                className={`p-3 rounded-full ${theme.accent} ${theme.primaryText}`}
              >
                <CreditCard size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  HDFC Bank
                </p>
                <p className="font-black text-gray-800 text-lg leading-none">
                  10% OFF
                </p>
                <p className="text-xs text-gray-500">On credit cards</p>
              </div>
            </div>
            <div
              className={`flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md cursor-pointer hover:shadow-xl transition-all`}
            >
              <div className={`p-3 rounded-full bg-white/20 backdrop-blur-sm`}>
                <Tag size={24} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-wide">
                  Code: SAVE20
                </p>
                <p className="font-black text-white text-lg leading-none">
                  Flat ₹50
                </p>
                <p className="text-xs text-gray-400">On orders above ₹299</p>
              </div>
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

            <button className="text-sm font-semibold text-green-600 hover:underline">
              See all
            </button>
          </div>

          {/* Scrollable Categories */}
          <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
            {CATEGORIES.map((cat, i) => (
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
              <div className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm animate-bounce">
                <Clock size={12} /> Ends in 12h
              </div>
            </div>
            <HorizontalScrollRow
              data={SUPER_DEALS_DATA}
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

        {/* --- 5. FLASH SALE --- */}
        <div
          className={`rounded-2xl p-5 mb-10 shadow-xl shadow-gray-200 relative overflow-hidden text-white ${theme.primary}`}
        >
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 transform scale-150">
            <Flame size={200} fill="currentColor" />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 relative z-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold border border-white/30 animate-pulse">
                  HURRY UP
                </span>
              </div>
              <h2 className="text-2xl font-black">Flash Sale</h2>
              <p className="text-white/80 text-sm">
                Grab the best deals before they melt away!
              </p>
            </div>
            <div className="flex items-center gap-3 bg-black/20 p-2 rounded-lg backdrop-blur-sm">
              <Clock size={16} />
              <div className="flex gap-1 font-mono font-bold text-lg">
                <span>02</span>:<span>45</span>:<span>12</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar relative z-10 pb-2">
            {[1, 2, 3, 4, 5].map((item, i) => (
              <div
                key={i}
                className="min-w-[160px] bg-white text-gray-800 rounded-xl p-3 shadow-md"
              >
                <div className="h-28 bg-gray-100 rounded-lg mb-2 relative overflow-hidden group">
                  <img
                    src={`https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=200&q=80`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt="product"
                  />
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    -40%
                  </span>
                </div>
                <h4 className="font-bold text-sm truncate">Organic Cashews</h4>
                <p className="text-xs text-gray-500 mb-2">200g Pack</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">₹240</span>
                  <button
                    className={`${theme.primary} text-white p-1.5 rounded-full hover:scale-110 transition`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- 6. VEGETABLES ROW (New) --- */}
        <div className="mb-10">
          <SectionHeader title="Fresh Vegetables" icon={Carrot} theme={theme} />
          <HorizontalScrollRow data={VEG_DATA} theme={theme} />
        </div>

        {/* --- 7. BENTO GRID --- */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ThemeIcon className={theme.primaryText} size={20} /> {theme.name}{" "}
            Essentials
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:h-64">
            <div
              className={`col-span-2 row-span-2 rounded-2xl p-6 relative overflow-hidden group cursor-pointer ${theme.cardBg} border shadow-sm hover:shadow-md transition-all`}
            >
              <div className="relative z-10 w-2/3">
                <span
                  className={`text-[10px] font-bold tracking-widest uppercase ${theme.primaryText}`}
                >
                  Spotlight
                </span>
                <h4 className="text-2xl font-black text-gray-800 mt-2 mb-2">
                  Immunity <br /> Boosters
                </h4>
                <p className="text-xs text-gray-500 mb-4">
                  Ginger, Turmeric, Lemon & Honey combos.
                </p>
                <button
                  className={`${theme.primary} text-white text-xs font-bold py-2 px-4 rounded-lg`}
                >
                  Explore
                </button>
              </div>
              <img
                src="https://images.unsplash.com/photo-1515942661900-94b3d1972591?auto=format&fit=crop&w=300&q=80"
                className="absolute -bottom-4 -right-4 w-40 md:w-48 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                alt="special"
              />
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative overflow-hidden group">
              <h4 className="font-bold text-gray-800">Fresh Juices</h4>
              <p className="text-[10px] text-green-600 font-bold">
                Buy 1 Get 1
              </p>
              <img
                src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=150&q=80"
                className="absolute bottom-0 right-0 w-16 h-16 object-cover rounded-tl-xl transition-transform group-hover:scale-110"
                alt="juice"
              />
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative overflow-hidden group">
              <h4 className="font-bold text-gray-800">Dairy</h4>
              <p className="text-[10px] text-gray-500">Fresh Morning</p>
              <img
                src="https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=150&q=80"
                className="absolute bottom-0 right-0 w-16 h-16 object-cover rounded-tl-xl transition-transform group-hover:scale-110"
                alt="dairy"
              />
            </div>
            <div className="col-span-2 md:col-span-2 bg-gray-900 text-white rounded-2xl p-4 flex items-center justify-between cursor-pointer group">
              <div className="pl-2">
                <p className="text-xs text-gray-400">Not sure what to cook?</p>
                <h4 className="font-bold text-lg">See {theme.name} Recipes</h4>
              </div>
              <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition">
                <ArrowRight size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* --- 8. AD TEMPLATE 2 (New) --- */}
        <GridAd theme={theme} />

        {/* --- 9. FRUITS ROW (New) --- */}
        <div className="mb-12">
          <SectionHeader title="Seasonal Fruits" icon={Apple} theme={theme} />
          <HorizontalScrollRow data={FRUITS_DATA} theme={theme} />
        </div>

        {/* --- 10. PRODUCT FEED --- */}
        <div className="mb-20">
          <SectionHeader
            title="Recommended For You"
            action="View All"
            theme={theme}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {FEED_PRODUCTS.map((prod, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="relative h-32 md:h-40 mb-3 rounded-xl overflow-hidden bg-gray-50">
                  <img
                    src={prod.img}
                    className="w-full h-full object-cover mix-blend-multiply"
                    alt={prod.name}
                  />
                  <button className="absolute top-2 right-2 bg-white/80 backdrop-blur p-1.5 rounded-full text-gray-400 hover:text-red-500 transition shadow-sm">
                    <Heart size={14} />
                  </button>
                  {idx % 3 === 0 && (
                    <span className="absolute bottom-0 left-0 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-tr-lg">
                      ORGANIC
                    </span>
                  )}
                </div>
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
                  <button
                    className={`w-full mt-3 py-2 rounded-xl text-xs font-bold border ${theme.cardBg.replace(
                      "bg-white/80",
                      "bg-transparent"
                    )} ${theme.primaryText} hover:${
                      theme.primary
                    } hover:text-white transition-colors flex items-center justify-center gap-2`}
                  >
                    ADD <Plus size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center pb-8 mt-8">
            <button className="text-gray-400 font-semibold text-sm hover:text-gray-800 transition">
              Show More Products
            </button>
          </div>
        </div>
      </main>

      <BottomNav theme={theme} />
    </div>
  );
};

// Wrapper for Router
export default MainContent;
