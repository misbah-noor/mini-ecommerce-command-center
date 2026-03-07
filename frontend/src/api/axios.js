import axios from "axios";

const api = axios.create({
    baseURL: 
    "https://mini-ecommerce-command-center-production-03ee.up.railway.app",    
    //  "http://localhost:5000",
    withCredentials: true,
});

export default api;