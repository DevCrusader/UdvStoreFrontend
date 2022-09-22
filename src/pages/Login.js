import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

import StoreIcon from "../static/svg/StoreIcon.svg";
import "../static/css/loginPage.css";

const Login = () => {
  const { loginUser } = useContext(AuthContext);

  useEffect(() => {
    console.log("You are in login page");
  });

  return (
    <div className="login-wrapper">
      <form onSubmit={loginUser}>
        <span className="decoration">
          <img className="back-img-center" src={StoreIcon} alt="Store-icon" />
          <span>
            Сервис для
            <br />
            сотрудников udv
          </span>
        </span>
        <div className="form-body">
          <>
            <label htmlFor="username-field">Логин</label>
            <input id="username-field" type="text" name="username" />
          </>
          <>
            <label htmlFor="password-field">Пароль</label>
            <input id="password-field" type="password" name="password" />
          </>
          <input type="submit" value="Войти" />
          <Link to="">Забыли пароль?</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
