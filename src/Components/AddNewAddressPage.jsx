import React, { useState, useRef, useEffect } from "react";
import API from "../api/auth";
import { ArrowLeft, Home, Briefcase, Navigation, MapPin, Search, Crosshair } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ---------------- SEASON CONFIG (Unchanged) ---------------- */
const SEASON_CONFIG = {
  winter: {
    gradient: "bg-slate-50", // Simplified for cleaner look
    primary: "bg-indigo-600",
    primaryRing: "focus:ring-indigo-600",
    primaryText: "text-indigo-600",
  },
  summer: {
    gradient: "bg-orange-50",
    primary: "bg-orange-500",
    primaryRing: "focus:ring-orange-500",
    primaryText: "text-orange-600",
  },
  spring: {
    gradient: "bg-emerald-50",
    primary: "bg-emerald-600",
    primaryRing: "focus:ring-emerald-600",
    primaryText: "text-emerald-600",
  },
  monsoon: {
    gradient: "bg-teal-50",
    primary: "bg-teal-600",
    primaryRing: "focus:ring-teal-600",
    primaryText: "text-teal-600",
  },
};

const getSeason = () => {
  const m = new Date().getMonth();
  if ([10, 11, 0].includes(m)) return "winter";
  if ([1, 2].includes(m)) return "spring";
  if (m >= 3 && m <= 5) return "summer";
  return "monsoon";
};

