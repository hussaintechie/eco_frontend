import API from "./auth";

// check if user already reviewed
export const getReviewStatusAPI = () => {
  return API.get("/review/status");
};

// submit first-time review
export const submitReviewAPI = (data) => {
  return API.post("/review/submit", data);
};
