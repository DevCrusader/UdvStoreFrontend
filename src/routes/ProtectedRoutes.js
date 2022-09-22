import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import UdvHeader from "../components/UdvHeader";

const ProtectedRoutes = () => {
  const { user } = useContext(AuthContext);

  return user ? (
    <>
      <UdvHeader />
      <Outlet />
    </>
  ) : (
    <Navigate to="../login" />
  );
};

export default ProtectedRoutes;
