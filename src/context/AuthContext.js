import jwtDecode from "jwt-decode";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_PATH } from "../Settings";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null
  );
  const [authTokens, setAuthTokens] = useState(
    localStorage.getItem("userTokens")
      ? JSON.parse(localStorage.getItem("userTokens"))
      : null
  );

  const navigate = useNavigate();
  const [refreshed, setRefreshed] = useState(false);

  const successResponse = async (data) => {
    setRefreshed(true);
    setAuthTokens(data);

    saveUserInfo(jwtDecode(data.access));
    localStorage.setItem("userTokens", JSON.stringify(data));
  };

  const saveUserInfo = async (data) => {
    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
  };

  const updateToken = async () => {
    if (refreshed) {
      console.error("Untimely access to refresh token");
      return logoutUser();
    }

    const url = BACKEND_PATH + "user/token/refresh/";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: authTokens.refresh,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      successResponse(data);
      return data;
    }

    logoutUser();
  };

  const logoutUser = () => {
    console.log("Logout");

    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("userTokens");
    localStorage.removeItem("userCart");

    navigate("/login/");
  };

  const changeUserBalance = async (action, count) => {
    let newBalance = user.balance;

    if (action === "increase") {
      newBalance += count;
    }

    if (action === "decrease") {
      newBalance -= count;
    }

    saveUserInfo({ ...user, balance: newBalance });
  };

  useEffect(() => {
    if (refreshed)
      setTimeout(() => setRefreshed(false), 14 * 60 * 1000);
  }, [refreshed]);

  return (
    <AuthContext.Provider
      value={{
        user,
        authTokens,
        updateToken,
        successResponse,
        logoutUser,
        changeUserBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
