import API from "./auth";

export const getProfileAPI = () => API.get("/puser");
export const updateProfileAPI = (data) => API.put("/puser/update", data);


export const reorderAPI = (order_id) =>
  API.post("/ruser/reorder", { order_id });
