import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainContent from "./Components/home.jsx";
import LoginForm from "./Components/LoginForm.jsx";
import OtpPage from "./Components/OtpPage.jsx";
import CreativeCategoryPage from "./Components/CreativeCategoryPage.jsx";
import GroceriesPage from "./Components/GroceriesPage.jsx";
import CheckoutPage from "./Components/CheckoutPage.jsx";
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
import ForgotPasswordForm from "./Components/ForgotPasswordForm.jsx"
import ResetPasswordForm from "./Components/ResetPasswordForm.jsx"
import PostPaymentDeliveryFlow from "./Components/PostPaymentDeliveryFlow.jsx"


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home Route */}
        <Route path="/home" element={<MainContent />} /> 
        {/* OR your home page of choice */}

        {/* Auth Routes */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path ="/ForgotPassword" element ={< ForgotPasswordForm/>} />
        <Route path ="/ResetPasswordForm" element ={<ResetPasswordForm/>} />

        {/* Main App Pages */}
        <Route path="/category" element={<CreativeCategoryPage />} />
        <Route path="/groceries" element={<GroceriesPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        
        <Route path="/addresses" element={<SavedAddressesPage />} />
        <Route path="/orders" element={<MyOrdersPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/add-address" element={<AddNewAddressPage />} />
        <Route path="/saved" element={<SavedProducts />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/order-details" element={<OrderDetailPage />} />
        <Route path="/edit-address" element={<EditAddressPage />} />
        <Route path ="/PostPaymentDeliveryFlow" element={<PostPaymentDeliveryFlow/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
