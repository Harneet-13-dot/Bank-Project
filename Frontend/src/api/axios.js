import axios from "axios";
//upadated
const API = axios.create({
  baseURL: "https://bank-project-2-v1gt.onrender.com",
  withCredentials: true
});

export default API;
