import React, {
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import AuthContext from "../context/AuthContext";

import StoreIcon from "../static/svg/StoreIcon.svg";
import "../static/css/loginPage.css";

const Login = () => {
  const { loginUser } = useContext(AuthContext);

  const [passwordShow, togglePasswordShow] = useReducer(
    (passwordShow) => !passwordShow,
    false
  );

  const [errorFetch, setErrorFetch] = useState(false);

  const _loginUser = async (e) => {
    e.preventDefault();

    setErrorFetch(false);

    const resStatus = await loginUser(e);

    if (!resStatus) return;

    if (resStatus === 401) {
      setErrorFetch(true);
    } else {
      alert("Something went wrong....");
    }
  };

  return (
    <div className="login-wrapper">
      <form
        onSubmit={_loginUser}
        className={errorFetch ? "error" : ""}
      >
        <div className="decoration">
          <img
            className="back-img-center"
            src={StoreIcon}
            alt="Store-icon"
          />
          <span>
            Сервис для
            <br />
            сотрудников udv
          </span>
        </div>
        <div className="form-body">
          <>
            <label htmlFor="username-field">Введите ФИО</label>
            <input
              id="username-field"
              type="text"
              name="username"
              placeholder="Фамилия Имя Отчество"
            />
          </>
          <>
            <label htmlFor="password-field">Кодовое слово</label>
            <input
              id="password-field"
              placeholder="Слово"
              type={passwordShow ? "text" : "password"}
              name="password"
            />
            <div>
              <input type="checkbox" onClick={togglePasswordShow} />
              Показать кодовое слово
            </div>
            <div className="error-msg">
              Не удалось выполнить вход, перепроверьте введённые
              данные и поторите попытку.
            </div>
          </>
          <input type="submit" value="Войти" />
          {/* <Link to="">Забыли пароль?</Link> */}
        </div>
      </form>
    </div>
  );
};

export default Login;
