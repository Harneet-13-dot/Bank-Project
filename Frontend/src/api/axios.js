import axios from "axios";

const API = axios.create({
  baseURL: "https://bank-project-ixg4.onrender.com",
  withCredentials: true
});

export default API;
