import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Home,
  ChevronDown,
  Minus,
  Plus,
  Wallet,
  ChevronRight,
  X,
  Snowflake,
  Sun,
  CloudRain,
  Flower2,
  BellOff,
  DoorOpen,
  Phone,
  CreditCard,
  Smartphone,
  FileText,
  ShieldCheck,
  AlertCircle,
  Briefcase,
  MapPin,
  PlusCircle,
  CheckCircle2,
  AwardIcon,
  TicketPercent,
  Tag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/auth";

import { useCart } from "../context/CartContext.jsx";
import { SEASON_CONFIG, getSeason } from "../SEASON_CONFIG.jsx";
import {
  getCartAPI,
  getCartBillAPI,
  getDeliverySlotsAPI,
  updateCartQtyAPI,
  clearCartAPI,
  removeCartItemAPI,
} from "../api/cartapi.js";
import { fetchAddresses } from "../api/addressAPI.js";

const iconMap = {
  Home: Home,
  Work: Briefcase,
  Other: MapPin,
};
import { toast } from "react-toastify";
import Footer from "./Footer.jsx";

// ------------------------------------------------
// STATIC DATA (UI-ONLY SECTIONS)
// ------------------------------------------------

// --- MOCK DATA: Available Coupons ---

const bestsellers = [
  {
    name: "Banana - Yelakki",
    weight: "500 g",
    price: 42,
    oldPrice: 69,
    discount: "39% OFF",
    img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=150&q=80",
  },
  {
    name: "Onion",
    weight: "2 kg",
    price: 68,
    oldPrice: 94,
    discount: "28% OFF",
    img: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=150&q=80",
  },
  {
    name: "Tomato - Local",
    weight: "1 kg",
    price: 66,
    oldPrice: 83,
    discount: "20% OFF",
    img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=150&q=80",
  },
  {
    name: "Potato",
    weight: "1 kg",
    price: 45,
    oldPrice: 60,
    discount: "25% OFF",
    img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=150&q=80",
  },
];

const formatLocalDateTime = (dateObj) => {
  const pad = (n) => String(n).padStart(2, "0");

  return (
    `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(
      dateObj.getDate(),
    )} ` + `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:00`
  );
};

const extractDeliveryTimes = (slotLabel, selectedDate) => {
  const now = new Date();

  if (!slotLabel || slotLabel === "Deliver Immediately") {
    return {
      start: formatLocalDateTime(now),
      end: null,
    };
  }

  const match = slotLabel.match(
    /(\d{1,2}):(\d{2})\s*(am|pm)\s*-\s*(\d{1,2}):(\d{2})\s*(am|pm)/i,
  );

  if (!match) {
    console.error("Slot parse failed:", slotLabel);
    return null;
  }

  const toDate = (h, m, meridian, baseDate) => {
    let hour = Number(h);
    let minute = Number(m);

    if (meridian.toLowerCase() === "pm" && hour !== 12) hour += 12;
    if (meridian.toLowerCase() === "am" && hour === 12) hour = 0;

    const d = new Date(baseDate);
    d.setHours(hour, minute, 0, 0);
    return d;
  };

  const baseDate =
    selectedDate === "Tomorrow" ? new Date(Date.now() + 86400000) : new Date();

  const startDate = toDate(match[1], match[2], match[3], baseDate);
  const endDate = toDate(match[4], match[5], match[6], baseDate);

  return {
    start: formatLocalDateTime(startDate),
    end: formatLocalDateTime(endDate),
  };
};

const instructionOptions = [
  { id: 1, label: "Avoid Ringing Bell", icon: <BellOff size={24} /> },
  { id: 2, label: "Leave at Door", icon: <DoorOpen size={24} /> },
  { id: 3, label: "Call on Arrival", icon: <Phone size={24} /> },
];

const paymentOptions = [
  {
    id: "upi",
    name: "UPI",
    desc: "Google Pay, PhonePe, Paytm",
    icon: Smartphone,
  },
  {
    id: "cod",
    name: "Pay on delivery",
    desc: "Cash or UPI upon delivery",
    icon: Wallet,
  },
];

