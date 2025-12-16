import React, { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Circle,
  Truck,


    
  Package,
  MoreVertical,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/auth";

// ---------------- STATUS FLOW ----------------
const STATUS_FLOW = [
  { key: "pending", label: "Order Placed", icon: Package },
  { key: "out_for_delivery", label: "Out for Delivery", icon: MapPin },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const TrackOrderPage = () => {
  const navigate = useNavigate();
  const { orderid } = useParams();

  const [trackingSteps, setTrackingSteps] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // ---------------- FETCH TRACK ORDER ----------------
  useEffect(() => {
    const fetchTrackOrder = async () => {
      try {
        const res = await API.post("/tuser/trackOrder", {
          order_id: orderid,
        });

        if (res.data.status === 1) {
          // 🔥 normalize backend status
          const backendSteps = res.data.data.map((s) => ({
            ...s,
            status: s.status.toLowerCase(),
          }));

          const lastStatus =
            backendSteps[backendSteps.length - 1]?.status;

          const uiSteps = STATUS_FLOW.map((step) => {
            const found = backendSteps.find(
              (b) => b.status === step.key
            );

            return {
              label: step.label,
              icon: step.icon,
              time: found
                ? new Date(found.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "",
              status: found
                ? step.key === lastStatus
                  ? "current"
                  : "completed"
                : "pending",
            };
          });

          setTrackingSteps(uiSteps);
        }
      } catch (err) {
        console.error("Track order error", err);
      }
    };

    fetchTrackOrder();
  }, [orderid]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* HEADER */}
      <div className="p-4 flex justify-between items-center bg-white shadow">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="font-bold">Order #{orderid}</div>

        <div ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center"
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* MAP MOCK */}
      <div className="h-[40vh] bg-slate-200 flex items-center justify-center">
        <div className="bg-indigo-600 p-3 rounded-full text-white animate-bounce">
          <Truck size={24} />
        </div>
      </div>

      {/* TRACKING */}
      <div className="bg-white rounded-t-3xl -mt-6 p-6 flex-1">
        <div className="relative">
          <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-slate-100" />

          <div className="space-y-6">
            {trackingSteps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2
                  ${
                    step.status === "completed"
                      ? "bg-indigo-600 text-white"
                      : step.status === "current"
                      ? "bg-white text-indigo-600 border-indigo-200 ring-4 ring-indigo-50"
                      : "bg-white text-slate-300 border-slate-200"
                  }`}
                >
                  {step.status === "completed" ? (
                    <CheckCircle2 size={18} />
                  ) : step.status === "pending" ? (
                    <Circle size={14} />
                  ) : (
                    <step.icon size={18} />
                  )}
                </div>

                <div>
                  <h4
                    className={`text-sm font-bold ${
                      step.status === "pending"
                        ? "text-slate-400"
                        : "text-slate-800"
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p className="text-xs text-slate-400">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
 