import API from "./auth.js";

export const sendOtp = (email) =>
  API.post("/auth/login", { email, sendOtp: true });

export const passwordLogin = (email, password) =>
  API.post("/auth/login", { email, password });

export const otpLogin = (email, otp) => API.post("/auth/login", { email, otp });
