import API from "./auth";

export const applyCouponAPI = (coupon_code, cart_total) => {
  return API.post("/apply", {
    coupon_code,
    cart_total
  });
};
