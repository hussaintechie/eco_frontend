import React, { useState, useEffect } from "react";
import {
  ArrowLeft, Home, ChevronDown, Minus, Plus, Wallet, ChevronRight, X,
  Snowflake, Sun, CloudRain, Flower2, BellOff, DoorOpen, Phone,
  CreditCard, Smartphone, FileText, ShieldCheck, AlertCircle,
  Briefcase, MapPin, PlusCircle, CheckCircle2
} from "lucide-react";

import { SEASON_CONFIG, getSeason } from "../SEASON_CONFIG.jsx";
import {
  getCartAPI,
  getCartBillAPI,
  getDeliverySlotsAPI,
  updateCartQtyAPI
} from "../api/cartapi.js";

// ------------------------------------------------
// STATIC DATA (UI-ONLY SECTIONS)
// ------------------------------------------------
const savedAddresses = [
  { id: 1, type: "Home", address: "19, MGR University Road, VGP Ambattur", icon: Home },
  { id: 2, type: "Work", address: "Tech Park, 4th Floor, OMR Road, Chennai", icon: Briefcase },
  { id: 3, type: "Other", address: "Flat 4B, Green Valley Apts, Adyar", icon: MapPin },
];

const bestsellers = [
  {
    name: "Banana - Yelakki",
    weight: "500 g",
    price: 42,
    oldPrice: 69,
    discount: "39% OFF",
    img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=150&q=80"
  },
  {
    name: "Onion",
    weight: "2 kg",
    price: 68,
    oldPrice: 94,
    discount: "28% OFF",
    img: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=150&q=80"
  },
  {
    name: "Tomato - Local",
    weight: "1 kg",
    price: 66,
    oldPrice: 83,
    discount: "20% OFF",
    img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=150&q=80"
  },
  {
    name: "Potato",
    weight: "1 kg",
    price: 45,
    oldPrice: 60,
    discount: "25% OFF",
    img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=150&q=80"
  },
];





const instructionOptions = [
  { id: 1, label: "Avoid Ringing Bell", icon: <BellOff size={24} /> },
  { id: 2, label: "Leave at Door", icon: <DoorOpen size={24} /> },
  { id: 3, label: "Call on Arrival", icon: <Phone size={24} /> }
];

const paymentOptions = [
  { id: "cod", name: "Pay on delivery", desc: "Cash or UPI upon delivery", icon: Wallet },
  { id: "upi", name: "UPI", desc: "Google Pay, PhonePe, Paytm", icon: Smartphone },
  { id: "card", name: "Credit / Debit Card", desc: "Visa, Mastercard, Rupay", icon: CreditCard },
];

// ------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------
const cartpage = () => {
  // Season / theme
  // Season / theme
const [currentSeason, setCurrentSeason] = useState("spring");
const [theme, setTheme] = useState(SEASON_CONFIG.spring);

// Delivery slots
const [todaySlots, setTodaySlots] = useState([]);
const [tomorrowSlots, setTomorrowSlots] = useState([]);
const [slotMessage, setSlotMessage] = useState("");

// Backend data
const [cart, setCart] = useState([]);
const [bill, setBill] = useState(null);
const [dates, setDates] = useState([]);

// UI states
const [showSlotModal, setShowSlotModal] = useState(false);
const [showInstructionModal, setShowInstructionModal] = useState(false);
const [showPaymentModal, setShowPaymentModal] = useState(false);
const [showAddressModal, setShowAddressModal] = useState(false);

// Selections
const [selectedDate, setSelectedDate] = useState("Today");
const [selectedSlot, setSelectedSlot] = useState("");
const [selectedInstruction, setSelectedInstruction] = useState("");
const [customInstruction, setCustomInstruction] = useState("");
const [selectedPayment, setSelectedPayment] = useState(paymentOptions[0]);
const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0]);
const [slots, setSlots] = useState([]);



  // On mount: season + load data
useEffect(() => {
  const season = getSeason();
  setCurrentSeason(season);
  setTheme(SEASON_CONFIG[season]);

  // 🔹 Generate next 4 days dynamically
  const today = new Date();
  const newDates = [];

  for (let i = 0; i < 4; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);

    let label;
    if (i === 0) label = "Today";
    else if (i === 1) label = "Tomorrow";
    else {
      label = d.toLocaleDateString("en-IN", { weekday: "long" }); // e.g. Thursday
    }

    const sub = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }); // e.g. 10 Dec

    newDates.push({ label, sub, date: d });
  }

  setDates(newDates);

  loadCart();
  loadBill();
  loadSlots();
}, []);


  // -------------------------------
  // API LOAD FUNCTIONS
  // -------------------------------
  const loadCart = async () => {
    try {
      const res = await getCartAPI();
      setCart(res.data.cart || []);
    } catch (err) {
      console.error("Error loading cart:", err);
    }
  };

  const loadBill = async () => {
    try {
      const res = await getCartBillAPI();
      setBill(res.data.bill);
    } catch (err) {
      console.error("Error loading bill:", err);
    }
  };

 const loadSlots = async () => {
  try {
    const res = await getDeliverySlotsAPI();

    setTodaySlots(res.data.today || []);
    setTomorrowSlots(res.data.tomorrow || []);
    setSlotMessage(res.data.message || "");

  } catch (err) {
    console.error("Error loading slots:", err);
  }
};
useEffect(() => {
  if (selectedDate === "Today") {
    setSlots(todaySlots);
  } else if (selectedDate === "Tomorrow") {
    setSlots(tomorrowSlots);
  } else {
    setSlots([]); 
  }
}, [selectedDate, todaySlots, tomorrowSlots]);


  // -------------------------------
  // UPDATE QTY
  // -------------------------------
  const updateQty = async (cart_id, qty) => {
    if (qty < 1) return;
    try {
      await updateCartQtyAPI(cart_id, qty);
      await loadCart();
      await loadBill();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // -------------------------------
  // BILL CALCULATIONS
  // -------------------------------
  const itemTotal = bill?.item_total || 0;
  const handlingFee = bill?.handling_fee || 0;
  const deliveryFee = bill?.delivery_fee || 0;
  const toPay = bill?.to_pay || 0;
  const MIN_ORDER_VALUE = bill?.minimum_order || 200;
  const amountNeeded = bill?.remaining_amount || 0;
  const canPlaceOrder = amountNeeded === 0;

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <div className={`min-h-screen font-sans ${theme.gradient} transition-colors duration-500`}>
      {/* HEADER */}
      <div className="bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <ArrowLeft className="w-6 h-6 text-slate-700 cursor-pointer" />
              <div>
                <h1 className="font-bold text-lg text-slate-800 leading-tight">Checkout</h1>

                {/* Dynamic Address in Header */}
                <div
                  className="flex items-center gap-1 text-xs text-slate-500 hidden md:flex cursor-pointer hover:text-slate-700"
                  onClick={() => setShowAddressModal(true)}
                >
                  <selectedAddress.icon className="w-3 h-3" />
                  <span className="truncate max-w-[220px]">
                    {selectedAddress.type} • {selectedAddress.address}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Season badge */}
            <div className="flex items-center gap-4">
              <div
                className={`px-3 py-1.5 rounded-full ${theme.light} border ${theme.border} flex items-center gap-2`}
              >
                <theme.icon className={`w-4 h-4 ${theme.primaryText}`} />
                <span className={`text-xs font-bold uppercase ${theme.primaryText}`}>
                  {theme.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile header address */}
        <div
          className="md:hidden px-4 pb-2 text-xs text-slate-500 flex items-center gap-1 cursor-pointer"
          onClick={() => setShowAddressModal(true)}
        >
          <selectedAddress.icon className="w-3 h-3" />
          <span className="truncate">{selectedAddress.type} • {selectedAddress.address}</span>
        </div>

        {/* Congrats strip */}
       
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pb-32 lg:pb-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* ADDRESS CARD */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-700 text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-slate-400" />
                Delivery Address
              </h3>
              <button
                onClick={() => setShowAddressModal(true)}
                className={`text-xs font-bold ${theme.primaryText} uppercase hover:underline`}
              >
                Change
              </button>
            </div>

            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${theme.light} shrink-0`}>
                <selectedAddress.icon className={`w-6 h-6 ${theme.primaryText}`} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{selectedAddress.type}</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  {selectedAddress.address}
                </p>
               
              </div>
            </div>
          </div>

          {/* BAG TOGGLE */}
         
          {/* DELIVERY PREFERENCE */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-end mb-4">
              <h3 className="font-bold text-slate-700 text-lg">Delivery Preference</h3>
              <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                {cart.length} Item{cart.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div
              onClick={() => setShowSlotModal(true)}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-slate-300 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition">
                  <theme.icon className={`w-5 h-5 ${theme.primaryText}`} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">
                    Scheduled For
                  </p>
                  <p className={`text-sm font-bold ${theme.primaryText}`}>
                    {selectedSlot || "Select a slot"}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
            </div>

            <button
              onClick={() => setShowInstructionModal(true)}
              className="mt-3 text-xs font-semibold text-slate-600 underline flex items-center gap-1"
            >
              <FileText className="w-3 h-3" />
              Add delivery instructions (optional)
            </button>
          </div>

          {/* CART ITEMS */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-700 mb-4 text-lg">Your Items</h3>

            {cart.length === 0 && (
              <p className="text-sm text-slate-500">Your cart is empty.</p>
            )}

            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.cart_id}
                  className="flex gap-4 items-start border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
                >
                  {/* IMAGE */}
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-100"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {item.product_name}
                        </p>
                        {item.weight && (
                          <p className="text-xs text-slate-500 mt-1">
                            {item.weight}
                          </p>
                        )}
                      </div>
                      <p className="font-bold text-slate-800">₹{item.price}</p>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <div
                        className={`flex items-center rounded-lg ${theme.primary} text-white font-bold h-8 shadow-md`}
                      >
                        {/* Decrease */}
                        <button
                          onClick={() => updateQty(item.cart_id, item.quantity - 1)}
                          className="px-3 h-full hover:bg-black/10 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <span className="px-2 text-sm min-w-[20px] text-center">
                          {item.quantity}
                        </span>

                        {/* Increase */}
                        <button
                          onClick={() => updateQty(item.cart_id, item.quantity + 1)}
                          className="px-3 h-full hover:bg-black/10 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BESTSELLERS SECTION */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-800">Before you checkout</h3>
            </div>

            <div className="flex md:grid md:grid-cols-4 overflow-x-auto md:overflow-visible gap-4 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              {bestsellers.map((item, idx) => (
                <div
                  key={idx}
                  className="min-w-[150px] bg-white rounded-xl border border-slate-100 shadow-sm p-3 relative flex-shrink-0 group hover:shadow-md transition"
                >
                  <span
                    className={`absolute top-0 left-0 ${theme.primary} text-white text-[10px] font-bold px-2 py-1 rounded-tl-xl rounded-br-xl shadow-sm`}
                  >
                    {item.discount}
                  </span>
                  <div className="h-28 w-full flex items-center justify-center mb-2">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-24 object-contain group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <p className="font-bold text-xs text-slate-700 mb-1 line-clamp-2 h-8">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-slate-400">{item.weight}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="font-bold text-sm">₹{item.price}</p>
                      <p className="text-[10px] text-slate-400 line-through">
                        ₹{item.oldPrice}
                      </p>
                    </div>
                    <button
                      className={`p-2 rounded-lg border ${theme.border} ${theme.light} ${theme.primaryText} hover:brightness-95 text-xs font-semibold`}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN – BILL CARD + DESKTOP CTA */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* BILL CARD */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h4 className="font-bold text-slate-800 text-lg mb-4">Bill Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Item Total</span>
                  <span>₹{itemTotal}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Handling Fee</span>
                  <span>₹{handlingFee}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Delivery Fee</span>
                  <span className={`${theme.primaryText} font-semibold`}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>

                {/* Minimum Order Warning */}
                {!canPlaceOrder && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs flex items-start gap-2 mt-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      Minimum order value is ₹{MIN_ORDER_VALUE}. Add items worth ₹
                      {amountNeeded} to place order.
                    </span>
                  </div>
                )}
              </div>
              <div className="h-px bg-slate-100 my-4" />
              <div className="flex justify-between text-lg font-bold text-slate-800">
                <span>To Pay</span>
                <span>₹{toPay}</span>
              </div>
            </div>

            {/* DESKTOP PAYMENT + CTA */}
            <div className="hidden lg:block bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div
                onClick={() => canPlaceOrder && setShowPaymentModal(true)}
                className={`flex items-center justify-between p-3 border rounded-xl transition ${
                  canPlaceOrder
                    ? "border-slate-200 cursor-pointer hover:bg-slate-50"
                    : "border-slate-100 bg-slate-50 cursor-not-allowed opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${theme.light}`}>
                    <selectedPayment.icon className={`w-5 h-5 ${theme.primaryText}`} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">
                      Payment Method
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {selectedPayment.name}
                    </p>
                  </div>
                </div>
                {canPlaceOrder && (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>

              <button
                disabled={!canPlaceOrder}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${
                  canPlaceOrder
                    ? `${theme.primary} text-white hover:brightness-110 active:scale-95 shadow-indigo-200/50`
                    : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                }`}
              >
                <span>
                  {canPlaceOrder ? "Place Order" : `Add ₹${amountNeeded} more`}
                </span>
                {canPlaceOrder && <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY FOOTER */}
      <div className="lg:hidden fixed bottom-0 w-full bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-4 border-t border-slate-100 z-30 pb- safe-area-bottom">
        {!canPlaceOrder && (
          <div className="mb-3 bg-red-50 text-red-600 p-2 rounded-lg text-xs flex items-center justify-center gap-2 text-center">
            <AlertCircle className="w-3 h-3" />
            <span>
              Add items worth <strong>₹{amountNeeded}</strong> to checkout
            </span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div
            className={`flex-1 ${
              canPlaceOrder ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
            }`}
            onClick={() => canPlaceOrder && setShowPaymentModal(true)}
          >
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
              <span className={theme.primaryText}>Method</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <selectedPayment.icon className="w-5 h-5 text-slate-700" />
              <span className="font-bold text-slate-800 text-sm truncate">
                {selectedPayment.name}
              </span>
            </div>
          </div>

          <button
            disabled={!canPlaceOrder}
            className={`flex-1 rounded-xl py-3 px-4 flex justify-between items-center shadow-lg transition-transform ${
              canPlaceOrder
                ? `${theme.primary} text-white active:scale-95`
                : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
            }`}
          >
            <div className="text-left leading-none">
              <span className="block text-[10px] opacity-80 mb-0.5">Total</span>
              <span className="font-bold text-base">₹{toPay}</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-sm">
              <span>{canPlaceOrder ? "Place Order" : "Locked"}</span>
              {canPlaceOrder && <ChevronRight className="w-4 h-4" />}
            </div>
          </button>
        </div>
      </div>

      {/* ===========================
          MODALS
      ============================ */}

      {/* SLOT MODAL (uses backend slots; falls back to static) */}
     {/* SLOT MODAL */}
{/* SLOT MODAL */}
{showSlotModal && (
  <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-6">
   <div className="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-3xl p-5 md:p-8 max-h-[80vh] overflow-y-auto relative">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Select delivery slot</h2>
        <button
          onClick={() => setShowSlotModal(false)}
          className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* DATE TABS */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-2 scrollbar-hide">
        {dates.map((d, i) => {
          const active = selectedDate === d.label;
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(d.label)}
              className={`min-w-[100px] py-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                active
                  ? `${theme.primary} text-white`
                  : "bg-white border-slate-200"
              }`}
            >
              <span className={`font-bold text-sm ${active ? "text-white" : "text-slate-800"}`}>
                {d.label}
              </span>
              <span className={`text-xs ${active ? "opacity-80" : "text-slate-400"}`}>
                {d.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* SLOT LIST (NOW USING slots[]) */}
      <div className="space-y-3 mb-24 md:mb-8">
        {slots.length > 0 ? (
          slots.map((slot, idx) => {
            const active = selectedSlot === slot.label;
            return (
              <button
                key={idx}
                onClick={() => setSelectedSlot(slot.label)}
                className={`w-full text-left py-3 px-3 rounded-lg border text-sm font-medium transition-all ${
                  active
                    ? `${theme.light} ${theme.border} ${theme.primaryText} ring-1`
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                {slot.label}
              </button>
            );
          })
        ) : (
          <p className="text-center text-slate-500 text-sm py-10">
            No delivery slots available
          </p>
        )}
      </div>

      {/* CONFIRM BUTTON */}
      <div className="fixed md:static bottom-0 left-0 right-0 p-5 md:p-0 bg-white border-t md:border-t-0">
        <button
          onClick={() => setShowSlotModal(false)}
          className={`w-full ${theme.primary} text-white font-bold py-4 rounded-xl shadow-lg`}
        >
          Confirm Slot
        </button>
      </div>

    </div>
  </div>
)}

      {/* INSTRUCTIONS MODAL */}
      {showInstructionModal && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-0 md:p-4">
          <div className="bg-white w-full max-w-md rounded-t-[20px] md:rounded-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-800">Delivery Instructions</h3>
              <button
                onClick={() => setShowInstructionModal(false)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {instructionOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedInstruction(opt.label)}
                    className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center justify-center text-center gap-2 h-28 transition-all ${
                      selectedInstruction === opt.label
                        ? `${theme.border} ${theme.light} ${theme.primaryText}`
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    <div
                      className={`${
                        selectedInstruction === opt.label
                          ? theme.primaryText
                          : "text-gray-400"
                      }`}
                    >
                      {opt.icon}
                    </div>
                    <span className="text-xs font-semibold leading-tight">
                      {opt.label}
                    </span>
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                maxLength={200}
                placeholder="e.g. Call me upon arrival"
                className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 text-sm focus:ring-slate-300"
              />
              <button
                onClick={() => setShowInstructionModal(false)}
                className={`w-full ${theme.primary} text-white font-bold py-3 rounded-xl mt-2`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-0 md:p-4">
          <div className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-3xl p-5 md:p-6 overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Select Payment Method</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pb-8 md:pb-0">
              {paymentOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    setSelectedPayment(opt);
                    setShowPaymentModal(false);
                  }}
                  className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${theme.light} ${theme.primaryText}`}>
                      <opt.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{opt.name}</p>
                      <p className="text-xs text-slate-400">{opt.desc}</p>
                    </div>
                  </div>
                  {selectedPayment.id === opt.id && (
                    <div className={`w-5 h-5 rounded-full ${theme.primary} flex items-center justify-center`}>
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-0 md:p-6">
          <div className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-3xl p-5 md:p-6 h-[70vh] md:h-auto overflow-hidden animate-in slide-in-from-bottom duration-300 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Select Address</h2>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {/* Add New Button (UI only now) */}
              <button
                className={`w-full p-4 border border-dashed ${theme.border} ${theme.light} rounded-xl flex items-center gap-3 hover:brightness-95 transition`}
              >
                <PlusCircle className={`w-5 h-5 ${theme.primaryText}`} />
                <span className={`font-bold ${theme.primaryText}`}>Add New Address</span>
              </button>

              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-4">
                Saved Addresses
              </h3>

              {savedAddresses.map((addr) => {
                const isSelected = selectedAddress.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setShowAddressModal(false);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? `${theme.border} bg-slate-50 ring-1 ring-inset ${theme.primaryText}`
                        : "border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? theme.light : "bg-slate-100"
                      }`}
                    >
                      <addr.icon
                        className={`w-5 h-5 ${
                          isSelected ? theme.primaryText : "text-slate-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4
                          className={`font-bold text-sm ${
                            isSelected ? "text-slate-800" : "text-slate-600"
                          }`}
                        >
                          {addr.type}
                        </h4>
                        {isSelected && (
                          <CheckCircle2 className={`w-4 h-4 ${theme.primaryText}`} />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {addr.address}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default cartpage;
