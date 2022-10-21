import React, { useReducer, useState, memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_PATH } from "../Settings";

import useAuthFetch from "../hooks/useAuthFetch";
import Popup from "./Popup";

import "../static/css/adminUserRegister.css";

const UserRegister = ({ onRegisterFunc = (f) => f }) => {
  const navigate = useNavigate();

  const [opened, toggleOpened] = useReducer(
    (opened) => !opened,
    false
  );

  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [fetchParams, setFetchParams] = useState({
    url: "",
    options: {},
  });

  const { loading, data, error } = useAuthFetch(fetchParams);

  useEffect(() => {
    if (data) {
      setSuccessMsg(data);
      if (data.admin_permissions) onRegisterFunc(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      if (error.errorCode === 403) {
        return navigate("access-error");
      }

      if (error.errorCode === 400) {
        return setErrorMsg(error.message);
      }

      alert(
        `Something went wrong, error code: 
        ${error.errorCode} and message is ${error.message}`
      );
    }
  }, [error]);

  const registerUser = async (e) => {
    e.preventDefault();

    const { firstName, lastName, patronymic, balance, role } =
      e.target;

    setFetchParams({
      url: BACKEND_PATH + "service-admin/user/",
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.value.trim(),
          lastName: lastName.value.trim(),
          patronymic: patronymic.value.trim(),
          permission: role.value === "Administrator",
          balance: balance.value ? Number(balance.value) : 0,
        }),
      },
    });
  };

  return (
    <div className="user-registration">
      <button onClick={toggleOpened} className="reg-user-btn">
        + Зарегистрировать нового пользователя
      </button>

      {opened && (
        <Popup
          header={"Регистрация нового сотрудника"}
          body={
            successMsg ? (
              <div className="success-msg">
                <p>
                  Пользователь{" "}
                  <span
                    style={{
                      color: "#00D19C",
                    }}
                  >
                    {successMsg?.name}
                  </span>{" "}
                  успешно зарегистрирован! Теперь он может
                  авторизоваться на сайте, используя кодовое слово.
                </p>
                <button onClick={toggleOpened}>Закрыть окно</button>
                <button onClick={() => setSuccessMsg(null)}>
                  Вернуться к форме
                </button>
              </div>
            ) : (
              <form id="registration-form" onSubmit={registerUser}>
                <div className="main">
                  <div className="user-personal-info">
                    <label forhtml="lastName-reg">Фамилия</label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName-reg"
                      required
                      pattern={"[А-ЯЁ]+[а-яё]*"}
                      autoFocus
                    />
                    <label forhtml="firstName-reg">Имя</label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName-reg"
                      required
                      pattern={"[А-ЯЁ]+[а-яё]*"}
                    />
                    <label forhtml="patronymic-reg">Отчество</label>
                    <input
                      type="text"
                      name="patronymic"
                      id="patronymic-reg"
                      required
                      pattern={"[А-ЯЁ]+[а-яё]*"}
                    />
                    <div className="valid-text">
                      Текстовые поля должны содержать символы только
                      русского алфавита, а также начинаться с
                      заглавной буквы.
                    </div>
                  </div>
                  <div className="user-service-info">
                    <label forhtml="balance-reg">Баланс</label>
                    <input
                      placeholder="0"
                      type="text"
                      name="balance"
                      id="balance-reg"
                      onChange={(e) =>
                        (e.target.value = e.target.value.replace(
                          /[^\d]/g,
                          ""
                        ))
                      }
                    />
                    <label forhtml="role-reg">Роль</label>
                    <br />
                    <select id="role-reg" name="role">
                      <option value="Employee">Сотрудник</option>
                      <option value="Administrator">
                        Администратор
                      </option>
                    </select>
                    {errorMsg ? (
                      <div className="error-msg">
                        Error: {JSON.stringify(errorMsg)}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="reg-btn"
                  onClick={() => {
                    const element = document.querySelector(
                      "#registration-form"
                    );
                    element.classList.add("invalid-form");
                  }}
                >
                  Создать пользователя
                </button>
              </form>
            )
          }
          popupClassName={"registration-popup"}
          togglePopup={toggleOpened}
        />
      )}
    </div>
  );
};

const MemoUserRegister = memo(UserRegister);

export default MemoUserRegister;
