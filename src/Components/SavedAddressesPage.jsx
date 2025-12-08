// src/pages/SavedAddressesPage.jsx
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Plus,
  Home,
  Briefcase,
  MoreVertical,
  Trash2,
  Edit2,
  CheckCircle2,
  Snowflake,
  Sun,
  CloudRain,
  Flower2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchAddresses, deleteAddressAPI,setDefaultAPI  } from "../api/addressAPI";

// --- CONFIG ---
const SEASON_CONFIG = {
  winter: {
    name: "Winter Fest",
    gradient: "bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50",
    primary: "bg-indigo-600",
    primaryText: "text-indigo-600",
    accent: "bg-indigo-50",
    border: "border-indigo-100",
    icon: Snowflake,
  },
  summer: {
    name: "Summer Chill",
    gradient: "bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50",
    primary: "bg-orange-500",
    primaryText: "text-orange-600",
    accent: "bg-orange-50",
    border: "border-orange-100",
    icon: Sun,
  },
  spring: {
    name: "Spring Bloom",
    gradient: "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50",
    primary: "bg-emerald-600",
    primaryText: "text-emerald-600",
    accent: "bg-emerald-50",
    border: "border-emerald-100",
    icon: Flower2,
  },
  monsoon: {
    name: "Monsoon",
    gradient: "bg-gradient-to-br from-slate-200 via-gray-100 to-slate-300",
    primary: "bg-teal-600",
    primaryText: "text-teal-600",
    accent: "bg-teal-50",
    border: "border-teal-100",
    icon: CloudRain,
  },
};

const getSeason = () => {
  const month = new Date().getMonth();
  if (month === 10 || month === 11 || month === 0) return "winter";
  if (month === 1 || month === 2) return "spring";
  if (month >= 3 && month <= 5) return "summer";
  return "monsoon";
};

// --- MAIN COMPONENT ---
const SavedAddressesPage = () => {
  const navigate = useNavigate();

  const currentSeasonKey = getSeason();
  const theme = SEASON_CONFIG[currentSeasonKey];
  const SeasonIcon = theme.icon;

  const [addresses, setAddresses] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load addresses from backend
  const loadAddresses = async () => {
    try {
      setLoading(true);
      const { data } = await fetchAddresses();
      // data is array of rows from tbl_address
      setAddresses(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  // Local-only default selection (no backend change)
  const setDefault = async (addressId) => {
  try {
    await setDefaultAPI(addressId); // 🔥 update backend

    // Update frontend UI instantly
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        is_default: addr.address_id === addressId,
      }))
    );
  } catch (err) {
    console.error(err);
    alert("Failed to set default address");
  }
};


  const handleDelete = async (addressId) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await deleteAddressAPI(addressId);
      setAddresses((prev) =>
        prev.filter((addr) => addr.address_id !== addressId)
      );
      setActiveMenu(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete address");
    }
  };

  const toggleMenu = (addressId) => {
    setActiveMenu((prev) => (prev === addressId ? null : addressId));
  };

  const getIconByType = (type) => {
    if (!type) return MapPin;
    const label = String(type).toLowerCase();
    if (label === "home") return Home;
    if (label === "work" || label === "office") return Briefcase;
    return MapPin;
  };

  return (
    <div className={`min-h-screen ${theme.gradient} pb-10`}>
      {/* Header */}
      <div
        className={`bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm border-b ${theme.border}`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="font-bold text-lg text-slate-800">
              Saved Addresses
            </h1>
          </div>

          <div
            className={`px-2 py-1 rounded-md ${theme.accent} border ${theme.border} flex items-center gap-1`}
          >
            <SeasonIcon className={`w-3 h-3 ${theme.primaryText}`} />
            <span
              className={`text-[10px] font-bold uppercase ${theme.primaryText}`}
            >
              {theme.name}
            </span>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {loading && (
          <p className="text-sm text-slate-500 mb-3">Loading addresses...</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Add New Address Card */}
          <button
            onClick={() => navigate("/add-address")}
            className={`
              min-h-[180px] rounded-2xl border-2 border-dashed ${theme.border} bg-white/40 hover:bg-white 
              flex flex-col items-center justify-center gap-3 group transition-all duration-300
              hover:shadow-md hover:scale-[1.02]
            `}
          >
            <div
              className={`p-4 rounded-full ${theme.accent} group-hover:scale-110 transition-transform duration-300`}
            >
              <Plus className={`w-8 h-8 ${theme.primaryText}`} />
            </div>
            <span className={`font-bold text-lg ${theme.primaryText}`}>
              Add New Address
            </span>
          </button>

          {/* Address Cards from backend */}
          {addresses.map((addr) => {
            const Icon = getIconByType(addr.address_type);
            const isSelected = !!addr.is_default;

            const line1 = addr.building || addr.Building || addr.name || "";
            const line2 = addr.street || addr.landmark || "";
            const city = addr.city || "";

            return (
              <div
                key={addr.address_id}
                onClick={() => setDefault(addr.address_id)}
                className={`
                  relative bg-white p-6 rounded-2xl shadow-sm border-2 cursor-pointer transition-all duration-300
                  hover:shadow-md hover:scale-[1.02] min-h-[180px] flex flex-col justify-between
                  ${
                    isSelected
                      ? `${theme.border} ring-1 ring-inset ${theme.primaryText}/20`
                      : "border-transparent hover:border-slate-200"
                  }
                `}
              >
                {/* Top Row: Icon + Type + Menu */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl ${
                        isSelected ? theme.accent : "bg-slate-100"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isSelected ? theme.primaryText : "text-slate-500"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">
                        {addr.address_type || "Other"}
                      </h3>
                      {isSelected && (
                        <span
                          className={`inline-block text-[10px] px-2 py-0.5 rounded-full ${theme.primary} text-white font-bold tracking-wide mt-1`}
                        >
                          DEFAULT
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(addr.address_id);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 -mr-2 -mt-2"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Address Text */}
                <div className="mt-4 pl-1">
                  <p className="text-slate-700 font-medium text-base">
                    {line1}
                  </p>
                  <p className="text-slate-500 text-sm mt-1">
                    {line2}
                    {line2 && city ? ", " : ""}
                    {city}
                  </p>
                </div>

                {/* Bottom Right Indicator */}
                <div className="absolute bottom-6 right-6">
                  {isSelected ? (
                    <div className="animate-in zoom-in duration-300">
                      <CheckCircle2
                        className={`w-6 h-6 ${theme.primaryText}`}
                      />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-slate-300" />
                  )}
                </div>

                {/* Dropdown Menu */}
                {activeMenu === addr.address_id && (
                  <div className="absolute top-12 right-4 bg-white shadow-xl rounded-xl border border-slate-100 z-20 w-40 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(null);
                        // Navigate to edit page and pass full address row
                        navigate("/edit-address", { state: { address: addr } });
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(addr.address_id);
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 flex items-center gap-3 transition"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SavedAddressesPage;
