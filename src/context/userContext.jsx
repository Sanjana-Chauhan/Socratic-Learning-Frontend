import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("jwt-token") || "");

  const login = ({ userId, userName, token }) => {
    setUserId(userId);
    setUserName(userName);
    setToken(token);
    localStorage.setItem("jwt-token", token);
  };

  const logout = () => {
    setUserId(null);
    setUserName(null);
    setToken("");
    localStorage.removeItem("jwt-token");
  };

  return (
    <UserContext.Provider
      value={{ userId, userName, token, login, logout,setUserId }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use this context
export const useUser = () => useContext(UserContext);
