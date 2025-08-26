import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Configure axios defaults
export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/auth/get-user-data");

      if (response.data.success) {
        setIsLoggedIn(true);
        setUserData(response.data.data);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error(
        "Error fetching user data:",
        error.response?.data?.message || error.message
      );
      setIsLoggedIn(false);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await api.post("/api/auth/logout", {});

      if (response.data.success) {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    logout,
    loading,
    setLoading,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
