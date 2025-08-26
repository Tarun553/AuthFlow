// import axios from "axios";

// const API_URL = "http://localhost:3000/api";

// // Create axios instance with base URL and credentials
// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true, // Important for sending cookies with requests
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add a request interceptor to include auth token if available
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add a response interceptor to handle errors globally
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     // Handle 401 Unauthorized errors (e.g., token expired)
//     if (error.response?.status === 401) {
//       // You might want to handle token refresh here if needed
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// // Auth API methods
// const authAPI = {
//   // Authentication
//   login: (email, password) => api.post("/auth/login", { email, password }),
//   register: (userData) => api.post("/auth/register", userData),
//   logout: () => api.post("/auth/logout"),

//   // Email Verification
//   sendVerificationEmail: () => api.post("/auth/send-verify-otp"),
//   verifyEmail: (otp) => api.post("/auth/verify-otp", { otp }),

//   // Password Reset
//   sendPasswordResetOtp: (email) => api.post("/auth/send-reset-otp", { email }),
//   resetPassword: (token, newPassword) =>
//     api.post("/auth/reset-password", { token, newPassword }),

//   // Session
//   // checkAuth: () => api.post("/auth/is-authenticated"),

//   // User Profile
//   // getCurrentUser: () => api.get("/auth/me"),
// };

// export { api, authAPI };

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axiosInstance;
