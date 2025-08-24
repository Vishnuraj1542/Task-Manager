import axios from "axios";
const api = axios.create({ baseURL: "http://localhost:8000/api" });
api.interceptors.request.use((config)=>{
  const t = localStorage.getItem("token");
  if(t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});
export default api;
