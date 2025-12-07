import React, { useState, useRef, useEffect } from "react";
 import API from "../api/auth";
import {
  ArrowLeft,
  Home,
  Briefcase,
  Navigation,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const AddNewAddressPage = () => {
  const navigate = useNavigate();
  const theme = SEASON_CONFIG[getSeason()];

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState("");

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line1: "", // House / Building (can be auto from building, user editable)
    line2: "", // Area / Street
    landmark: "",
    city: "",
    pin: "",
    type: "Home",
    lat: null,
    lon: null,
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

  // ===========================
  //  BACKEND AUTOFILL CALL
  // ===========================
  const fetchAutofill = async (lat, lng) => {
    try {
      setLoadingLocation(true);

      const res = await fetch(
        `http://192.168.56.1:5000/auser/autofill-location?lat=${lat}&lng=${lng}`
      );

      const data = await res.json();

      if (data.status === 1) {
        const a = data.parsed;

        setAddress((prev) => ({
          ...prev,
          lat,
          lon: lng,
          line1: a.building || "",                // Building / Apartment
          line2: a.area || a.street || "",        // Area / Street
          city: a.city || "",
          pin: a.pincode || "",
          // landmark stays typed by user
        }));

        setDetectedAddress(data.address); // full address string
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

  // ===========================
  //  GOOGLE MAP INIT IN MODAL
  // ===========================
  useEffect(() => {
    if (!showMapModal) return;
    if (!window.google) return;

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

    // On map click → move pin
    mapInstanceRef.current.addListener("click", (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      markerRef.current.setPosition({ lat, lng });
      setMapCoords({ lat, lng });
      fetchAutofill(lat, lng);
    });

    // Autocomplete box
    const autocomplete = new window.google.maps.places.Autocomplete(
      searchInputRef.current,
      {
        types: ["geocode", "establishment"],
      }
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
  }, [showMapModal]); // re-init when modal opens

  // ===========================
  //  USE CURRENT LOCATION
  // ===========================
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
        setShowMapModal(true);       // open map modal
        await fetchAutofill(latitude, longitude);
      },
      () => {
        alert("Location permission denied!");
        setLoadingLocation(false);
      }
    );
  };

  // ===========================
  //  SAVE ADDRESS → BACKEND
  // ===========================


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
      is_default: false,
    };

    const { data } = await API.post("/auser/add", payload);

    if (data.status === 1) {
      alert("Address added successfully!");
      navigate("/addresses");
    } else {
      alert(data.message || "Failed to save address");
    }
  } catch (err) {
    console.error(err);
    alert("Error saving address");
  }
};

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
            Add New Address
          </h1>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* LEFT SECTION */}
          <div className="md:col-span-7 space-y-6">

            {/* MAP TRIGGER + PREVIEW */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h3 className="font-bold text-slate-800 text-lg mb-3">
                Delivery Location
              </h3>

              <button
                onClick={() => setShowMapModal(true)}
                className="w-full p-3 rounded-xl border-2 border-dashed text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {loadingLocation ? "Detecting location..." : "Choose on Map"}
              </button>

              <button
                onClick={getCurrentLocation}
                className="mt-3 w-full p-2.5 rounded-xl text-xs border text-slate-600 hover:bg-slate-50"
              >
                Use Current Location
              </button>

              {detectedAddress && (
                <div className="mt-4 text-xs text-slate-600 bg-slate-50 rounded-xl p-3">
                  <div className="font-semibold text-slate-800 mb-1">
                    Detected Address
                  </div>
                  <div>{detectedAddress}</div>
                </div>
              )}
            </div>

            {/* CONTACT + ADDRESS FORM (your original UI) */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              {/* CONTACT DETAILS */}
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

              {/* ADDRESS DETAILS */}
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
                      placeholder="Bangalore"
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
                      placeholder="560001"
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
                Save Address
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

export default AddNewAddressPage;
