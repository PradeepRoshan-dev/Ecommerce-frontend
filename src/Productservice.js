import axios from "axios";

const API_BASE_URL =
  "https://ecommerce-backend-p1dv.onrender.com";

const API = `${API_BASE_URL}/api/products`;

export const getProducts = () => {
  return axios.get(API);
};

export const addProduct = (product) => {
  return axios.post(API, product);
};