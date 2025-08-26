import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/auth/get-user-data`, {
        withCredentials: true,
      });

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
      const response = await axios.post(
        `${backendUrl}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const value = {
    backendUrl,
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
