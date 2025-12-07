import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Search, Share2, Home, ChevronDown, 
  Minus, Plus, Wallet, ChevronRight, X,
  Snowflake, Sun, CloudRain, Flower2,
  BellOff, DoorOpen, Phone, CreditCard, Smartphone,
  FileText, ShieldCheck, AlertCircle
} from 'lucide-react';

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
const CheckoutPage = () => {
  const [currentSeason, setCurrentSeason] = useState('spring'); 
  const [theme, setTheme] = useState(SEASON_CONFIG.spring);

  useEffect(() => {
    const season = getSeason();
    setCurrentSeason(season);
    setTheme(SEASON_CONFIG[season]);
  }, []);

  // --- UI States ---
  const [isBagOpted, setIsBagOpted] = useState(true);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Selection States
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState('5:30 PM - 6:30 PM');
  const [selectedInstruction, setSelectedInstruction] = useState('');
  const [customInstruction, setCustomInstruction] = useState('');
  const [selectedPayment, setSelectedPayment] = useState({ id: 'cod', name: 'Pay on delivery', icon: Wallet });

  // --- MOCK DATA ---
  const bestsellers = [
    { name: "Banana - Yelakki", weight: "500 g", price: 42, oldPrice: 69, discount: "39% OFF", img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=150&q=80" },
    { name: "Onion", weight: "2 kg", price: 68, oldPrice: 94, discount: "28% OFF", img: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=150&q=80" },
    { name: "Tomato - Local", weight: "1 kg", price: 66, oldPrice: 83, discount: "20% OFF", img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=150&q=80" },
    { name: "Potato", weight: "1 kg", price: 45, oldPrice: 60, discount: "25% OFF", img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=150&q=80" },
  ];

  const dates = [
    { label: "Today", sub: "2 Dec" }, { label: "Tomorrow", sub: "3 Dec" },
    { label: "Thursday", sub: "4 Dec" }, { label: "Friday", sub: "5 Dec" },
  ];

  const timeSlots = [
    { time: "1:00 PM - 2:00 PM", available: false }, { time: "2:30 PM - 3:30 PM", available: false },
    { time: "4:00 PM - 5:00 PM", available: false }, { time: "5:30 PM - 6:30 PM", available: true },
    { time: "7:00 PM - 8:00 PM", available: true }, { time: "8:00 PM - 9:00 PM", available: true },
  ];

  const instructionOptions = [
    { id: 1, label: "Avoid Ringing Bell", icon: <BellOff size={24}/> },
    { id: 2, label: "Leave at Door", icon: <DoorOpen size={24}/> },
    { id: 3, label: "Call on Arrival", icon: <Phone size={24}/> }
  ];

  const paymentOptions = [
    { id: 'cod', name: 'Pay on delivery', desc: 'Cash or UPI upon delivery', icon: Wallet },
    { id: 'upi', name: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: Smartphone },
    { id: 'card', name: 'Credit / Debit Card', desc: 'Visa, Mastercard, Rupay', icon: CreditCard },
  ];

  // --- 3. BILL CALCULATIONS & LOGIC ---
  const MIN_ORDER_VALUE = 200;
  const itemTotal = 24; // MOCK TOTAL (Currently less than 200 to show logic)
  const handlingFee = 5;
  const deliveryFee = 0; 
  const toPay = itemTotal + handlingFee + deliveryFee;

  // Validation Logic
  const canPlaceOrder = itemTotal >= MIN_ORDER_VALUE;
  const amountNeeded = MIN_ORDER_VALUE - itemTotal;

  return (
    <div className={`min-h-screen font-sans ${theme.gradient} transition-colors duration-500`}>
      
      {/* --- HEADER --- */}
      <div className="bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-4">
                    <ArrowLeft className="w-6 h-6 text-slate-700 cursor-pointer" />
                    <div>
                        <h1 className="font-bold text-lg text-slate-800 leading-tight">Checkout</h1>
                        <div className="flex items-center gap-1 text-xs text-slate-500 hidden md:flex">
                            <Home className="w-3 h-3" />
                            <span>Home • 19, Pillayar Kovil Street, Chennai</span>
                        </div>
                    </div>
                </div>
                
                {/* Season Badge */}
                <div className="flex items-center gap-4">
                    <div className={`px-3 py-1.5 rounded-full ${theme.light} border ${theme.border} flex items-center gap-2`}>
                        <theme.icon className={`w-4 h-4 ${theme.primaryText}`} />
                        <span className={`text-xs font-bold uppercase ${theme.primaryText}`}>{theme.name}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="md:hidden px-4 pb-2 text-xs text-slate-500 flex items-center gap-1">
             <Home className="w-3 h-3" />
             <span className="truncate">Home 19, pillayr kovil street...</span>
        </div>

        <div className={`${theme.light} py-2 text-center border-t border-b ${theme.border}`}>
            <p className={`text-xs font-bold ${theme.primaryText}`}>🎉 Congrats! You're saving ₹31 on this order</p>
        </div>
      </div>

      {/* --- MAIN LAYOUT --- */}
      <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pb-32 lg:pb-8">
        
        {/* === LEFT COLUMN === */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
            
            {/* Bag Toggle */}
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-3 rounded-xl"><span className="text-2xl">🛍️</span></div>
                    <div>
                        <p className="font-bold text-slate-800">Get your order in a bag</p>
                        <p className="text-xs text-slate-500 hidden md:block">We will pack your items in a reusable bag.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">FREE</span>
                    <button 
                        onClick={() => setIsBagOpted(!isBagOpted)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isBagOpted ? theme.primary : 'bg-slate-300'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isBagOpted ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>

            {/* Delivery Slot */}
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-end mb-4">
                    <h3 className="font-bold text-slate-700 text-lg">Delivery Preference</h3>
                    <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">1 Item</span>
                </div>
                <div 
                    onClick={() => setShowSlotModal(true)}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-slate-300 transition group"
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition`}>
                             <theme.icon className={`w-5 h-5 ${theme.primaryText}`} />
                        </div>
                        <div>
                             <p className="text-xs text-slate-500 font-semibold uppercase">Scheduled For</p>
                             <p className={`text-sm font-bold ${theme.primaryText}`}>{selectedDate}, {selectedSlot}</p>
                        </div>
                    </div>
                    <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-700 mb-4 text-lg">Your Items</h3>
                <div className="flex gap-4 items-start">
                    <img src="https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=150&q=80" alt="Item" className="w-20 h-20 rounded-xl object-cover bg-slate-100" />
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                             <div>
                                <p className="font-semibold text-slate-800">Fresh Green Chilli</p>
                                <p className="text-xs text-slate-500 mt-1">500g • Organic</p>
                             </div>
                             <p className="font-bold text-slate-800">₹{itemTotal}</p>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                             <p className="text-xs text-slate-400 line-through">₹30</p>
                             <div className={`flex items-center rounded-lg ${theme.primary} text-white font-bold h-8 shadow-md`}>
                                <button className="px-3 h-full hover:bg-black/10 transition"><Minus className="w-3 h-3" /></button>
                                <span className="px-1 text-sm min-w-[20px] text-center">1</span>
                                <button className="px-3 h-full hover:bg-black/10 transition"><Plus className="w-3 h-3" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bestsellers */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-800">Before you checkout</h3>
                </div>
                <div className="flex md:grid md:grid-cols-4 overflow-x-auto md:overflow-visible gap-4 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                    {bestsellers.map((item, idx) => (
                        <div key={idx} className="min-w-[150px] bg-white rounded-xl border border-slate-100 shadow-sm p-3 relative flex-shrink-0 group hover:shadow-md transition">
                            <span className={`absolute top-0 left-0 ${theme.primary} text-white text-[10px] font-bold px-2 py-1 rounded-tl-xl rounded-br-xl shadow-sm`}>
                                {item.discount}
                            </span>
                            <div className="h-28 w-full flex items-center justify-center mb-2">
                                <img src={item.img} alt={item.name} className="h-24 object-contain group-hover:scale-105 transition duration-300" />
                            </div>
                            <p className="font-bold text-xs text-slate-700 mb-1 line-clamp-2 h-8">{item.name}</p>
                            <div className="flex items-center justify-between mt-2">
                                <div>
                                    <p className="font-bold text-sm">₹{item.price}</p>
                                    <p className="text-[10px] text-slate-400 line-through">₹{item.oldPrice}</p>
                                </div>
                                <button className={`p-2 rounded-lg border ${theme.border} ${theme.light} ${theme.primaryText} hover:brightness-95`}>
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* === RIGHT COLUMN (Bill & Checkout) === */}
        <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
                
                {/* Bill Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="font-bold text-slate-800 text-lg mb-4">Bill Details</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Item Total</span><span>₹{itemTotal}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Handling Fee</span><span>₹{handlingFee}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Delivery Fee</span>
                            <span className={`${theme.primaryText} font-semibold`}>FREE</span>
                        </div>
                        {/* Minimum Order Warning */}
                        {!canPlaceOrder && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs flex items-start gap-2 mt-2">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>Minimum order value is ₹{MIN_ORDER_VALUE}. Add items worth ₹{amountNeeded} to place order.</span>
                            </div>
                        )}
                    </div>
                    <div className="h-px bg-slate-100 my-4"></div>
                    <div className="flex justify-between text-lg font-bold text-slate-800">
                        <span>To Pay</span>
                        <span>₹{toPay}</span>
                    </div>
                </div>

                {/* Desktop Checkout Action */}
                <div className="hidden lg:block bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                    <div 
                        onClick={() => canPlaceOrder && setShowPaymentModal(true)}
                        className={`flex items-center justify-between p-3 border rounded-xl transition
                            ${canPlaceOrder ? 'border-slate-200 cursor-pointer hover:bg-slate-50' : 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-60'}`}
                    >
                         <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${theme.light}`}><selectedPayment.icon className={`w-5 h-5 ${theme.primaryText}`}/></div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold">Payment Method</p>
                                <p className="text-sm font-bold text-slate-700">{selectedPayment.name}</p>
                            </div>
                         </div>
                         {canPlaceOrder && <ChevronDown className="w-4 h-4 text-slate-400"/>}
                    </div>

                    <button 
                        disabled={!canPlaceOrder}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all
                            ${canPlaceOrder 
                                ? `${theme.primary} text-white hover:brightness-110 active:scale-95 shadow-indigo-200/50` 
                                : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'}`}
                    >
                        <span>{canPlaceOrder ? "Place Order" : `Add ₹${amountNeeded} more`}</span>
                        {canPlaceOrder && <ChevronRight className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* --- MOBILE STICKY FOOTER --- */}
      <div className="lg:hidden fixed bottom-0 w-full bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-4 border-t border-slate-100 z-30 pb- safe-area-bottom">
        
        {/* Validation Message for Mobile */}
        {!canPlaceOrder && (
            <div className="mb-3 bg-red-50 text-red-600 p-2 rounded-lg text-xs flex items-center justify-center gap-2 text-center">
                <AlertCircle className="w-3 h-3" />
                <span>Add items worth <strong>₹{amountNeeded}</strong> to checkout</span>
            </div>
        )}

        <div className="flex items-center gap-4">
            <div className={`flex-1 ${canPlaceOrder ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`} onClick={() => canPlaceOrder && setShowPaymentModal(true)}>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                    <span className={theme.primaryText}>Method</span>
                    <ChevronDown className="w-3 h-3" />
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <selectedPayment.icon className="w-5 h-5 text-slate-700" />
                    <span className="font-bold text-slate-800 text-sm truncate">{selectedPayment.name}</span>
                </div>
            </div>

            <button 
                disabled={!canPlaceOrder}
                className={`flex-1 rounded-xl py-3 px-4 flex justify-between items-center shadow-lg transition-transform
                    ${canPlaceOrder 
                        ? `${theme.primary} text-white active:scale-95` 
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'}`}
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

      {/* --- DELIVERY MODAL (Code kept same as previous for brevity) --- */}
      {showSlotModal && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-0 md:p-6">
            <div className="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-3xl p-5 md:p-8 h-[70vh] md:h-auto overflow-y-auto relative animate-in slide-in-from-bottom duration-300 md:shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Select delivery slot</h2>
                    <button onClick={() => setShowSlotModal(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X className="w-5 h-5" /></button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 mb-2 scrollbar-hide">
                    {dates.map((date, idx) => {
                        const isSelected = selectedDate === date.label;
                        return (
                            <button key={idx} onClick={() => setSelectedDate(date.label)}
                                className={`min-w-[100px] py-3 rounded-xl border flex flex-col items-center justify-center transition-all ${isSelected ? `${theme.primary} text-white border-transparent` : 'bg-white border-slate-200'}`}
                            >
                                <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>{date.label}</span>
                                <span className={`text-xs ${isSelected ? 'opacity-80' : 'text-slate-400'}`}>{date.sub}</span>
                            </button>
                        )
                    })}
                </div>
                <div className="grid grid-cols-2 gap-3 mb-24 md:mb-8">
                    {timeSlots.map((slot, idx) => {
                        const isSelected = selectedSlot === slot.time;
                        return (
                            <button key={idx} disabled={!slot.available} onClick={() => setSelectedSlot(slot.time)}
                                className={`py-4 px-2 rounded-lg border text-sm font-medium transition-all ${!slot.available ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' : isSelected ? `${theme.light} ${theme.border} ${theme.primaryText} ring-1 ring-inset ${theme.primaryText}` : 'bg-white border-slate-200'}`}
                            >
                                {slot.time}
                            </button>
                        )
                    })}
                </div>
                <div className="fixed md:static bottom-0 left-0 right-0 p-5 md:p-0 bg-white border-t md:border-t-0 border-slate-100">
                    <button onClick={() => setShowSlotModal(false)} className={`w-full ${theme.primary} text-white font-bold py-4 rounded-xl shadow-lg`}>Confirm Slot</button>
                </div>
            </div>
        </div>
      )}

      {/* --- INSTRUCTIONS MODAL --- */}
      {showInstructionModal && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-0 md:p-4">
          <div className="bg-white w-full max-w-md rounded-t-[20px] md:rounded-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
               <h3 className="font-bold text-lg text-gray-800">Delivery Instructions</h3>
               <button onClick={() => setShowInstructionModal(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={20}/></button>
            </div>
            <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                   {instructionOptions.map((opt) => (
                      <div key={opt.id} onClick={() => setSelectedInstruction(opt.label)} className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center justify-center text-center gap-2 h-28 transition-all ${selectedInstruction === opt.label ? `${theme.border} ${theme.light} ${theme.primaryText}` : 'border-gray-200 text-gray-600'}`}>
                         <div className={`${selectedInstruction === opt.label ? theme.primaryText : 'text-gray-400'}`}>{opt.icon}</div>
                         <span className="text-xs font-semibold leading-tight">{opt.label}</span>
                      </div>
                   ))}
                </div>
                <input type="text" value={customInstruction} onChange={(e) => setCustomInstruction(e.target.value)} maxLength={200} placeholder="e.g. Call me upon arrival" className={`w-full mt-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 text-sm focus:border-[${theme.primary}] focus:ring-[${theme.primary}]`}/>
                <button onClick={() => setShowInstructionModal(false)} className={`w-full ${theme.primary} text-white font-bold py-3 rounded-xl mt-2`}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* --- PAYMENT MODAL --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-0 md:p-4">
            <div className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-3xl p-5 md:p-6 overflow-hidden animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Select Payment Method</h2>
                    <button onClick={() => setShowPaymentModal(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-3 pb-8 md:pb-0">
                    {paymentOptions.map((opt) => (
                        <div key={opt.id} onClick={() => { setSelectedPayment(opt); setShowPaymentModal(false); }} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${theme.light} ${theme.primaryText}`}><opt.icon className="w-6 h-6" /></div>
                                <div><p className="font-bold text-slate-800">{opt.name}</p><p className="text-xs text-slate-400">{opt.desc}</p></div>
                            </div>
                            {selectedPayment.id === opt.id && <div className={`w-5 h-5 rounded-full ${theme.primary} flex items-center justify-center`}><div className="w-2 h-2 bg-white rounded-full" /></div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default CheckoutPage;