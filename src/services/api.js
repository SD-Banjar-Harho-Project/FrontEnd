// src/services/api.js → VERSI FINAL YANG BISA SEMUA!

import axios from "axios";

// Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

// REQUEST INTERCEPTOR → tambah token otomatis
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR → KUNCI UTAMA: RETURN response.data UNTUK SEMUA!
api.interceptors.response.use(
  (response) => {
    // SELALU return response.data → ini yang membuat semua API call mudah
    // Termasuk login → response.data.token langsung bisa diakses
    return response.data;
  },
  (error) => {
    // Error handling global
    const status = error.response?.status;

    if (status === 401) {
      console.warn("Token expired atau tidak valid → logout otomatis");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/login";
      }
    }

    if (status === 403) alert("Akses ditolak!");
    if (status === 404) console.warn("Endpoint tidak ditemukan:", error.config?.url);
    if (status === 500) console.error("Server error!");

    return Promise.reject(error);
  }
);

export default api;