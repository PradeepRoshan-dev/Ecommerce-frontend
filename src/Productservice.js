import axios from "axios";
import API_BASE_URL from "./config/api.js";

const API = `${API_BASE_URL}/api/products`;

export const getProducts = () =>
  axios.get(API);

export const addProduct = (
  product
) =>
  axios.post(API, product);