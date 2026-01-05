import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Package,
  CreditCard
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { SEASON_CONFIG, getSeason } from "../SEASON_CONFIG";
import { getSingleOrderDetailAPI } from "../api/orderAPI";

const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { orderid } = useParams();

  const currentSeason = getSeason();
  const theme = SEASON_CONFIG[currentSeason];
  const SeasonIcon = theme.icon;

  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await getSingleOrderDetailAPI(orderid);
        if (res.data.status === 1) {
          setOrderData(res.data.data);
        }
      } catch (err) {
        console.error("Order detail fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderid]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading order details...</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Order not found</p>
      </div>
    );
  }

  /* 🔒 READ VALUES FROM DB (NO RECALCULATION) */
 const subtotal = Number(orderData?.billdetails?.item_total || 0);
const handlingFee = Number(orderData?.billdetails?.handling_fee || 0);
const deliveryFee = Number(orderData?.billdetails?.delivery_fee || 0);
const discount = Number(orderData?.billdetails?.discount || 0);
const grandTotal = Number(orderData?.billdetails?.total_amount || 0);

  return (
    <div className={`min-h-screen ${theme.gradient} pb-24`}>

      {/* HEADER (UNCHANGED) */}
      <div className="bg-white sticky top-0 z-20 shadow-sm px-4 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-slate-50 transition"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="flex-1">
          <h1 className="font-bold text-lg">Order Details</h1>
          <p className="text-xs text-slate-500">Order ID: #{orderid}</p>
        </div>

        <div
          className={`px-3 py-1 rounded-full ${theme.light} ${theme.primaryText} text-xs font-bold flex items-center gap-1`}
        >
          <SeasonIcon size={12} /> {theme.name}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto p-4 space-y-5">

        {/* ITEMS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-slate-500" />
            <h3 className="font-bold text-slate-800">
              Items ({orderData.itmdetails.length})
            </h3>
          </div>

          {orderData.itmdetails.map((item, index) => (
            <div
              key={index}
              className="px-5 py-4 flex justify-between items-center border-b last:border-b-0"
            >
              <div>
                <p className="font-semibold text-slate-800">
                  {item.itmname}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {item.qty} × {item.unit}
                </p>
              </div>

              <p className="font-bold text-slate-900">
                ₹{item.total}
              </p>
            </div>
          ))}
        </div>

        {/* ADDRESS & PAYMENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* ADDRESS */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold flex items-center gap-2 mb-3 text-slate-800">
              <MapPin size={18} /> Delivery Address
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {orderData.address}
            </p>
          </div>

          {/* PAYMENT */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold flex items-center gap-2 mb-3 text-slate-800">
              <CreditCard size={18} /> Payment Details
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Method</span>
                <span className="font-semibold text-slate-800">
                  {orderData.paydetails.pay_mode}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-semibold text-slate-800">
                  {orderData.paydetails.pay_date}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* BILL SUMMARY */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">
            Bill Summary
          </h3>

        <div className="space-y-3 text-sm">

  <div className="flex justify-between text-slate-600">
    <span>Subtotal</span>
    <span>₹{subtotal}</span>
  </div>

  <div className="flex justify-between text-slate-600">
    <span>Handling Fee</span>
    <span>₹{handlingFee}</span>
  </div>

  <div className="flex justify-between text-slate-600">
    <span>Delivery Fee</span>
    <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
  </div>

  {/* ✅ COUPON */}
 {discount > 0 && (
  <div className="flex justify-between items-center bg-green-50 border border-green-200 px-3 py-2 rounded-lg text-green-700">
    <span>🎉 {orderData.billdetails.coupon_code}</span>
    <span>-₹{discount}</span>
  </div>
)}



  <div className="border-t pt-3 flex justify-between items-center">
    <span className="text-base font-bold text-slate-900">Grand Total</span>
    <span className={`text-xl font-extrabold ${theme.primaryText}`}>
      ₹{grandTotal}
    </span>
  </div>

</div>

        </div>

      </div>
    </div>
  );
};

export default OrderDetailPage;
