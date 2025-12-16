// src/pages/EditAddressPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Home, Briefcase, Navigation } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/auth";
import { editAddressAPI } from "../api/addressAPI";

/* ---------------- SEASON CONFIG ---------------- */
const SEASON_CONFIG = {
  winter: {
    gradient: "bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50",
    primary: "bg-indigo-600",
    primaryText: "text-indigo-600",
  },
  summer: {
    gradient: "bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50",
    primary: "bg-orange-500",
    primaryText: "text-orange-600",
  },
  spring: {
    gradient: "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50",
    primary: "bg-emerald-600",
    primaryText: "text-emerald-600",
  },
  monsoon: {
    gradient: "bg-gradient-to-br from-slate-200 via-gray-100 to-slate-300",
    primary: "bg-teal-600",
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

  useEffect(() => {
    if (!original) navigate("/addresses");
  }, [original, navigate]);

  const [detectedAddress, setDetectedAddress] = useState("");

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

  const handleChange = (k, v) =>
    setAddress((p) => ({ ...p, [k]: v }));

  /* ---------------- AUTOFILL ---------------- */
  const fetchAutofill = async (lat, lng) => {
    const res = await API.get("/auser/autofill-location", {
      params: { lat, lng },
    });

    if (res.data.status === 1) {
      const a = res.data.parsed;
      setAddress((p) => ({
        ...p,
        lat,
        lon: lng,
        line1: a.building || p.line1,
        line2: a.area || a.street || p.line2,
        city: a.city || p.city,
        pin: a.pincode || p.pin,
      }));
      setDetectedAddress(res.data.address);
    }
  };

  /* ---------------- MAP INIT ---------------- */
  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    const lat = Number(original?.lat) || 13.0678784;
    const lng = Number(original?.lng) || 80.1767424;

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 17,
      disableDefaultUI: true,
    });

    markerRef.current = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
      draggable: true,
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
      fetchAutofill(
        p.geometry.location.lat(),
        p.geometry.location.lng()
      );
    });
  }, [original]);

  /* ---------------- CURRENT LOCATION ---------------- */
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((p) =>
      fetchAutofill(p.coords.latitude, p.coords.longitude)
    );
  };

  /* ---------------- SAVE ---------------- */
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

    const { data } = await editAddressAPI(
      original.address_id,
      payload
    );

    if (data.status === 1) {
      alert("Address updated successfully!");
      navigate("/addresses");
    }
  };

  return (
    <div className={`min-h-screen ${theme.gradient} pb-20`}>

      {/* HEADER */}
      <div className="bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-lg">Edit Address</h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* LEFT */}
        <div className="md:col-span-7 space-y-6">

          {/* MAP */}
          <div className="bg-white/80 backdrop-blur rounded-3xl shadow-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg">Edit Location</h3>
             <button
  onClick={getCurrentLocation}
  className="
    text-xs font-medium
    px-4 py-3
    rounded-xl
    bg-white/70 backdrop-blur
    border border-slate-200
    text-slate-700
    shadow-sm
    hover:bg-white
    hover:shadow-md
    transition-all
  "
>
  📍 Use Current Location
</button>


            </div>

            <input
              ref={searchInputRef}
              className="w-full mb-3 p-3 border rounded-2xl"
              placeholder="Search apartment, street..."
            />

            <div
              ref={mapRef}
              className="h-80 rounded-3xl border shadow-inner"
            />

            {detectedAddress && (
              <div className="mt-4 text-xs bg-slate-50 p-3 rounded-xl">
                <b>Selected:</b> {detectedAddress}
              </div>
            )}
          </div>

          {/* FORM */}
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
            {[
              ["Full Name", "name"],
              ["Phone Number", "phone"],
              ["House / Building", "line1"],
              ["Street / Area", "line2"],
              ["Landmark", "landmark"],
              ["City", "city"],
              ["Pincode", "pin"],
            ].map(([label, key]) => (
              <div key={key}>
                <label className="text-xs font-semibold text-slate-500">
                  {label}
                </label>
                <input
                  value={address[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full p-3 rounded-xl border bg-slate-50"
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:col-span-5">
          <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl p-6 sticky top-24">

            <h3 className="font-bold text-lg mb-4">Address Type</h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
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
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition
                      ${
                        active
                          ? `${theme.primary} text-white shadow-xl scale-105`
                          : "bg-white hover:bg-slate-50 text-slate-600"
                      }`}
                  >
                    <item.icon className="w-6 h-6" />
                    <span className="text-xs font-semibold">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={saveEditedAddress}
              className={`w-full py-4 rounded-2xl text-white font-bold text-lg ${theme.primary} shadow-lg hover:shadow-xl`}
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditAddressPage;
