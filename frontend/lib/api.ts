import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// TO USE IN COMPONENTS
// import api from '@/lib/api';

// const res = await api.get('/users');

export default api;
