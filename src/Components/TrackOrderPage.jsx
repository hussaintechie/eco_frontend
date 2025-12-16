import React, { useEffect, useState } from "react";
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

// default UI before API
const DEFAULT_STEPS = STATUS_FLOW.map((s) => ({
  ...s,
  status: "pending",
  time: "",
}));

const TrackOrderPage = () => {
  const navigate = useNavigate();
  const { orderid } = useParams();

  const [trackingSteps, setTrackingSteps] = useState(DEFAULT_STEPS);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH TRACK ORDER ----------------
  useEffect(() => {
    if (!orderid) return; // 🔴 guard

    const fetchTrackOrder = async () => {
      try {
        const res = await API.post("/tuser/trackOrder", {
          order_id: orderid,
        });

        if (res.data.status === 1 && res.data.data.length) {
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
      } finally {
        setLoading(false);
      }
    };

    fetchTrackOrder();
  }, [orderid]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 flex flex-col">
      {/* HEADER */}
      <div className="p-4 flex justify-between items-center bg-white shadow">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="font-bold">Order #{orderid || "--"}</div>

        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
          <MoreVertical size={18} />
        </div>
      </div>

      {/* MAP MOCK */}
      <div className="h-[35vh] bg-slate-200 flex items-center justify-center">
        <div className="bg-indigo-600 p-4 rounded-full text-white animate-bounce shadow-xl">
          <Truck size={26} />
        </div>
      </div>

      {/* TRACKING */}
      <div className="bg-white rounded-t-3xl -mt-6 p-6 flex-1">
        {loading && (
          <p className="text-center text-slate-500 font-semibold mb-4">
            Loading tracking status...
          </p>
        )}

        <div className="relative">
          <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-slate-200" />

          <div className="space-y-6">
            {trackingSteps.map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2
                  ${
                    step.status === "completed"
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : step.status === "current"
                      ? "bg-white border-indigo-400 text-indigo-600 ring-4 ring-indigo-100"
                      : "bg-white border-slate-300 text-slate-300"
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

                  {step.time && (
                    <p className="text-xs text-slate-500 mt-1">
                      {step.time}
                    </p>
                  )}

                  {step.status === "current" && (
                    <p className="text-xs text-indigo-600 font-semibold mt-1">
                      In progress
                    </p>
                  )}
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
