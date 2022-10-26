import React, {
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import AuthContext from "../context/AuthContext";

import StoreIcon from "../static/svg/StoreIcon.svg";
import "../static/css/loginPage.css";
import { BACKEND_PATH } from "../Settings";
import { useNavigate } from "react-router-dom";
import Popup from "../components/Popup";

const Login = () => {
  const { user, successResponse } = useContext(AuthContext);
  const navigate = useNavigate();

  // Password Shown
  const [passwordShow, togglePasswordShow] = useReducer(
    (passwordShow) => !passwordShow,
    false
  );

  const [userParams, setUserParams] = useState({
    username: "",
    password: "",
    lastName: "",
    firstName: "",
    patronymic: "",
  });

  const [opened, toggleOpened] = useReducer((prev) => !prev, false);
  const [errorFetch, setErrorFetch] = useState("");
  const [register, setRegister] = useState(false);

  useEffect(() => {
    if (user) navigate("/udv/store/");
  }, [user]);

  useEffect(() => {
    setErrorFetch("");
  }, [opened, setErrorFetch]);

  const _loginUser = async (e) => {
    e.preventDefault();

    const { username, password } = e.target;

    setErrorFetch(false);

    const [lastName, firstName, patronymic] = username.value
      .trim()
      .split(" ");

    const userParams = {
      username: username.value,
      password: password.value,
      lastName,
      firstName,
      patronymic,
    };

    setUserParams(userParams);

    const response = await fetch(BACKEND_PATH + "user/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: userParams.username,
        password: userParams.password,
      }),
    });

    const data = await response.json();

    if (response.status === 200) return successResponse(data);

    if (response.status === 401)
      return setErrorFetch(
        "Неудалось выполнить попытку входа, проверьте ваше ФИО и секретное слово или зарегистрируйтесь."
      );

    return alert("Something went wrong...");
  };

  const selfRegister = async (e) => {
    e.preventDefault();

    const { firstName, lastName, patronymic, secretWord } = e.target;

    const response = await fetch(
      BACKEND_PATH + "user/self-register/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lastName: lastName.value,
          firstName: firstName.value,
          patronymic: patronymic.value,
          secretWord: secretWord.value,
        }),
      }
    );

    const data = await response.json();

    if (response.status === 200) return setRegister(true);

    setErrorFetch(data?.error);
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
            <label htmlFor="password-field">Секретное слово</label>
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
            {errorFetch && <div className="error">{errorFetch}</div>}
          </>
          <input type="submit" value="Войти" />

          <button
            onClick={toggleOpened}
            type={"button"}
            className="self-reg-btn"
          >
            Зарегистрироваться?
          </button>
        </div>
      </form>
      {opened && (
        <Popup
          header={<h3>Регистрация пользователя</h3>}
          body={
            <form
              className="self-register-form"
              onSubmit={selfRegister}
            >
              {!register ? (
                <>
                  <label htmlFor="user-last-name">Фамилия</label>
                  <input
                    type="text"
                    defaultValue={userParams?.lastName}
                    id="user-last-name"
                    placeholder="Фамилия"
                    name="lastName"
                    required={true}
                    pattern={"[А-ЯЁ]+[А-Яа-яЁ-ё ]*"}
                    title={
                      "Фамилия может содержать только символы русского алфавита и пробелы, должна начинаться с заглавной буквы."
                    }
                  />
                  <label htmlFor="user-first-name">Имя</label>
                  <input
                    type="text"
                    defaultValue={userParams?.firstName}
                    id="user-first-name"
                    placeholder="Имя"
                    name="firstName"
                    required={true}
                    pattern={"[А-ЯЁ]+[А-Яа-яЁ-ё ]*"}
                    title={
                      "Имя может содержать только символы русского алфавита и пробелы, должно начинаться с заглавной буквы."
                    }
                  />
                  <label htmlFor="user-patronymic">Отчество</label>
                  <input
                    type="text"
                    defaultValue={userParams?.patronymic}
                    id="user-patronymic"
                    placeholder="Отчество"
                    name="patronymic"
                    required={true}
                    pattern={"[А-ЯЁ]+[А-Яа-яЁ-ё ]*"}
                    title={
                      "Отчество может содержать только символы русского алфавита и пробелы, должна начинаться с заглавной буквы."
                    }
                  />
                  <label htmlFor="secret-word">
                    Секретное слово:
                  </label>
                  <input
                    type="text"
                    placeholder="Слово"
                    name="secretWord"
                    required={true}
                  />

                  {errorFetch && (
                    <div className="error">{errorFetch}</div>
                  )}

                  <button type="submit">Зарегистрироваться</button>
                </>
              ) : (
                <>
                  <div className="success-text">
                    Вы успешно зарегистрировались в сервисе! Закройте
                    окно и попробуйте выполнить попытку входа.
                  </div>
                  <button
                    onClick={toggleOpened}
                    className="close-btn"
                  >
                    Закрыть окно
                  </button>
                </>
              )}
            </form>
          }
          popupClassName="self-register"
          togglePopup={toggleOpened}
        />
      )}
    </div>
  );
};

export default Login;
