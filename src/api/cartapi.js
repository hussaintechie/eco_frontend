import API from "./auth";

// ---------------- CART CRUD ----------------

// Add to cart
export const addToCartAPI = (product_id, qty = 1) =>
  API.post("/cuser/addcart", { product_id, quantity: qty });

// Get cart items
export const getCartAPI = () =>
  API.get("/cuser/list");

// Update quantity
export const updateCartQtyAPI = (cart_id, quantity) =>
  API.put("/cuser/updatecart", { cart_id, quantity });

// Remove one item
export const removeCartItemAPI = (cart_id) =>
  API.delete("/cuser/removecart", { data: { cart_id } });

// Clear entire cart
export const clearCartAPI = () =>
  API.delete("/cuser/clearcart");

// ---------------- BILL & DELIVERY ----------------

// Bill calculation
export const getCartBillAPI = () =>
  API.get("/cuser/bill");

// Delivery slots
export const getDeliverySlotsAPI = () =>
  API.get("/cuser/delivery-slots");
