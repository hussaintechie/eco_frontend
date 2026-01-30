import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  useEffect(() => {
    if (!token && location.pathname !== "/home") {
      toast.error("Please login first");
    }
  }, [token, location.pathname]);
  // ✅ Allow guests on HOME
  if (!token && location.pathname === "/home") {
    return <Outlet />;
  }

  // 🔐 Protect everything else
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
