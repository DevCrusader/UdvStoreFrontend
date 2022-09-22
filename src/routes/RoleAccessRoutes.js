import React, { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const RoleAccessRoutes = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user.role === "Administrator" || user.role === "Moderator")
    return <Outlet />;
  return navigate("/access-error/");
};

export default RoleAccessRoutes;
