import React from "react";
import { useLocation } from "react-router-dom";

const NotFound404 = () => {
  const path = useLocation();

  return (
    <div style={{ textAlign: "center" }}>
      <h2>404 Error</h2>
      <p>
        Путь <span style={{ color: "#00D19C" }}>{path.pathname}</span> не
        найден.
      </p>
    </div>
  );
};

export default NotFound404;
