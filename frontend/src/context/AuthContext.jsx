import { createContext, useContext, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem("mp_admin");
    return stored ? JSON.parse(stored) : null;
  });

  // Shared by login, password reset and profile updates — keeps localStorage and
  // React state in sync in one place instead of repeating it in three pages.
  const setSession = (data) => {
    const { token, ...adminData } = data;
    if (token) localStorage.setItem("mp_token", token);
    localStorage.setItem("mp_admin", JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("mp_token");
    localStorage.removeItem("mp_admin");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
