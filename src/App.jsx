import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginForm from "./Components/LoginForm.jsx";
import OtpPage from "./Components/OtpPage.jsx";
import ForgotPasswordForm from "./Components/ForgotPasswordForm.jsx";
import ResetPasswordForm from "./Components/ResetPasswordForm.jsx";

import MainContent from "./Components/home.jsx";
import CreativeCategoryPage from "./Components/CreativeCategoryPage.jsx";
import GroceriesPage from "./Components/GroceriesPage.jsx";
import ProfilePage from "./Components/ProfilePage.jsx";
import CartPage from "./Components/CartPage.jsx";
import SavedAddressesPage from "./Components/SavedAddressesPage.jsx";
import MyOrdersPage from "./Components/MyOrdersPage.jsx";
import SettingsPage from "./Components/SettingsPage.jsx";
import AddNewAddressPage from "./Components/AddNewAddressPage.jsx";
import SavedProducts from "./Components/SavedProducts.jsx";
import SearchPage from "./Components/SearchPage.jsx";
import TrackOrderPage from "./Components/TrackOrderPage.jsx";
import OrderDetailPage from "./Components/OrderDetailPage.jsx";
import EditAddressPage from "./Components/EditAddressPage.jsx";
import PostPaymentDeliveryFlow from "./Components/PostPaymentDeliveryFlow.jsx";
import Help from "./Components/Help.jsx";
import { CartProvider } from "../src/context/CartContext.jsx";
import ProtectedRoute from "./Components/ProtectedRoute";
import { iswebview } from "./utils/isWebView";
import { Toaster } from "react-hot-toast";
/* ✅ SMART LANDING COMPONENT */

function LandingRedirect() {
  const isApp =
    new URLSearchParams(window.location.search).get("from") === "app";
  const token = localStorage.getItem("token");

  // ✅ Logged in → Home (app & browser)
  if (token) {
    return <Navigate to="/home" replace />;
  }

  // ✅ React Native WebView → Login
  if (isApp) return <Navigate to="/login" replace />;
  // ✅ Browser without login → Home (ProtectedRoute will decide)
  return <Navigate to="/home" replace />;
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          {/* ENTRY */}
          <Route path="/" element={<LandingRedirect />} />
          {/* PUBLIC */}
          <Route path="/home" element={<MainContent />} /> {/* ✅ PUBLIC */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/ForgotPassword" element={<ForgotPasswordForm />} />
          <Route path="/ResetPasswordForm" element={<ResetPasswordForm />} />
          <Route path="/groceries" element={<GroceriesPage />} />
          {/* PROTECTED */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/category" element={<CreativeCategoryPage />} />
            <Route path="Help" element={<Help/>}/>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/addresses" element={<SavedAddressesPage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/add-address" element={<AddNewAddressPage />} />
            <Route path="/saved" element={<SavedProducts />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/track-order/:orderid" element={<TrackOrderPage />} />
            <Route path="/order/:orderid" element={<OrderDetailPage />} />
            <Route path="/edit-address" element={<EditAddressPage />} />
            <Route
              path="/PostPaymentDeliveryFlow"
              element={<PostPaymentDeliveryFlow />}
            />
          </Route>
        </Routes>

        {/* ✅ TOAST CONTAINER (ONLY ONCE) */}
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
        />
      </BrowserRouter>
    </CartProvider>
  );
}
export default App;
