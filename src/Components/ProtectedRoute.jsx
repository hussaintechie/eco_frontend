import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

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
