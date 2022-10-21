import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const RoleAccessRoutes = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.permission) return navigate("../../access-error");
  }, [user]);

  if (user.permission) return <Outlet />;
};

export default RoleAccessRoutes;
