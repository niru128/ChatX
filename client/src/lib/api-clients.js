import axios from "axios";
import { HOST } from "../utils/constants";

const apiClients = axios.create({
  baseURL: HOST,
});

apiClients.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // stored after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClients;
