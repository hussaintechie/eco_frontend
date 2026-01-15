// src/pages/EditAddressPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Home, Briefcase, Navigation, MapPin, Search, Crosshair } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/auth";
import { editAddressAPI } from "../api/addressAPI";

/* ---------------- SEASON CONFIG ---------------- */
const SEASON_CONFIG = {
  winter: {
    gradient: "bg-slate-50",
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

const EditAddressPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const theme = SEASON_CONFIG[getSeason()];
  const original = state?.address;

  // Redirect if no data passed
  useEffect(() => {
    if (!original) navigate("/addresses");
  }, [original, navigate]);

  const [detectedAddress, setDetectedAddress] = useState("");
  
  // Initialize state with ORIGINAL data
  const [address, setAddress] = useState({
    name: original?.name || "",
    phone: original?.phone || "",
    line1: original?.building || original?.Building || "",
    line2: original?.street || "",
    landmark: original?.landmark || "",
    city: original?.city || "",
    pin: original?.pincode || "",
    type: original?.address_type || "Home",
    lat: original?.lat || null,
    lon: original?.lng || null,
  });

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const searchInputRef = useRef(null);

  const handleChange = (k, v) => setAddress((p) => ({ ...p, [k]: v }));

  /* ---------------- AUTOFILL ---------------- */
  const fetchAutofill = async (lat, lng) => {
    try {
      const { data } = await API.get("/auser/autofill-location", {
        params: { lat, lng },
      });

      if (data.status === 1) {
        const a = data.parsed;
        setAddress((p) => ({
          ...p,
          lat,
          lon: lng,
          line1: a.building || p.line1, // Keep existing if API returns null
          line2: a.area || a.street || p.line2,
          city: a.city || p.city,
          pin: a.pincode || p.pin,
        }));
        setDetectedAddress(data.address);
      }
    } catch (e) {
      console.error("Autofill error", e);
    }
  };

  /* ---------------- MAP INIT ---------------- */
  useEffect(() => {
    if (!mapRef.current || !window.google || !original) return;

    // Use Saved Coordinates or Default
    const startLat = Number(original.lat) || 13.0678784;
    const startLng = Number(original.lng) || 80.1767424;

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: startLat, lng: startLng },
      zoom: 17,
      disableDefaultUI: true,
      zoomControl: false,
    });

    markerRef.current = new window.google.maps.Marker({
      position: { lat: startLat, lng: startLng },
      map: mapInstanceRef.current,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    });

    // Listeners
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
  }, [original]); // Re-run if original data loads late

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

  /* ---------------- SAVE (EDIT MODE) ---------------- */
  const saveEditedAddress = async () => {
    const payload = {
      address_type: address.type,
      name: address.name,
      phone: address.phone,
      pincode: address.pin,
      Building: address.line1,
      street: address.line2,
      landmark: address.landmark,
      city: address.city,
      lat: address.lat,
      lng: address.lon,
    };

    try {
        const { data } = await editAddressAPI(original.address_id, payload);
        if (data.status === 1) {
            // alert("Address updated successfully!"); // Optional: prefer toast or direct nav
            navigate("/addresses");
        }
    } catch (e) {
        console.error("Save error", e);
    }
  };

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
          <h1 className="font-bold text-xl tracking-tight">Edit Address</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: MAP (Sticky) */}
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

              {/* Current Location Button */}
              <button
                onClick={getCurrentLocation}
                className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg text-slate-700 hover:text-indigo-600 hover:scale-110 transition-all z-10"
                title="Use Current Location"
              >
                <Crosshair size={22} />
              </button>

               {/* Center Pin Indicator */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-0 group-hover:opacity-50 transition-opacity">
                 <MapPin size={40} className={`fill-current ${theme.primaryText} mb-8`} />
              </div>
            </div>
            
            {/* Show detected address if map moved */}
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
                 <h2 className="text-lg font-bold text-slate-800">Edit Details</h2>
                 <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-500">Editing Mode</span>
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
                      value={address[key] || ""} // Controlled Input
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
                    onClick={saveEditedAddress}
                    className={`
                        w-full py-4 rounded-xl text-white font-bold text-lg shadow-xl shadow-indigo-100 
                        ${theme.primary} hover:opacity-90 active:scale-[0.98] transition-all
                    `}
                >
                    Save Changes
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditAddressPage;