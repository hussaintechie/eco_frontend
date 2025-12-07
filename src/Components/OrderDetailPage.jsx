import React from 'react';
import { 
  ArrowLeft, MapPin, FileText, HelpCircle, 
  Package, Truck, Calendar, CreditCard, 
  Snowflake, Sun, CloudRain, Flower2, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- 1. SEASON CONFIG (Consistent) ---
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

const OrderDetailPage = () => {
  const navigate = useNavigate();
  const currentSeason = getSeason();
  const theme = SEASON_CONFIG[currentSeason];
  const SeasonIcon = theme.icon;

  // --- MOCK DATA FOR DETAIL VIEW ---
  const orderDetails = {
    id: "ORD-29384",
    date: "Dec 02, 2025 at 10:30 AM",
    status: "Delivered",
    paymentMethod: "UPI (Google Pay)",
    address: {
      type: "Home",
      text: "42, Green Avenue, Near Central Park, Bangalore, Karnataka - 560001"
    },
    items: [
      { name: "Organic Bananas", qty: 2, price: 40, unit: "Dozen", image: "https://placehold.co/100?text=Bananas" },
      { name: "Fresh Whole Milk", qty: 1, price: 32, unit: "1L", image: "https://placehold.co/100?text=Milk" },
      { name: "Almonds Premium", qty: 1, price: 450, unit: "500g", image: "https://placehold.co/100?text=Almonds" }
    ],
    bill: {
      subtotal: 562,
      delivery: 40,
      discount: -50,
      tax: 18,
      total: 570
    }
  };

  return (
    <div className={`min-h-screen ${theme.gradient} pb-24`}>
      
      {/* --- Header --- */}
      <div className="bg-white sticky top-0 z-20 shadow-sm px-4 py-4 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-full hover:bg-slate-50 transition"
        >
          <ArrowLeft className="text-slate-700" size={24} />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-lg text-slate-800">Order Details</h1>
          <p className="text-xs text-slate-500">#{orderDetails.id}</p>
        </div>
        <div className={`px-3 py-1 rounded-full ${theme.light} ${theme.primaryText} text-xs font-bold flex items-center gap-1`}>
            <SeasonIcon size={12}/> {theme.name}
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        
        {/* --- 1. Order Status Card --- */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
           <div className={`p-3 rounded-full ${theme.light}`}>
              <Package className={`${theme.primaryText}`} size={24} />
           </div>
           <div>
              <h2 className="font-bold text-slate-800 text-lg">{orderDetails.status}</h2>
              <p className="text-sm text-slate-500 mt-1">Order delivered on {orderDetails.date}</p>
           </div>
        </div>

        {/* --- 2. Items List --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
           <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50">
              <h3 className="font-bold text-slate-700">Items ({orderDetails.items.length})</h3>
           </div>
           <div className="divide-y divide-slate-50">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="p-4 flex gap-4 items-center">
                   <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{item.name}</h4>
                      <p className="text-xs text-slate-500">{item.qty} x {item.unit}</p>
                   </div>
                   <div className="text-right">
                      <p className="font-bold text-slate-800">₹{item.price * item.qty}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* --- 3. Shipping & Payment Info --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Address */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                  <MapPin size={18} className="text-slate-400"/> Delivery Address
               </h3>
               <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600 uppercase mb-2 inline-block">
                  {orderDetails.address.type}
               </span>
               <p className="text-sm text-slate-600 leading-relaxed">
                  {orderDetails.address.text}
               </p>
            </div>
            
            {/* Payment */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                  <CreditCard size={18} className="text-slate-400"/> Payment Details
               </h3>
               <p className="text-sm text-slate-600 mb-2">Method: <span className="font-medium text-slate-800">{orderDetails.paymentMethod}</span></p>
               <p className="text-sm text-slate-600">Date: <span className="font-medium text-slate-800">{orderDetails.date}</span></p>
            </div>
        </div>

        {/* --- 4. Bill Summary --- */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Bill Details</h3>
            
            <div className="space-y-3 text-sm">
               <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{orderDetails.bill.subtotal}</span>
               </div>
               <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span>₹{orderDetails.bill.delivery}</span>
               </div>
               <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- ₹{Math.abs(orderDetails.bill.discount)}</span>
               </div>
               <div className="flex justify-between text-slate-600">
                  <span>Taxes & Charges</span>
                  <span>₹{orderDetails.bill.tax}</span>
               </div>
               
               <div className="h-px bg-slate-100 my-2"></div>
               
               <div className="flex justify-between text-lg font-bold text-slate-800">
                  <span>Grand Total</span>
                  <span>₹{orderDetails.bill.total}</span>
               </div>
            </div>
        </div>

      </div>

      {/* --- Fixed Bottom Bar --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 shadow-lg flex gap-3 z-20">
         <button className="flex-1 flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 hover:bg-slate-50">
            <Download size={18} /> Invoice
         </button>
         <button className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-white shadow-lg shadow-indigo-200 hover:opacity-90 ${theme.primary}`}>
            <HelpCircle size={18} /> Need Help?
         </button>
      </div>

    </div>
  );
};

export default OrderDetailPage;