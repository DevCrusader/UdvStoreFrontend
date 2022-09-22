import jwtDecode from "jwt-decode";
import React, { createContext, useEffect, useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(
    localStorage.getItem("userTokens")
      ? jwtDecode(localStorage.getItem("userTokens"))
      : null
  );
  const [authTokens, setAuthTokens] = useState(
    localStorage.getItem("userTokens")
      ? JSON.parse(localStorage.getItem("userTokens"))
      : null
  );

  const [refreshed, setRefreshed] = useState(false);

  const successResponse = async (data) => {
    setRefreshed(true);
    setAuthTokens(data);
    setUser(jwtDecode(data.access));
    localStorage.setItem("userTokens", JSON.stringify(data));
  };

  const loginUser = async (e) => {
    e.preventDefault();

    console.log("tryToLogin");

    if (user) return;

    const url = "https://udvstore.pythonanywhere.com/user/token/";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      successResponse(data);
      navigate("udv/store/");
    } else {
      alert("Something went wrong...");
    }
  };

  const updateToken = async () => {
    if (refreshed) {
      console.error("Untimely access to refresh token");
      return logoutUser();
    }

    const url = "https://udvstore.pythonanywhere.com/user/token/refresh/";
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
      return data.access;
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

  const authFetch = async (url, options) => {
    const _fetch = async (token) => {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      return response;
    };

    const firstRes = await _fetch(new String(authTokens.access));

    if (firstRes.status === 401) {
      const updatedAccessToken = await updateToken();
      if (!updatedAccessToken) return;

      const secondaryRes = await _fetch(updatedAccessToken);

      if (secondaryRes.status === 401) {
        return logoutUser();
      }
      return secondaryRes;
    } else {
      return firstRes;
    }
  };

  const updateUserBalance = async () => {
    const response = await authFetch(
      "https://udvstore.pythonanywhere.com/user/balance/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (response.status === 200)
      if (user) setUser({ ...user, balance: data.balance });
  };

  useEffect(() => {
    if (refreshed) setTimeout(() => setRefreshed(false), 9 * 60 * 1000);
  }, [refreshed]);

  useEffect(() => {
    updateUserBalance();
  }, [authTokens]);

  return (
    <AuthContext.Provider
      value={{
        user,
        authTokens,
        updateToken,
        loginUser,
        authFetch,
        logoutUser,
        updateUserBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
