import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

import "../static/css/udvHeader.css";
import NumberWithIcon from "../utils/NumberWIthUcoin";

const UdvHeader = () => {
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <div className="header udv-header">
      <ul>
        <li>
          <Link className="store back-img-center" to="/udv/store/"></Link>
        </li>
        {user && (
          <>
            {user.role === "Administrator" || user.role === "Moderator" ? (
              <li>
                <Link className="admin" to={"/admin/"}>
                  Админ-панель
                </Link>
              </li>
            ) : (
              <li></li>
            )}
            <li>
              <NumberWithIcon number={user.balance} ucoinColor={"white"} />
            </li>
          </>
        )}
        <li>
          <button className="logout-btn back-img-center" onClick={logoutUser}>
            Выйти
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UdvHeader;
