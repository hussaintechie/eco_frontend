import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import {CartProvider} from "../src/context/CartContext.jsx";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <CartProvider>
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/ForgotPassword" element={<ForgotPasswordForm />} />
        <Route path="/ResetPasswordForm" element={<ResetPasswordForm />} />

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<MainContent />} />
          <Route path="/category" element={<CreativeCategoryPage />} />
          <Route path="/groceries" element={<GroceriesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
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
    </BrowserRouter>
    </CartProvider>
  );
}

export default App;
