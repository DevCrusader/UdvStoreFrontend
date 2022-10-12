import React from "react";
import { Link } from "react-router-dom";

const Forbidden403 = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "15vh" }}>
      <h2>403 Error</h2>
      <p>
        У вас недостаточно прав доступа. <br /> Свяжитесь с
        администратором сервиса.
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

export default Forbidden403;
