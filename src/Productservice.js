import axios from "axios";

const API =
  "https://ecommerce-backend-six-gules.vercel.app/api/products";

export const getProducts = () =>
  axios.get(API);

export const addProduct = (
  product
) =>
  axios.post(API, product);