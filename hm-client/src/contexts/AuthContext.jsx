import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthContextProvider(props) {
  const initialAuthenticated = localStorage.getItem("authenticated") || false;

  const initialToken = localStorage.getItem("token") || " ";

  const retrievedToken = initialToken ? initialToken.trim() : "";

  const [token, setToken] = useState(retrievedToken);

  const [authenticated, setAuthenticated] = useState(initialAuthenticated);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  // Use useEffect to update localStorage when isAuthenticated changes
  useEffect(() => {
    localStorage.setItem("authenticated", authenticated);
  }, [authenticated]);

  const values = { authenticated, setAuthenticated, token, setToken };

  return (
    <AuthContext.Provider value={values}>{props.children}</AuthContext.Provider>
  );
}
