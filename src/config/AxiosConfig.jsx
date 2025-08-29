import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = axios.create({
    baseURL: 'http://localhost:8081',
    headers: {
        'Content-Type': 'application/json'
    }
});


API.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token'); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;   
    },
    error => {
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            const navigate = useNavigate();
            localStorage.removeItem('token');
            navigate('/');
        }
        return Promise.reject(error);
    }
)

export default API;