import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  Package,
  ChevronRight,
  RefreshCw,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SEASON_CONFIG, getSeason } from "../SEASON_CONFIG.jsx";
import { getUserOrdersAPI,reorderAPI } from "../api/orderAPI";

const MyOrdersPage = () => {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(SEASON_CONFIG.spring);
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  // ------------------------------
  // MAP BACKEND → UI FORMAT
  // ------------------------------
  const mapOrdersToUI = (orders = [], type) =>
    orders.map((o) => ({
      id: o.order_no,
      date: o.created_at,
      status: o.order_status === "Process" ? "On the way" : o.order_status,
      statusColor:
        o.order_status === "Delivered"
          ? "text-green-600"
          : o.order_status === "Cancelled"
          ? "text-red-600"
          : "text-blue-600",
      bg:
        o.order_status === "Delivered"
          ? "bg-green-50"
          : o.order_status === "Cancelled"
          ? "bg-red-50"
          : "bg-blue-50",
      icon:
        o.order_status === "Delivered"
          ? CheckCircle2
          : o.order_status === "Cancelled"
          ? XCircle
          : Truck,
      total: o.total_amount,
      items: [],
       itemCount: (o.item_count),
      type,
      order_id: o.order_id,
    }));

  // ------------------------------
  // SEASON THEME
  // ------------------------------
  useEffect(() => {
    const season = getSeason();
    setTheme(SEASON_CONFIG[season]);
  }, []);

  // ------------------------------
  // LOAD ORDERS (ONCE)
  // ------------------------------
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);

        const res = await getUserOrdersAPI();

        if (!res || !res.data) {
          console.error("API returned no response", res);
          return;
        }

        console.log("Orders API Response:", res.data);

        if (res.data.status === 1) {
          const activeOrders = mapOrdersToUI(
            res.data.data.processed,
            "active"
          );

          const pastOrders = mapOrdersToUI(
            [...res.data.data.delivered, ...res.data.data.cancelled],
            "past"
          );

          setOrders([...activeOrders, ...pastOrders]);
        }
      } catch (err) {
        console.error(
          "Order fetch error:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // ------------------------------
  // FILTER LOGIC
  // ------------------------------
  const availableStatuses = [
    "All",
    ...new Set(orders.filter((o) => o.type === activeTab).map((o) => o.status)),
  ];

  const displayedOrders = orders.filter(
    (o) =>
      o.type === activeTab &&
      (statusFilter === "All" || o.status === statusFilter)
  );

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <div className={`min-h-screen ${theme.gradient} pb-10`}>
      {/* HEADER */}
      <div className="bg-white sticky top-0 z-20 shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="font-bold text-lg">My Orders</h1>
            </div>
            <Search className="w-5 h-5 text-slate-500" />
          </div>

          {/* TABS */}
          <div className="flex gap-8">
            {["active", "past"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 border-b-2 font-bold capitalize ${
                  activeTab === tab
                    ? `${theme.primaryText} border-current`
                    : "text-slate-400 border-transparent"
                }`}
              >
                {tab} Orders
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* FILTER BAR */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-500">
            Showing {displayedOrders.length} orders
          </p>

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border"
            >
              <Filter className="w-4 h-4" />
              {statusFilter}
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border">
                {availableStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setIsFilterOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex justify-between"
                  >
                    {status}
                    {statusFilter === status && (
                      <Check className="w-4 h-4 text-green-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-24 text-slate-500 font-semibold">
            Loading orders...
          </div>
        )}

        {/* EMPTY */}
        {!loading && displayedOrders.length === 0 && (
          <div className="flex flex-col items-center py-24 opacity-60">
            <Package className="w-16 h-16 mb-4" />
            <p>No orders found</p>
          </div>
        )}

        {/* ORDERS */}
        {!loading && displayedOrders.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayedOrders.map((order) => (
             <div
  key={order.order_id}
  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
>
  {/* TOP */}
  <div className="p-5 flex justify-between items-start">
    <div className="flex items-start gap-4">
      <div
        className={`p-3 rounded-xl ${order.bg} flex items-center justify-center`}
      >
        <order.icon className={`w-5 h-5 ${order.statusColor}`} />
      </div>

      <div>
        <p className={`font-semibold text-base ${order.statusColor}`}>
          {order.status}
        </p>

        <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{order.date}</span>
        </div>

        <p className="text-xs text-slate-500 mt-2">
          {order.itemCount} items
        </p>
      </div>
    </div>

    <div className="text-right">
      <p className="text-xs text-slate-400 font-semibold">ORDER ID</p>
      <p className="font-bold text-slate-800">
        #{order.id.replace(/\D/g, "")}
      </p>
    </div>
  </div>

  {/* DIVIDER */}
  <div className="border-t border-slate-100" />

  {/* BOTTOM */}
  <div className="p-5 flex items-center justify-between">
    <div>
      <p className="text-xs text-slate-400">Total Amount</p>
      <p className="text-xl font-bold text-slate-900">
        ₹{order.total}
      </p>
    </div>

    <div className="flex gap-3">
      {order.type === "active" ? (
        <button
          onClick={() =>
            navigate("/track-order", {
              state: { orderId: order.order_id },
            })
          }
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white ${theme.primary} hover:brightness-110 transition`}
        >
          Track Order
        </button>
      ) : (
    <button
  disabled={loading}
  onClick={async () => {
    setLoading(true);
    await reorderAPI(order.id);
    navigate("/cart");
  }}
  className="
    flex items-center justify-center gap-2 flex-1
    py-2.5 px-4 rounded-lg
    bg-indigo-600 text-white
    hover:bg-indigo-700
    disabled:opacity-60 disabled:cursor-not-allowed
  "
>
  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
  {loading ? "Reordering..." : "Reorder"}
</button>
      )}

      <button
        onClick={() =>
         navigate(`/order/${order.order_id}`)

        }
        className="px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-1 hover:bg-slate-50"
      >
        Details <ChevronRight className="w-4 h-4" />
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

export default MyOrdersPage;
