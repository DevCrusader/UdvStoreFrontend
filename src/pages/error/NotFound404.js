import React from "react";
import { Link, useLocation } from "react-router-dom";

const NotFound404 = () => {
  const path = useLocation();

  return (
    <div style={{ textAlign: "center", marginTop: "15vh" }}>
      <h2>404 Error</h2>
      <p>
        Путь <span style={{ color: "#00D19C" }}>{path.pathname}</span>{" "}
        не найден.
      </p>
      <p>
        Вернуться в магазин:{" "}
        <Link to="udv/store" style={{ color: "#00D19C" }}>
          Udv-store
        </Link>
        .
      </p>
    </div>
  );
};

export default NotFound404;
