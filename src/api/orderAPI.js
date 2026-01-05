import API from "./auth"


export const getUserOrdersAPI = ()=>
{
    return API.post("/product/getuserorders")
};

export const getSingleOrderAPI = (orderid) => {
  return API.post("/product/singleorddetail", { orderid });
  
};

export const getSingleOrderDetailAPI = (orderid) => {
  return API.post("/product/singleorddetail", {
    orderid
  });
};

export const reorderAPI = (order_id) =>
  API.post("/ruser/reorder", { order_id });



export const trackOrderAPI = (order_id) => {
  return API.post("/tuser/trackOrder", { order_id });
};
