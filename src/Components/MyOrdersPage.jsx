import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Search, Package, ChevronRight, 
  RefreshCw, Truck, CheckCircle2, XCircle, Clock,
  Snowflake, Sun, CloudRain, Flower2, Filter, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- 1. SEASON CONFIGURATION ---
const SEASON_CONFIG = {
  winter: {
    name: "Winter Fest",
    gradient: "bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50",
    primary: "bg-indigo-600",
    primaryText: "text-indigo-600",
    light: "bg-indigo-50",
    border: "border-indigo-100",
    icon: Snowflake,
  },
  summer: {
    name: "Summer Chill",
    gradient: "bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50",
    primary: "bg-orange-500",
    primaryText: "text-orange-600",
    light: "bg-orange-50",
    border: "border-orange-100",
    icon: Sun,
  },
  spring: {
    name: "Spring Bloom",
    gradient: "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50",
    primary: "bg-emerald-600",
    primaryText: "text-emerald-600",
    light: "bg-emerald-50",
    border: "border-emerald-100",
    icon: Flower2,
  },
  monsoon: {
    name: "Monsoon",
    gradient: "bg-gradient-to-br from-slate-200 via-gray-100 to-slate-300",
    primary: "bg-teal-600",
    primaryText: "text-teal-600",
    light: "bg-teal-50",
    border: "border-teal-100",
    icon: CloudRain,
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
const MyOrdersPage = () => {
  const navigate = useNavigate();
  
  const [currentSeason, setCurrentSeason] = useState('spring'); 
  const [theme, setTheme] = useState(SEASON_CONFIG.spring);
  const [activeTab, setActiveTab] = useState('active'); 
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const season = getSeason();
    setCurrentSeason(season);
    setTheme(SEASON_CONFIG[season]);
  }, []);

  useEffect(() => {
    setStatusFilter('All');
    setIsFilterOpen(false);
  }, [activeTab]);

  // --- MOCK DATA ---
  const orders = [
    {
      id: "ORD-29384",
      date: "Today, 10:30 AM",
      status: "On the way",
      statusColor: "text-blue-600",
      bg: "bg-blue-50",
      icon: Truck,
      total: 345,
      items: [
        "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=100&q=80",
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=100&q=80",
        "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=100&q=80"
      ],
      itemCount: 5,
      type: 'active'
    },
    {
      id: "ORD-29381",
      date: "Yesterday, 6:00 PM",
      status: "Delivered",
      statusColor: "text-green-600",
      bg: "bg-green-50",
      icon: CheckCircle2,
      total: 120,
      items: [
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&q=80"
      ],
      itemCount: 1,
      type: 'past'
    },
    {
      id: "ORD-28102",
      date: "28 Nov, 2025",
      status: "Delivered",
      statusColor: "text-green-600",
      bg: "bg-green-50",
      icon: CheckCircle2,
      total: 850,
      items: [
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=100&q=80",
        "https://images.unsplash.com/photo-1488477181946-6428a029177b?w=100&q=80",
        "https://images.unsplash.com/photo-1523049673856-42868928ae47?w=100&q=80",
      ],
      itemCount: 8,
      type: 'past'
    },
    {
      id: "ORD-27001",
      date: "15 Nov, 2025",
      status: "Cancelled",
      statusColor: "text-red-600",
      bg: "bg-red-50",
      icon: XCircle,
      total: 450,
      items: [
        "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=100&q=80"
      ],
      itemCount: 2,
      type: 'past'
    }
  ];

  const availableStatuses = ['All', ...new Set(orders.filter(o => o.type === activeTab).map(o => o.status))];

  const displayedOrders = orders.filter(o => {
    const matchesTab = o.type === activeTab;
    const matchesFilter = statusFilter === 'All' || o.status === statusFilter;
    return matchesTab && matchesFilter;
  });

  return (
    <div className={`min-h-screen font-sans ${theme.gradient} transition-colors duration-500 pb-10`}>
      
      {/* HEADER */}
      <div className="bg-white sticky top-0 z-20 shadow-sm border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between h-16 md:h-20">
                <div className="flex items-center gap-3 md:gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition">
                        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-700" />
                    </button>
                    <h1 className="font-bold text-lg md:text-xl text-slate-800">My Orders</h1>
                </div>
                
                <div className="flex items-center gap-3">
                      <div className={`hidden md:flex px-3 py-1.5 rounded-full ${theme.light} border ${theme.border} items-center gap-2`}>
                        <theme.icon className={`w-4 h-4 ${theme.primaryText}`} />
                        <span className={`text-xs font-bold uppercase ${theme.primaryText}`}>{theme.name}</span>
                    </div>
                    <button className="p-2 hover:bg-slate-50 rounded-full transition">
                        <Search className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
                    </button>
                </div>
            </div>

            {/* TABS */}
            <div className="flex gap-8 mt-1">
                {['active', 'past'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                            pb-3 text-sm md:text-base font-bold border-b-2 transition-all capitalize
                            ${activeTab === tab 
                                ? `${theme.primaryText} border-current` 
                                : 'text-slate-400 border-transparent hover:text-slate-600'}
                        `}
                    >
                        {tab} Orders
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* Filter Bar */}
        <div className="flex justify-between items-center relative z-10">
            <p className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Showing {displayedOrders.length} orders
            </p>
            
            <div className="relative">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-2 text-xs md:text-sm font-bold bg-white px-4 py-2 rounded-xl shadow-sm border transition
                    ${isFilterOpen ? `border-${theme.primaryText.split('-')[1]}-200 bg-slate-50` : 'border-slate-200 text-slate-600'}
                  `}
                >
                    <Filter className="w-3.5 h-3.5" /> 
                    {statusFilter === 'All' ? 'Filter' : statusFilter}
                </button>

                {/* Dropdown Menu */}
                {isFilterOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="p-1">
                      {availableStatuses.map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setStatusFilter(status);
                            setIsFilterOpen(false);
                          }}
                          className="w-full text-left px-3 py-2.5 text-sm rounded-lg hover:bg-slate-50 flex items-center justify-between group"
                        >
                          <span className={statusFilter === status ? 'font-bold text-slate-800' : 'text-slate-600'}>
                            {status}
                          </span>
                          {statusFilter === status && (
                             <Check className={`w-4 h-4 ${theme.primaryText}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>
        </div>

        {displayedOrders.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-24 opacity-60">
                <div className={`p-8 rounded-full ${theme.light} mb-6`}>
                    <Package className={`w-16 h-16 ${theme.primaryText}`} />
                </div>
                <h3 className="font-bold text-xl text-slate-800 mb-2">No orders found</h3>
                <p className="text-sm md:text-base text-slate-500">
                   {statusFilter !== 'All' 
                     ? `No ${statusFilter.toLowerCase()} orders found.` 
                     : "You haven't placed any orders in this category."}
                </p>
                {statusFilter !== 'All' && (
                  <button 
                    onClick={() => setStatusFilter('All')}
                    className={`mt-4 text-sm font-bold ${theme.primaryText} hover:underline`}
                  >
                    Clear Filter
                  </button>
                )}
            </div>
        ) : (
            // Order Grid
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {displayedOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:border-slate-200 transition-all duration-300 group">
                        
                        {/* Card Top */}
                        <div className="p-5 border-b border-slate-50 flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${order.bg}`}>
                                    <order.icon className={`w-5 h-5 ${order.statusColor}`} />
                                </div>
                                <div>
                                    <h3 className={`font-bold text-sm md:text-base ${order.statusColor}`}>{order.status}</h3>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                                        <Clock className="w-3 h-3" />
                                        <span>{order.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Order ID</span>
                                <p className="text-sm font-bold text-slate-700">#{order.id.split('-')[1]}</p>
                            </div>
                        </div>

                        {/* Card Middle */}
                        <div className="p-5 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-3">
                                    {order.items.map((img, idx) => (
                                        <div key={idx} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white bg-slate-50 shadow-sm overflow-hidden">
                                            <img src={img} alt="Item" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    {order.itemCount > 3 && (
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] md:text-xs font-bold text-slate-500 shadow-sm">
                                            +{order.itemCount - 3}
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs md:text-sm text-slate-500 font-medium ml-1">
                                    x {order.itemCount} Items
                                </span>
                            </div>
                            
                            <div className="text-right">
                                 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Total</p>
                                 <p className="text-lg md:text-xl font-bold text-slate-800">₹{order.total}</p>
                            </div>
                        </div>

                        {/* Card Bottom */}
                        <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                            {order.type === 'active' ? (
                                <button 
                                  onClick={() => navigate('/track-order')}
                                  className={`flex-1 ${theme.primary} text-white text-sm font-bold py-3 rounded-xl shadow-sm hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2`}
                                >
                                    <Truck className="w-4 h-4" /> Track Order
                                </button>
                            ) : (
                                <button 
                                  onClick={() => alert('Reorder feature coming soon!')}
                                  className={`flex-1 bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 text-sm font-bold py-3 rounded-xl transition flex items-center justify-center gap-2`}
                                >
                                    <RefreshCw className="w-4 h-4" /> Reorder
                                </button>
                            )}
                            
                            {/* Corrected Indentation & Added Navigation */}
                            <button 
                                onClick={() => navigate('/order-details')} 
                                className="flex-1 bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 text-sm font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                            >
                                Details <ChevronRight className="w-4 h-4 text-slate-400" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;