// ------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------
const cartpage = () => {
  const navigate = useNavigate();

  // ---------------- DISPLAY HELPERS (UI ONLY) ----------------
  const formatDateToReadable = (dateObj) => {
    return dateObj.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatSlotRange = (slotLabel) => {
    if (!slotLabel || slotLabel === "Deliver Immediately") {
      return "Deliver Immediately";
    }

    const match = slotLabel.match(
      /(\d{1,2}:\d{2})\s*(am|pm)\s*-\s*(\d{1,2}:\d{2})\s*(am|pm)/i,
    );

    if (!match) return slotLabel;

    const to12Hr = (time, meridian) => {
      let [h, m] = time.split(":").map(Number);
      if (meridian.toLowerCase() === "pm" && h !== 12) h += 12;
      if (meridian.toLowerCase() === "am" && h === 12) h = 0;

      const hour12 = h % 12 || 12;
      return `${hour12}:${m.toString().padStart(2, "0")} ${
        h >= 12 ? "PM" : "AM"
      }`;
    };

    const start = to12Hr(match[1], match[2]);
    const end = to12Hr(match[3], match[4]);

    return `${start} – ${end}`;
  };

  const getDisplayDeliveryText = () => {
    const dateObj =
      dates.find((d) => d.label === selectedDate)?.date || new Date();

    const formattedDate = formatDateToReadable(dateObj);
    const formattedTime = formatSlotRange(selectedSlot);

    extractDeliveryTimes(selectedSlot, selectedDate);

    return `${formattedDate} • ${formattedTime}`;
  };

  // Season / theme
  const [currentSeason, setCurrentSeason] = useState("spring");
  const [theme, setTheme] = useState(SEASON_CONFIG.spring);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [itemLoadingId, setItemLoadingId] = useState(null);
  const [clearLoading, setClearLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const [availableCoupons, setAvailableCoupons] = useState([]);

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
  const [showCouponModal, setShowCouponModal] = useState(false);

  // Selections
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedInstruction, setSelectedInstruction] = useState("");
  const [customInstruction, setCustomInstruction] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(paymentOptions[0]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [slots, setSlots] = useState([]);

  // Coupon States
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // On mount: season + load data
  useEffect(() => {
    const season = getSeason();
    setCurrentSeason(season);
    setTheme(SEASON_CONFIG[season]);

    // 🔹 Generate next 4 days dynamically
    const today = new Date();
    const newDates = [];

    for (let i = 0; i < 2; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      let label;
      if (i === 0) label = "Today";
      else if (i === 1) label = "Tomorrow";
      else {
        label = d.toLocaleDateString("en-IN", { weekday: "long" });
      }

      const sub = d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });

      newDates.push({ label, sub, date: d });
    }

    setDates(newDates);

    (async () => {
      try {
        setPageLoading(true);
        await new Promise((resolve) => requestAnimationFrame(resolve));
        await new Promise((resolve) => setTimeout(resolve, 0));
        await Promise.all([
          loadCart(),
          loadBill(),
          loadSlots(),
          loadAddresses(),
          loadCoupons(),
        ]);
      } catch (e) {
        console.log(e);
      } finally {
        setPageLoading(false);
      }
    })();
  }, []);

  const loadAddresses = async () => {
    try {
      const res = await fetchAddresses();
      const raw = Array.isArray(res?.data) ? res.data : [];
      const list = raw.map((a) => ({
        address_id: a.address_id,
        address_type: a.address_type,
        full_address:
          a.full_address ||
          `${a.building || ""} ${a.street || ""} ${a.city || ""} ${
            a.pincode || ""
          }`.trim(),
      }));

      setSavedAddresses(list);
      const defaultAddress = list.find((a) => a.is_default) || list[0];
      if (defaultAddress) setSelectedAddress(defaultAddress);
    } catch (err) {
      console.error("Error loading addresses:", err);
      setSavedAddresses([]);
    }
  };
  const loadCoupons = async () => {
    const res = await API.get("/coupon/list");
    if (res.data.status === 1) {
      setAvailableCoupons(res.data.data);
    }
  };

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
  const isSlotInFuture = (slotLabel) => {
    if (!slotLabel || slotLabel === "Deliver Immediately") return true;

    const match = slotLabel.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
    if (!match) return true;

    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const meridian = match[3].toLowerCase();

    if (meridian === "pm" && hour !== 12) hour += 12;
    if (meridian === "am" && hour === 12) hour = 0;

    const now = new Date();
    const slotTime = new Date();
    slotTime.setHours(hour, minute, 0, 0);

    return slotTime > now;
  };

  const loadSlots = async () => {
    try {
      const res = await getDeliverySlotsAPI();

      let today = res.data.today || [];
      let tomorrow = res.data.tomorrow || [];

      // ✅ REMOVE PAST SLOTS FOR TODAY
      today = today.filter((slot) => isSlotInFuture(slot.label));

      setTodaySlots(today);
      setTomorrowSlots(tomorrow);
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
    if (itemLoadingId === cart_id) return;

    try {
      setItemLoadingId(cart_id);

      if (qty <= 0) {
        await removeCartItemAPI(cart_id);
      } else {
        await updateCartQtyAPI(cart_id, qty);
      }

      await Promise.all([loadCart(), loadBill()]);
    } catch (err) {
      console.error("Error updating quantity:", err);
    } finally {
      setItemLoadingId(null);
    }
  };

  const handleDeleteItem = async (cart_id) => {
    if (itemLoadingId === cart_id) return;

    try {
      setItemLoadingId(cart_id);

      await removeCartItemAPI(cart_id);
      await Promise.all([loadCart(), loadBill()]);

      toast.success("Item removed");
    } catch (err) {
      console.error("delete item error", err);
      toast.error("Failed to remove item");
    } finally {
      setItemLoadingId(null);
    }
  };

  // const handleClearCart = async () => {
  //   if (clearLoading) return;
  //   try {
  //      setClearLoading(true);
  //     const res = await clearCartAPI();
  //     console.log(res.data.message);

  //     await loadCart();
  //     await loadBill();
  //     resetCart();
  //   } catch (error) {
  //     console.error("Error clearing cart:", error);
  //   }
  // };
  const handleClearCart = async () => {
    if (clearLoading) return;

    try {
      setClearLoading(true);

      await clearCartAPI();
      await Promise.all([loadCart(), loadBill()]);
      resetCart();

      toast.success("Cart cleared");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    } finally {
      setClearLoading(false);
    }
  };

  // -------------------------------
  // COUPON HANDLERS
  // -------------------------------
  const handleApplySpecificCoupon = async (coupon) => {
    if (coupon.is_used) {
      return toast.error("You have already used this coupon.");
    }

    if (itemTotal < coupon.min_order_value) {
      return toast.error(
        `Add ₹${coupon.min_order_value - itemTotal} more to apply this coupon`,
      );
    }

    const res = await API.post("/coupon/apply", {
      coupon_code: coupon.coupon_code,
      cart_total: itemTotal,
    });

    if (res.data.status === 1) {
      setAppliedCoupon({
        code: res.data.coupon.coupon_code,
        discount: res.data.coupon.discount,
      });
      setShowCouponModal(false);
    }
  };

  const handleRemoveCoupon = (e) => {
    e.stopPropagation();
    setAppliedCoupon(null);
  };

  // -------------------------------
  // BILL CALCULATIONS
  // -------------------------------
  const itemTotal = bill?.item_total || 0;
  const handlingFee = bill?.handling_fee || 0;
  const deliveryFee = bill?.delivery_fee || 0;
  const discount = appliedCoupon?.discount || 0;

  const toPay = Math.max(itemTotal + handlingFee + deliveryFee - discount, 0);

  const MIN_ORDER_VALUE = bill?.minimum_order || 200;
  const amountNeeded = bill?.remaining_amount || 0;
 const canPlaceOrder =
  amountNeeded === 0 &&
  cart?.length > 0 &&
  itemTotal > 0;

  const { resetCart } = useCart();
 const placeOrder = async () => {
  // ✅ prevent multiple clicks
  if (orderLoading) return;

  // ✅ Block empty cart order
  if (!cart || cart.length === 0) {
    toast.error("Your cart is empty. Add items to place order.");
    return;
  }

  if (itemTotal <= 0) {
    toast.error("Your cart total is invalid.");
    return;
  }

  if (!canPlaceOrder) return;

  if (!selectedAddress) {
    toast.error("Please add or select a delivery address");
    setShowAddressModal(true);
    return;
  }

  if (!selectedPayment) {
    toast.error("Select payment method");
    return;
  }

  try {
    setOrderLoading(true);   // ✅ LOCK

    if (selectedPayment.id === "cod") {
      await submitFinalOrder("COD", "Pending", null);
      return;
    }

    await startRazorpayPayment();
  } catch (e) {
    console.log(e);
  } finally {
    setOrderLoading(false); // ✅ UNLOCK
  }
};



  const startRazorpayPayment = async () => {
    try {
      const res = await API.post("/api/payment/create-order", {
        amount: toPay,
      });

      const { key, amount, orderId } = res.data;

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      const options = {
        key,
        amount,
        currency: "INR",
        name: "SBS GROCES",
        description: "Order Payment",
        order_id: orderId,

        method: {
          upi: true,
        },

        upi: isMobile
    ? { flow: "intent" } // ✅ Mobile → open apps
    : { flow: "collect" },

        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay using UPI",
                instruments: [
                  {
                    method: "upi",
                    flows: ["intent","collect", "qr"],
                    apps: ["google_pay", "phonepe", "paytm", "bhim"], // ✅ add apps
                  },
                ],
              },
            },
            sequence: ["block.upi"],
            preferences: {
              show_default_blocks: false,
            },
          },
        },

        handler: async function (response) {
          try {
            const verifyRes = await API.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              await submitFinalOrder(
                "Online",
                "Paid",
                response.razorpay_payment_id,
                response.razorpay_order_id,
                response.razorpay_signature,
              );
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            toast.error("Payment verification error");
          }
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled by user");
            setOrderLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        setOrderLoading(false);
        toast.error(
          `Payment Failed\nReason: ${response.error.description || "Unknown"}`,
        );
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment initialization failed");
    }
  };

  const submitFinalOrder = async (
    payment_method,
    payment_status,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
  ) => {
    const deliveryTimes = extractDeliveryTimes(selectedSlot, selectedDate);

    if (!deliveryTimes) {
      toast.error("Select delivery slot");
      return;
    }

    const { start: delivery_start, end: delivery_end } = deliveryTimes;

    try {
      const payload = {
        address_delivery: selectedAddress.full_address,
        total_amount: toPay,
        item_total: itemTotal,
        handling_fee: handlingFee,
        delivery_fee: deliveryFee,
        order_status: "Pending",
        delivery_id: 1,
        delivery_start,
        delivery_end,
        payment_status,
        payment_method,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        items_details: cart.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          product_qty: item.quantity,
          product_unit: item.unit ?? 1,
          product_rate: item.price,
          product_amount: item.price * item.quantity,
          discount_amt: 0,
          discount_per: 0,
        })),

        coupon_code: appliedCoupon?.code || null,
        coupon_discount: appliedCoupon?.discount || 0,
      };

      const res = await API.post("/order/submitorder", payload);

      if (res.data?.status === 1) {
        await clearCartAPI();
        resetCart();
        navigate("/PostPaymentDeliveryFlow");
      } else {
        toast.error(res.data?.message || "Order failed after payment");
      }
    } catch (error) {
      console.error(error);
      toast.error("Order failed. Amount will be refunded if debited.");
    }
  };

  // -------------------------------
  // RENDER
  // -------------------------------
  const getCouponStatus = (coupon) => {
    if (coupon.is_used) return "USED";
    if (itemTotal < coupon.min_order_value) return "MIN_NOT_MET";
    return "AVAILABLE";
  };

  const getRemainingAmount = (coupon) => {
    return Math.max(coupon.min_order_value - itemTotal, 0);
  };
  const getCouponLabel = (coupon) => {
    return coupon.discount_type === "PERCENT"
      ? `${coupon.discount_value}% OFF`
      : `₹${coupon.discount_value} OFF`;
  };

  return (
    <div
      className={`min-h-screen font-sans ${theme.gradient} transition-colors duration-500`}
    >
      {pageLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <ArrowLeft
                onClick={() => navigate(-1)}
                className="w-6 h-6 text-slate-700 cursor-pointer"
              />
              <div>
                <h1 className="font-bold text-lg text-slate-800 leading-tight">
                  Checkout
                </h1>

                <div
                  className="flex items-center gap-1 text-xs text-slate-500 hidden md:flex cursor-pointer hover:text-slate-700"
                  onClick={() => setShowAddressModal(true)}
                >
                  {selectedAddress && (
                    <>
                      {(() => {
                        const Icon =
                          iconMap[selectedAddress.address_type] || MapPin;
                        return <Icon className="w-3 h-3" />;
                      })()}

                      <span className="truncate max-w-[220px]">
                        {selectedAddress.address_type} •{" "}
                        {selectedAddress.full_address}
                      </span>
                    </>
                  )}
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`px-3 py-1.5 rounded-full ${theme.light} border ${theme.border} flex items-center gap-2`}
              >
                <theme.icon className={`w-4 h-4 ${theme.primaryText}`} />
                <span
                  className={`text-xs font-bold uppercase ${theme.primaryText}`}
                >
                  {theme.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="md:hidden px-4 pb-2 text-xs text-slate-500 flex items-center gap-1 cursor-pointer"
          onClick={() => setShowAddressModal(true)}
        >
          {selectedAddress && (
            <>
              {(() => {
                const Icon = iconMap[selectedAddress.address_type] || MapPin;
                return <Icon className="w-3 h-3" />;
              })()}

              <span className="truncate">
                {selectedAddress.address_type} • {selectedAddress.full_address}
              </span>
            </>
          )}
        </div>
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
              {selectedAddress && (
                <>
                  <div className={`p-3 rounded-xl ${theme.light} shrink-0`}>
                    {(() => {
                      const Icon =
                        iconMap[selectedAddress.address_type] || MapPin;
                      return (
                        <Icon className={`w-6 h-6 ${theme.primaryText}`} />
                      );
                    })()}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800">
                      {selectedAddress.address_type}
                    </h4>

                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      {selectedAddress.full_address}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* --- COUPON SECTION --- */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-50 p-2 rounded-lg">
                <TicketPercent className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="font-bold text-slate-700 text-lg">
                Offers & Benefits
              </h3>
            </div>

            {!appliedCoupon ? (
              // 1. NO COUPON SELECTED STATE
              <div
                onClick={() => setShowCouponModal(true)}
                className="border border-dashed border-slate-300 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                    <Tag className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Apply Coupon</p>
                    <p className="text-xs text-slate-500">
                      Save more with exclusive codes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-xs font-bold uppercase hidden md:inline-block group-hover:text-slate-600">
                    Select
                  </span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ) : (
              // 2. COUPON APPLIED STATE
              <div
                onClick={() => setShowCouponModal(true)} // Clicking opens modal to switch
                className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-green-100/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-green-800 text-sm">
                      '{appliedCoupon.code}' Applied
                    </p>
                    <p className="text-xs text-green-700">
                      Code applied successfully
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="font-bold text-xs text-red-500 bg-white px-3 py-1.5 rounded-lg border border-red-100 shadow-sm hover:bg-red-50"
                >
                  REMOVE
                </button>
              </div>
            )}
          </div>

          {/* DELIVERY PREFERENCE */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-end mb-4">
              <h3 className="font-bold text-slate-700 text-lg">
                Delivery Preference
              </h3>
              {/* <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                {cart.length} Item{cart.length !== 1 ? "s" : ""}
              </span> */}
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
                    {selectedSlot ? getDisplayDeliveryText() : "Select a slot"}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
            </div>

            {/* <button
              onClick={() => setShowInstructionModal(true)}
              className="mt-3 text-xs font-semibold text-slate-600 underline flex items-center gap-1"
            >
              <FileText className="w-3 h-3" />
              Add delivery instructions (optional)
            </button> */}
          </div>

          {/* CART ITEMS */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-700 text-lg">Your Items</h3>

              <button
                disabled={clearLoading}
                onClick={handleClearCart}
                className={`px-4 py-2 border rounded-lg text-sm font-bold transition
    ${
      clearLoading
        ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-200"
        : "text-red-500 border-red-400 hover:bg-red-50"
    }
  `}
              >
                {clearLoading ? "Clearing..." : "Clear Cart"}
              </button>
            </div>

            {cart.length === 0 && (
              <p className="text-sm text-slate-500">Your cart is empty.</p>
            )}

            <div className="space-y-4">
              {cart.map((item) => {
                const loading = itemLoadingId === item.cart_id;

                return (
                  <div
                    key={item.cart_id}
                    className="flex gap-4 items-start border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 relative"
                  >
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-20 h-20 rounded-xl object-cover bg-slate-100"
                    />

                    <div className="flex-1">
                      {/* TOP ROW */}
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

                        <p className="font-bold text-slate-800">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>

                      {/* BOTTOM ROW (QTY + DELETE RIGHT SIDE) */}
                      <div className="flex justify-between items-center mt-3">
                        {/* QTY BUTTON */}
                        <div
                          className={`flex items-center rounded-lg ${theme.primary} text-white font-bold h-8 shadow-md`}
                        >
                          <button
                            disabled={loading}
                            onClick={() =>
                              updateQty(item.cart_id, item.quantity - 1)
                            }
                            className={`px-3 h-full hover:bg-black/10 transition ${
                              loading ? "opacity-60 cursor-not-allowed" : ""
                            }`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <span className="px-2 text-sm min-w-[20px] text-center">
                            {item.quantity}
                          </span>

                          <button
                            disabled={loading}
                            onClick={() =>
                              updateQty(item.cart_id, item.quantity + 1)
                            }
                            className={`px-3 h-full hover:bg-black/10 transition ${
                              loading ? "opacity-60 cursor-not-allowed" : ""
                            }`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* DELETE BUTTON */}
                        <button
                          disabled={loading}
                          onClick={() => handleDeleteItem(item.cart_id)}
                          className={`w-9 h-9 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-600 shadow-sm transition ${
                            loading ? "opacity-60 cursor-not-allowed" : ""
                          }`}
                          title="Remove item"
                        >
                          {loading ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BESTSELLERS SECTION */}
          {/* <div className="mt-8">
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
          </div> */}
        </div>

        {/* RIGHT COLUMN – BILL CARD + DESKTOP CTA */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* BILL CARD */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              {deliveryFee !== 0 && (
                <div className="bg-white p-4  border-slate-100 mt-2">
                  <p
                    className="text-center text-sm font-extrabold
      bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600
      bg-clip-text text-transparent
      animate-pulse"
                  >
                    ✨ FREE Delivery above ₹150 ✨
                  </p>
                </div>
              )}

              <h4 className="font-bold text-slate-800 text-lg mb-4">
                Bill Details
              </h4>
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

                {/* COUPON ROW (VISUAL ONLY) */}
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                    <span>{appliedCoupon.code}</span>
                    <span>-₹{appliedCoupon.discount}</span>
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
                    <selectedPayment.icon
                      className={`w-5 h-5 ${theme.primaryText}`}
                    />
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
  onClick={placeOrder}
  disabled={!canPlaceOrder || orderLoading}
  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all
    ${
      canPlaceOrder && !orderLoading
        ? `${theme.primary} text-white hover:brightness-110 active:scale-95`
        : "bg-slate-300 text-slate-500 cursor-not-allowed"
    }`}
>
  {orderLoading ? "Placing Order..." : canPlaceOrder ? "Place Order" : `Add ₹${amountNeeded} more`}
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
            onClick={placeOrder}
            disabled={!canPlaceOrder  || orderLoading } 
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

      {/* COUPON SELECTION MODAL (UPDATED - No Manual Input) */}
      {showCouponModal && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-0 md:p-6">
          <div className="bg-slate-50 w-full md:max-w-md rounded-t-3xl md:rounded-3xl h-[85vh] md:h-[700px] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 md:shadow-2xl">
            {/* Modal Header */}
            <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-slate-100 shadow-sm z-10">
              <h2 className="text-lg font-bold text-slate-800">Apply Coupon</h2>
              <button
                onClick={() => setShowCouponModal(false)}
                className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Coupon List (MOCK DATA VISIBLE) */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Available Offers
                </p>
                <div className="space-y-4">
                  {availableCoupons.map((coupon) => {
                    const status = getCouponStatus(coupon);
                    const isApplied =
                      appliedCoupon?.code === coupon.coupon_code;

                    return (
                      <div
                        key={coupon.coupon_id}
                        className={`relative bg-white rounded-xl border p-4 transition-all
      ${
        isApplied
          ? "border-green-500 ring-1 ring-green-500"
          : "border-slate-200"
      }`}
                      >
                        {/* LEFT BORDER */}
                        <div
                          className={`absolute top-0 left-0 h-full w-1 rounded-l-xl 
        ${isApplied ? "bg-green-500" : "bg-slate-300"}`}
                        />

                        <div className="flex justify-between items-start pl-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-1 text-xs font-bold bg-slate-100 rounded">
                                {coupon.coupon_code}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold
    ${
      coupon.discount_type === "PERCENT"
        ? "bg-blue-100 text-blue-700"
        : "bg-purple-100 text-purple-700"
    }
  `}
                              >
                                {coupon.discount_type === "PERCENT"
                                  ? "PERCENT"
                                  : "FLAT"}
                              </span>

                              {isApplied && (
                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                  APPLIED
                                </span>
                              )}

                              {coupon.is_used && (
                                <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                                  USED
                                </span>
                              )}
                            </div>

                            <p className="text-sm text-slate-600">
                              {coupon.discount_type === "PERCENT"
                                ? `${coupon.discount_value}% OFF`
                                : `₹${coupon.discount_value} OFF`}
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                              Min order ₹{coupon.min_order_value}
                            </p>

                            {/* ❗ CONDITION MESSAGE */}
                            {status === "MIN_NOT_MET" && (
                              <p className="text-xs text-orange-500 mt-1">
                                Add ₹{getRemainingAmount(coupon)} more to use
                                this coupon
                              </p>
                            )}

                            {status === "USED" && (
                              <p className="text-xs text-red-500 mt-1">
                                This coupon was already used
                              </p>
                            )}
                          </div>

                          <button
                            disabled={status !== "AVAILABLE"}
                            onClick={() => handleApplySpecificCoupon(coupon)}
                            className={`px-4 py-2 text-xs font-bold rounded-lg
            ${
              status === "AVAILABLE"
                ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
                          >
                            {isApplied
                              ? "APPLIED"
                              : status === "USED"
                              ? "USED"
                              : "APPLY"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLOT MODAL */}
      {showSlotModal && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-6">
          <div className="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-3xl p-5 md:p-8 max-h-[80vh] overflow-y-auto relative">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                Select delivery slot
              </h2>
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
                    <span
                      className={`font-bold text-sm ${
                        active ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {d.label}
                    </span>
                    <span
                      className={`text-xs ${
                        active ? "opacity-80" : "text-slate-400"
                      }`}
                    >
                      {d.sub}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* SLOT LIST */}
            <div className="space-y-3 mb-24 md:mb-8">
              {/* 🔥 ASAP OPTION */}
              <button
                onClick={() => setSelectedSlot("Deliver Immediately")}
                className={`w-full text-left py-3 px-3 rounded-lg border text-sm font-medium transition-all ${
                  selectedSlot === "Deliver Immediately"
                    ? `${theme.light} ${theme.border} ${theme.primaryText} ring-1`
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                🚀 Deliver Immediately
              </button>

              {/* AVAILABLE SLOTS */}
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
                onClick={() => {
                  if (!selectedSlot) {
                    setSelectedSlot("Deliver Immediately");
                  }
                  setShowSlotModal(false);
                }}
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
              <h3 className="font-bold text-lg text-gray-800">
                Delivery Instructions
              </h3>
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
              {/* <button
                onClick={() => setShowInstructionModal(false)}
                className={`w-full ${theme.primary} text-white font-bold py-3 rounded-xl mt-2`}
              >
                Confirm
              </button> */}
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-0 md:p-4">
          <div className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-3xl p-5 md:p-6 overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                Select Payment Method
              </h2>
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
                    <div
                      className={`p-2 rounded-lg ${theme.light} ${theme.primaryText}`}
                    >
                      <opt.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{opt.name}</p>
                      <p className="text-xs text-slate-400">{opt.desc}</p>
                    </div>
                  </div>
                  {selectedPayment.id === opt.id && (
                    <div
                      className={`w-5 h-5 rounded-full ${theme.primary} flex items-center justify-center`}
                    >
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
              <h2 className="text-xl font-bold text-slate-800">
                Select Address
              </h2>
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
                onClick={() => navigate("/add-address")}
                className={`w-full p-4 border border-dashed ${theme.border} ${theme.light} rounded-xl flex items-center gap-3 hover:brightness-95 transition`}
              >
                <PlusCircle className={`w-5 h-5 ${theme.primaryText}`} />
                <span className={`font-bold ${theme.primaryText}`}>
                  Add New Address
                </span>
              </button>

              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-4">
                Saved Addresses
              </h3>

              {savedAddresses.map((addr) => {
                const isSelected =
                  selectedAddress?.address_id === addr.address_id;

                // pick correct icon
                const Icon = iconMap[addr.address_type] || MapPin;

                return (
                  <div
                    key={addr.address_id}
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
                    {/* ICON BOX */}
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? theme.light : "bg-slate-100"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isSelected ? theme.primaryText : "text-slate-500"
                        }`}
                      />
                    </div>

                    {/* TEXT */}
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4
                          className={`font-bold text-sm ${
                            isSelected ? "text-slate-800" : "text-slate-600"
                          }`}
                        >
                          {addr.address_type}
                        </h4>

                        {isSelected && (
                          <CheckCircle2
                            className={`w-4 h-4 ${theme.primaryText}`}
                          />
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {addr.full_address}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <Footer theme={theme} />
    </div>
  );
};

export default cartpage;
