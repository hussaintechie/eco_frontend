// src/pages/EditAddressPage.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Home,
  Briefcase,
  Navigation,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE = "http://192.168.56.1:5000";

// --- SEASON CONFIG ---
const SEASON_CONFIG = {
  winter: {
    gradient: "bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50",
    primary: "bg-indigo-600",
    primaryText: "text-indigo-600",
    light: "bg-indigo-50",
    border: "border-indigo-100",
  },
  summer: {
    gradient: "bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50",
    primary: "bg-orange-500",
    primaryText: "text-orange-600",
    light: "bg-orange-50",
    border: "border-orange-100",
  },
  spring: {
    gradient: "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50",
    primary: "bg-emerald-600",
    primaryText: "text-emerald-600",
    light: "bg-emerald-50",
    border: "border-emerald-100",
  },
  monsoon: {
    gradient: "bg-gradient-to-br from-slate-200 via-gray-100 to-slate-300",
    primary: "bg-teal-600",
    primaryText: "text-teal-600",
    light: "bg-teal-50",
    border: "border-teal-100",
  },
};

const getSeason = () => {
  const month = new Date().getMonth();
  if (month === 10 || month === 11 || month === 0) return "winter";
  if (month === 1 || month === 2) return "spring";
  if (month >= 3 && month <= 5) return "summer";
  return "monsoon";
};

const EditAddressPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = SEASON_CONFIG[getSeason()];

  // 👇 comes from navigate('/edit-address', { state: { address: {...} } })
  const addressState = location.state?.address;
  const addressId = addressState?.id;

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState("");

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line1: "",    // Building
    line2: "",    // Street / Area
    landmark: "",
    city: "",
    pin: "",
    type: "Home",
    lat: null,
    lon: null,
    isDefault: false,
  });

  const [mapCoords, setMapCoords] = useState({
    lat: 13.0678784,
    lng: 80.1767424,
  });

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const searchInputRef = useRef(null);

  const handleChange = (key, value) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
  };

  // ===================================================
  // 1️⃣ Load existing address from backend
  // ===================================================
  const loadAddressDetails = async () => {
    if (!addressId) {
      navigate("/addresses");
      return;
    }

    try {
      setLoadingPage(true);
      const res = await fetch(`${API_BASE}/auser/details/${addressId}`, {
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!data || data.status === 0) {
        alert(data.message || "Failed to load address");
        navigate("/addresses");
        return;
      }

      // data should be the address row
      setAddress({
        name: data.name || "",
        phone: data.phone || "",
        line1: data.Building || "",
        line2: data.street || "",
        landmark: data.landmark || "",
        city: data.city || "",
        pin: data.pincode || "",
        type: data.address_type || "Home",
        lat: data.lat || null,
        lon: data.lng || null,
        isDefault: data.is_default || false,
      });

      if (data.lat && data.lng) {
        setMapCoords({ lat: Number(data.lat), lng: Number(data.lng) });
      }

      setDetectedAddress(
        `${data.Building || ""}, ${data.street || ""}, ${data.city || ""}, ${
          data.pincode || ""
        }`.replaceAll(" ,", "").trim()
      );
    } catch (err) {
      console.error(err);
      alert("Error loading address");
      navigate("/addresses");
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    loadAddressDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===================================================
  // 2️⃣ Call backend autofill (same as Add page)
  // ===================================================
  const fetchAutofill = async (lat, lng) => {
    try {
      setLoadingLocation(true);

      const res = await fetch(
        `${API_BASE}/auser/autofill-location?lat=${lat}&lng=${lng}`
      );

      const data = await res.json();

      if (data.status === 1) {
        const a = data.parsed;

        setAddress((prev) => ({
          ...prev,
          lat,
          lon: lng,
          line1: a.building || prev.line1 || "",
          line2: a.area || a.street || prev.line2 || "",
          city: a.city || prev.city || "",
          pin: a.pincode || prev.pin || "",
        }));

        setDetectedAddress(data.address);
      } else {
        alert(data.message || "Failed to autofill");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching location details");
    } finally {
      setLoadingLocation(false);
    }
  };

  // ===================================================
  // 3️⃣ Init Google Map (Modal)
  // ===================================================
  useEffect(() => {
    if (!showMapModal) return;
    if (!window.google) {
      console.warn("Google Maps JS not loaded yet");
      return;
    }

    // Init map
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: mapCoords,
      zoom: 17,
      disableDefaultUI: true,
    });

    // Marker
    markerRef.current = new window.google.maps.Marker({
      position: mapCoords,
      map: mapInstanceRef.current,
      draggable: true,
    });

    // On marker drag end
    markerRef.current.addListener("dragend", (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMapCoords({ lat, lng });
      fetchAutofill(lat, lng);
    });

    // On map click
    mapInstanceRef.current.addListener("click", (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      markerRef.current.setPosition({ lat, lng });
      setMapCoords({ lat, lng });
      fetchAutofill(lat, lng);
    });

    // Search box
    const autocomplete = new window.google.maps.places.Autocomplete(
      searchInputRef.current,
      { types: ["geocode", "establishment"] }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      mapInstanceRef.current.setCenter({ lat, lng });
      markerRef.current.setPosition({ lat, lng });
      setMapCoords({ lat, lng });
      fetchAutofill(lat, lng);
    });
  }, [showMapModal, mapCoords]);

  // ===================================================
  // 4️⃣ Use Current Location
  // ===================================================
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Location not supported");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setMapCoords({ lat: latitude, lng: longitude });
        setShowMapModal(true);
        await fetchAutofill(latitude, longitude);
      },
      () => {
        alert("Location permission denied!");
        setLoadingLocation(false);
      }
    );
  };

  // ===================================================
  // 5️⃣ SAVE EDITED ADDRESS
  // ===================================================
  const saveAddress = async () => {
    try {
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
        is_default: address.isDefault,
      };

      const res = await fetch(`${API_BASE}/auser/edit/${addressId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === 1) {
        alert("Address updated successfully!");
        navigate("/addresses");
      } else {
        alert(data.message || "Failed to update address");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving address");
    }
  };

  if (!addressId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Invalid address. Go back and try again.</p>
      </div>
    );
  }

  if (loadingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Loading address…</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.gradient} pb-20 font-sans`}>
      {/* HEADER */}
      <div className="bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="font-bold text-lg text-slate-800">
            Edit Address
          </h1>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="md:col-span-7 space-y-6">
            {/* MAP & LOCATION */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="font-bold text-slate-800 text-lg mb-3">
                Delivery Location
              </h3>

              <button
                onClick={() => setShowMapModal(true)}
                className="w-full p-3 rounded-xl border-2 border-dashed text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Choose on Map
              </button>

              <button
                onClick={getCurrentLocation}
                className="mt-3 w-full p-2.5 rounded-xl text-xs border text-slate-600 hover:bg-slate-50"
              >
                {loadingLocation ? "Detecting location..." : "Use Current Location"}
              </button>

              {detectedAddress && (
                <div className="mt-4 text-xs text-slate-600 bg-slate-50 rounded-xl p-3">
                  <div className="font-semibold text-slate-800 mb-1">
                    Selected Address
                  </div>
                  <div>{detectedAddress}</div>
                </div>
              )}
            </div>

            {/* CONTACT + ADDRESS */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              {/* CONTACT */}
              <h3 className="font-bold text-slate-800 text-lg mb-6">
                Contact Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-400">
                    Full Name
                  </label>
                  <input
                    className="w-full p-3 rounded-xl bg-slate-50 border"
                    placeholder="e.g. Alex Johnson"
                    value={address.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400">
                    Phone Number
                  </label>
                  <input
                    className="w-full p-3 rounded-xl bg-slate-50 border"
                    placeholder="9876543210"
                    value={address.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
              </div>

              {/* ADDRESS */}
              <h3 className="font-bold text-slate-800 text-lg mt-8 mb-6">
                Address Details
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-400">
                    House / Flat / Building
                  </label>
                  <input
                    className="w-full p-3 rounded-xl bg-slate-50 border"
                    placeholder="Flat 402, Rose Apartments"
                    value={address.line1}
                    onChange={(e) => handleChange("line1", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400">
                    Area / Street
                  </label>
                  <input
                    className="w-full p-3 rounded-xl bg-slate-50 border"
                    placeholder="Market Road, Sector 14"
                    value={address.line2}
                    onChange={(e) => handleChange("line2", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400">
                    Landmark (optional)
                  </label>
                  <input
                    className="w-full p-3 rounded-xl bg-slate-50 border"
                    placeholder="Near temple, shop, school"
                    value={address.landmark}
                    onChange={(e) => handleChange("landmark", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-400">
                      City
                    </label>
                    <input
                      className="w-full p-3 rounded-xl bg-slate-50 border"
                      placeholder="Chennai"
                      value={address.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400">
                      Pincode
                    </label>
                    <input
                      className="w-full p-3 rounded-xl bg-slate-50 border"
                      placeholder="600001"
                      value={address.pin}
                      onChange={(e) => handleChange("pin", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-24">
              <div className="flex gap-3 mb-6">
                {[
                  { label: "Home", icon: Home },
                  { label: "Work", icon: Briefcase },
                  { label: "Other", icon: Navigation },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleChange("type", item.label)}
                    className={`flex-1 p-3 rounded-xl border ${
                      address.type === item.label
                        ? theme.primaryText + " font-bold"
                        : "text-slate-500"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mx-auto" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={saveAddress}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg ${theme.primary}`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAP MODAL */}
      {showMapModal && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40">
          <div className="bg-white w-full max-w-xl rounded-t-3xl p-4 pb-6 shadow-xl">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4"></div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-slate-800">
                Choose Location on Map
              </h2>
              <button
                onClick={() => setShowMapModal(false)}
                className="px-3 py-1 text-base bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Close
              </button>
            </div>

            <input
              ref={searchInputRef}
              placeholder="Search for apartment, street..."
              className="w-full p-2.5 mb-3 rounded-xl border text-sm"
            />

            <div
              ref={mapRef}
              className="w-full h-64 rounded-2xl border overflow-hidden"
            ></div>

            {detectedAddress && (
              <p className="mt-3 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">
                  Selected Location:
                </span>{" "}
                {detectedAddress}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditAddressPage;
