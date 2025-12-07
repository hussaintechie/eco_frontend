import axios from "axios";

export const API_BASE = "http://192.168.56.1:5000/auser";

const API = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// List all addresses
export const fetchAddresses = () => API.get("/list");

// Add address
export const addAddress = (payload) => API.post("/add", payload);

// Edit address
export const editAddress = (id, payload) => API.put(`/edit/${id}`, payload);

// Delete
export const removeAddress = (id) => API.delete(`/delete/${id}`);

// Get address details
export const getAddressDetails = (id) => API.get(`/details/${id}`);

// Autofill
export const autofill = (lat, lng) =>
  API.get(`/autofill-location?lat=${lat}&lng=${lng}`);
