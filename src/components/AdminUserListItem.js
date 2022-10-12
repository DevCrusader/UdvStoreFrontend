import React, { useEffect, useReducer, useState } from "react";
import useAuthFetch from "../hooks/useAuthFetch";
import NumberWithUcoin from "../utils/NumberWithUcoin";
import Popup from "./Popup";

import "../static/css/adminUserListItem.css";
import { BACKEND_PATH, Roles } from "../Settings";

const AdminUserListItem = ({
  userObj = {},
  curUserRole = Roles.Employee,
}) => {
  const [fetchParams, setFetchParams] = useState({
    url: "",
    options: {},
  });
  const { loading, data, error } = useAuthFetch(fetchParams);

  const [user, setUser] = useState(userObj);
  const [opened, toggleOpened] = useReducer((prev) => !prev, false);

  const [deleted, setDeleted] = useState(false);
  const [requestData, setRequestData] = useState(null);

  useEffect(() => {
    if (data) {
      if (data.id && data.admin_id) {
        setUser({
          ...user,
          balance: user.balance + data.count,
        });
        setRequestData(data);
        return;
      }

      if (data.user_id === null) {
        setUser({ ...data });
        setDeleted(true);
        return;
      }

      setDeleted(false);
      setUser({ ...data });
    }
  }, [data]);

  useEffect(() => {}, [error]);

  useEffect(() => {}, [loading]);

  const deleteUser = async () => {
    console.log(Roles.Moderator);
    if (
      curUserRole !== Roles.Administrator &&
      curUserRole !== Roles.Moderator
    )
      return;

    setFetchParams({
      url:
        BACKEND_PATH + `service-admin/user/delete/${user.user_id}/`,
      options: {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    });
  };

  const returnUser = async () => {
    setFetchParams({
      url: BACKEND_PATH + "service-admin/user/",
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: user.first_name,
          lastName: user.last_name,
          patronymic: user.patronymic,
          balance: user.balance,
          role: user.role,
        }),
      },
    });
  };

  const changeUserRole = async (newRole) => {
    if (curUserRole !== Roles.Administrator) return;

    setFetchParams({
      url: BACKEND_PATH + `service-admin/user/role/${user.user_id}/`,
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: newRole,
        }),
      },
    });
  };

  const addUcoin = async (e) => {
    e.preventDefault();

    const { comment, count } = e.target;

    setFetchParams({
      url: BACKEND_PATH + "service-admin/balance-replenishment/",
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userObj.user_id,
          comment: comment.value.trim(),
          count: count.value,
        }),
      },
    });
  };

  return (
    <div className={`user-item ${deleted ? "deleted" : ""}`}>
      <div className="user-info">
        <span>{user.name}</span>
        <NumberWithUcoin number={user.balance} />
        <span>{user.role}</span>

        {deleted ? (
          <span style={{ color: "red" }}>Пользователь удалён</span>
        ) : (
          <></>
        )}
      </div>
      <div className="error">{JSON.stringify(error?.message)}</div>
      <div className="user-mng">
        {deleted ? (
          <button onClick={returnUser}>Вернуть пользователя</button>
        ) : (
          <>
            {curUserRole === Roles.Moderator ? (
              <button onClick={toggleOpened}>Начислить юкойны</button>
            ) : curUserRole === Roles.Administrator ? (
              <>
                <button onClick={toggleOpened}>
                  Начислить юкойны
                </button>
                <button onClick={deleteUser}>Уволить</button>
                {user.role === Roles.Employee && (
                  <>
                    <button
                      onClick={() => changeUserRole(Roles.Moderator)}
                    >
                      Сделать модератором
                    </button>
                  </>
                )}
                {user.role === Roles.Moderator && (
                  <>
                    <button
                      onClick={() => changeUserRole(Roles.Employee)}
                    >
                      Зарать права модератора
                    </button>
                  </>
                )}
              </>
            ) : (
              <></>
            )}
            {loading ? (
              <span className="loading">Loading...</span>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
      {opened && (
        <Popup
          header={"Начисление юкойнов"}
          body={
            <>
              {!requestData ? (
                <form
                  className={`ucoin-add ${error ? "invalid" : ""}`}
                  onSubmit={addUcoin}
                >
                  <label>Напишите причину зачисления</label>
                  <textarea
                    style={{
                      width: "400px",
                      height: "80px",
                      maxWidth: "480px",
                      maxHeight: "140px",
                    }}
                    id="ucoin-comment"
                    name="comment"
                    placeholder="Максимально символов: 250"
                    maxLength={250}
                  />
                  <label>Укажите количество юкойнов</label>
                  <input
                    type="text"
                    id="ucoin-count"
                    name="count"
                    onChange={(e) =>
                      (e.target.value = e.target.value.replace(
                        /[^\d]/g,
                        ""
                      ))
                    }
                  />
                  <span className="error">
                    {JSON.stringify(error?.message)}
                  </span>
                  <button type="submit">Начислить</button>
                </form>
              ) : (
                <div className="success-request">
                  <p>Юкойны успешно начислены!</p>
                  <button onClick={() => setRequestData(null)}>
                    Начислить ещё юкойнов
                  </button>
                </div>
              )}
            </>
          }
          popupClassName="add-ucoin-popup"
          togglePopup={toggleOpened}
        />
      )}
    </div>
  );
};

export default AdminUserListItem;
