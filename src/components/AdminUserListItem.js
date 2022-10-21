import React, { useEffect, useReducer, useState } from "react";
import useAuthFetch from "../hooks/useAuthFetch";
import NumberWithUcoin from "../utils/NumberWithUcoin";
import Popup from "./Popup";

import "../static/css/adminUserListItem.css";
import { BACKEND_PATH } from "../Settings";

const AdminUserListItem = ({ userObj = {} }) => {
  const [fetchParams, setFetchParams] = useState({
    url: "",
    options: {},
  });
  const { loading, data, error } = useAuthFetch(fetchParams);

  const [user, setUser] = useState(userObj);
  const [openedAdd, toggleOpenedAdd] = useReducer(
    (prev) => !prev,
    false
  );
  const [openedRemove, toggleOpenedRemove] = useReducer(
    (prev) => !prev,
    false
  );

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

  const deleteUser = async () => {
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
          permission: user.admin_permissions,
        }),
      },
    });
  };

  const changeUserRole = async () => {
    setFetchParams({
      url: BACKEND_PATH + `service-admin/user/role/${user.user_id}/`,
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    });
  };

  const addUcoin = async (e) => {
    e.preventDefault();

    const { comment, count } = e.target;

    setFetchParams({
      url:
        BACKEND_PATH +
        "service-admin/balance-changes?action=replenishment",
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

  const removeUcoin = async (e) => {
    e.preventDefault();

    const { comment, count } = e.target;

    setFetchParams({
      url:
        BACKEND_PATH +
        "service-admin/balance-changes?action=write-off",
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

        {deleted ? (
          <span style={{ color: "red" }}>Пользователь удалён</span>
        ) : (
          <>
            <NumberWithUcoin number={user.balance} />
            {user.admin_permissions && <span>Администратор</span>}
          </>
        )}
      </div>
      <div className="error">{JSON.stringify(error?.message)}</div>
      <div className="user-mng">
        {deleted ? (
          <button onClick={returnUser}>Вернуть пользователя</button>
        ) : (
          <>
            <button onClick={toggleOpenedAdd}>
              Начислить юкойны
            </button>
            <button onClick={toggleOpenedRemove}>
              Списать юкойны
            </button>
            <button onClick={deleteUser}>Уволить</button>
            <button onClick={() => changeUserRole()}>
              {user.admin_permissions
                ? "Забрать права администратора"
                : "Сделать администратором"}
            </button>

            {loading ? (
              <span className="loading">Loading...</span>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
      {(openedAdd || openedRemove) && (
        <Popup
          header={
            openedAdd
              ? "Начислить юкойны"
              : openedRemove
              ? "Списать юкойны"
              : ""
          }
          body={
            <>
              {!requestData ? (
                <form
                  className={`ucoin-add ${error ? "invalid" : ""}`}
                  onSubmit={openedRemove ? removeUcoin : addUcoin}
                >
                  <label>
                    Напишите причину{" "}
                    {openedAdd
                      ? "начисления"
                      : openedRemove
                      ? "списания"
                      : ""}
                  </label>
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
                  <button type="submit">
                    {openedAdd
                      ? "Начислить"
                      : openedRemove
                      ? "Списать"
                      : ""}
                  </button>
                </form>
              ) : (
                <div className="success-request">
                  <p>
                    Юкойны успешно{" "}
                    {openedAdd
                      ? "начислены"
                      : openedRemove
                      ? "списаны"
                      : ""}
                    !
                  </p>
                  <button onClick={() => setRequestData(null)}>
                    {openedAdd
                      ? "Начислить"
                      : openedRemove
                      ? "Списать"
                      : ""}{" "}
                    ещё юкойнов
                  </button>
                </div>
              )}
            </>
          }
          popupClassName="add-ucoin-popup"
          togglePopup={
            openedAdd
              ? toggleOpenedAdd
              : openedRemove
              ? toggleOpenedRemove
              : (f) => f
          }
        />
      )}
    </div>
  );
};

export default AdminUserListItem;
