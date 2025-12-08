import API from "./auth";

// ✔ Fetch all saved addresses
export const fetchAddresses = () =>
  API.get("/auser/list");

// ✔ Delete address
export const deleteAddressAPI = (id) =>
  API.delete(`/auser/delete/${id}`);

// ✔ Edit address
export const editAddressAPI = (id, data) =>
  API.put(`/auser/edit/${id}`, data);

// ✔ Get single address
export const getAddressDetailsAPI = (id) =>
  API.get(`/auser/details/${id}`);

// ✔ Set default address (FINAL working API)
export const setDefaultAPI = (id) =>
  API.post(`/auser/set-default/${id}`);
