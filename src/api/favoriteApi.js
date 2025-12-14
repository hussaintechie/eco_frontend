import axios from "axios";

const API = "http://localhost:5000/fuser";

export const getFavorites = async (token) => {
  return axios.get(API, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const toggleFavorite = async (product_id, token) => {
  return axios.post(
    `${API}/toggle`,
    { product_id },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};
