import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // change later to LAN/devtunnel
  withCredentials: true,
});

// 🔥 Automatically attach JWT token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =============================
// AUTH FUNCTIONS
// =============================

export const sendOtp = (email) =>
  API.post("auth/login", { email, sendOtp: true });

export const passwordLogin = (email, password) =>
  API.post("auth/login", { email, password });

export const otpLogin = (email, otp) =>
  API.post("auth/login", { email, otp });

export default API;