const AddNewAddressPage = () => {
  const navigate = useNavigate();
  const theme = SEASON_CONFIG[getSeason()];

  const [detectedAddress, setDetectedAddress] = useState("");
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    landmark: "",
    city: "",
    pin: "",
    type: "Home",
    lat: null,
    lon: null,
  });

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const searchInputRef = useRef(null);

  const handleChange = (k, v) => setAddress((p) => ({ ...p, [k]: v }));

  /* ---------------- AUTOFILL ---------------- */
  const fetchAutofill = async (lat, lng) => {
    // Ideally add a loading state here if you want
    try {
      const { data } = await API.get(
        `/auser/autofill-location?lat=${lat}&lng=${lng}`
      );

      if (data.status === 1) {
        const a = data.parsed;
        setAddress((p) => ({
          ...p,
          lat,
          lon: lng,
          line1: a.building || "",
          line2: a.area || a.street || "",
          city: a.city || "",
          pin: a.pincode || "",
        }));
        setDetectedAddress(data.address);
      }
    } catch (error) {
      console.error("Autofill error", error);
    }
  };

  /* ---------------- MAP INIT ---------------- */
  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 13.0678784, lng: 80.1767424 },
      zoom: 17,
      disableDefaultUI: true,
      zoomControl: false, // Cleaner look
    });

    markerRef.current = new window.google.maps.Marker({
      position: { lat: 13.0678784, lng: 80.1767424 },
      map: mapInstanceRef.current,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    });

    markerRef.current.addListener("dragend", (e) =>
      fetchAutofill(e.latLng.lat(), e.latLng.lng())
    );

    mapInstanceRef.current.addListener("click", (e) => {
      markerRef.current.setPosition(e.latLng);
      fetchAutofill(e.latLng.lat(), e.latLng.lng());
    });

    const ac = new window.google.maps.places.Autocomplete(
      searchInputRef.current,
      { types: ["geocode", "establishment"] }
    );

    ac.addListener("place_changed", () => {
      const p = ac.getPlace();
      if (!p.geometry) return;
      markerRef.current.setPosition(p.geometry.location);
      mapInstanceRef.current.setCenter(p.geometry.location);
      fetchAutofill(p.geometry.location.lat(), p.geometry.location.lng());
    });
  }, []);

  /* ---------------- CURRENT LOCATION ---------------- */
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((p) => {
        const pos = { lat: p.coords.latitude, lng: p.coords.longitude };
        mapInstanceRef.current.setCenter(pos);
        markerRef.current.setPosition(pos);
        fetchAutofill(p.coords.latitude, p.coords.longitude);
      });
    }
  };

  /* ---------------- SAVE ---------------- */
  const saveAddress = async () => {
    // Basic Validation
    if(!address.line1 || !address.phone) return alert("Please fill mandatory fields");

    const payload = {
      name: address.name,
      phone: address.phone,
      Building: address.line1,
      street: address.line2,
      landmark: address.landmark,
      city: address.city,
      pincode: address.pin,
      address_type: address.type,
      lat: address.lat,
      lng: address.lon,
      is_default: false,
      full_address: detectedAddress,
    };

    try {
        const { data } = await API.post("/auser/add", payload);
        if (data.status === 1) navigate("/addresses");
    } catch (e) {
        console.error(e);
    }
  };

  // Field configuration for cleaner loop
  const formFields = [
    { label: "Full Name", key: "name", colSpan: "col-span-2" },
    { label: "Phone Number", key: "phone", colSpan: "col-span-2" },
    { label: "House / Building", key: "line1", colSpan: "col-span-2 md:col-span-1" },
    { label: "Street / Area", key: "line2", colSpan: "col-span-2 md:col-span-1" },
    { label: "Landmark", key: "landmark", colSpan: "col-span-2" },
    { label: "City", key: "city", colSpan: "col-span-1" },
    { label: "Pincode", key: "pin", colSpan: "col-span-1" },
  ];

  return (
    <div className={`min-h-screen ${theme.gradient} font-sans text-slate-800`}>
      {/* HEADER */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <h1 className="font-bold text-xl tracking-tight">Add New Address</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: MAP (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white p-1 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
              
              {/* Map Search Overlay */}
              <div className="absolute top-4 left-4 right-4 z-10">
                <div className="relative shadow-lg rounded-xl">
                  <div className="absolute left-3 top-3 text-slate-400">
                    <Search size={18} />
                  </div>
                  <input
                    ref={searchInputRef}
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-sm font-medium outline-none focus:ring-2 ring-indigo-500/20 text-slate-700 placeholder:text-slate-400"
                    placeholder="Search location..."
                  />
                </div>
              </div>

              {/* Map Container */}
              <div ref={mapRef} className="h-[450px] w-full rounded-2xl bg-slate-100" />

              {/* Current Location Button Overlay */}
              <button
                onClick={getCurrentLocation}
                className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg text-slate-700 hover:text-indigo-600 hover:scale-110 transition-all z-10"
                title="Use Current Location"
              >
                <Crosshair size={22} />
              </button>

              {/* Center Pin Indicator (Visual Helper) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-0 group-hover:opacity-50 transition-opacity">
                 <MapPin size={40} className={`fill-current ${theme.primaryText} mb-8`} />
              </div>
            </div>
            
            {detectedAddress && (
                <div className="bg-white/60 backdrop-blur border border-slate-200 p-4 rounded-xl text-sm text-slate-600 flex gap-3 items-start">
                  <MapPin className={`shrink-0 mt-0.5 ${theme.primaryText}`} size={16} />
                  <span>{detectedAddress}</span>
                </div>
            )}
          </div>

          {/* RIGHT COLUMN: FORM */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
              
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-lg font-bold text-slate-800">Address Details</h2>
                 <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-500">Auto-filled</span>
              </div>

              {/* Address Type Selector */}
              <div className="mb-8">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Address Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Home", icon: Home },
                    { label: "Work", icon: Briefcase },
                    { label: "Other", icon: Navigation },
                  ].map((item) => {
                    const active = address.type === item.label;
                    return (
                      <button
                        key={item.label}
                        onClick={() => handleChange("type", item.label)}
                        className={`
                          flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-semibold transition-all duration-200
                          ${active 
                            ? `${theme.primary} border-transparent text-white shadow-md shadow-indigo-200` 
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                          }
                        `}
                      >
                        <item.icon size={16} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inputs Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                {formFields.map(({ label, key, colSpan }) => (
                  <div key={key} className={colSpan}>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">
                      {label}
                    </label>
                    <input
                      value={address[key] || ""} // CRITICAL FIX: Controlled input
                      onChange={(e) => handleChange(key, e.target.value)}
                      className={`
                        w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 
                        text-slate-700 text-sm font-medium transition-all
                        focus:bg-white focus:border-transparent focus:outline-none focus:ring-2 ${theme.primaryRing}
                        placeholder:text-slate-400
                      `}
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <button
                    onClick={saveAddress}
                    className={`
                        w-full py-4 rounded-xl text-white font-bold text-lg shadow-xl shadow-indigo-100 
                        ${theme.primary} hover:opacity-90 active:scale-[0.98] transition-all
                    `}
                >
                    Save Address
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddNewAddressPage;