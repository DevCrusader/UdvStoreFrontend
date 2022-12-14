import React, { useEffect, useReducer, useState } from "react";
import useAuthFetch from "../hooks/useAuthFetch";
import NumberWithUcoin from "../utils/NumberWithUcoin";
import Popup from "./Popup";

import "../static/css/adminUserListItem.css";
import { BACKEND_PATH } from "../Settings";

const AdminUserListItem = ({ userObj = {}, onChangeUserBalance }) => {
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

  const [deleted, setDeleted] = useState(null);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if (data) {
      if (data.user_id === null) {
        setUser({ ...user, user_id: data.user_id });
        setDeleted(data);
        return;
      }

      if (user.balance !== data.balance) {
        onChangeUserBalance(
          user.balance < data.balance ? "increase" : "decrease",
          Math.abs(user.balance - data.balance)
        );
        setChanged(true);
      }

      setDeleted(null);
      setUser({ ...data });
    }
  }, [data, onChangeUserBalance]);

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
          firstName: deleted.first_name,
          lastName: deleted.last_name,
          patronymic: deleted.patronymic,
          balance: deleted.balance,
          permission: deleted.admin_permissions,
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

  const changeUserBalance = async (comment, count) => {
    setFetchParams({
      url: BACKEND_PATH + "service-admin/balance-changes/",
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.user_id,
          comment: comment.trim(),
          newBalance: String(
            openedAdd
              ? user.balance + count
              : openedRemove
              ? user.balance - count
              : user.balance
          ),
        }),
      },
    });
  };

  return (
    <div className={`user-item ${deleted ? "deleted" : ""}`}>
      <div className="user-info">
        <span>{user.name}</span>

        {deleted ? (
          <span style={{ color: "red" }}>???????????????????????? ????????????</span>
        ) : (
          <>
            <NumberWithUcoin number={user.balance} />
            {user.admin_permissions && <span>??????????????????????????</span>}
          </>
        )}
      </div>
      <div className="error">{JSON.stringify(error?.message)}</div>
      <div className="user-mng">
        {deleted ? (
          <button onClick={returnUser}>?????????????? ????????????????????????</button>
        ) : (
          <>
            <button onClick={toggleOpenedAdd}>
              ?????????????????? ????????????
            </button>
            <button onClick={toggleOpenedRemove}>
              ?????????????? ????????????
            </button>
            <button onClick={deleteUser}>????????????</button>
            <button onClick={() => changeUserRole()}>
              {user.admin_permissions
                ? "?????????????? ?????????? ????????????????????????????"
                : "?????????????? ??????????????????????????????"}
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
              ? "?????????????????? ????????????"
              : openedRemove
              ? "?????????????? ????????????"
              : ""
          }
          body={
            <>
              {!changed ? (
                <ChangeUserBalanceForm
                  addAction={openedAdd}
                  onSubmit={changeUserBalance}
                  error={error}
                  userCurrentBalance={user.balance}
                />
              ) : (
                <div className="success-request">
                  <p>
                    ???????????? ??????????????{" "}
                    {openedAdd
                      ? "??????????????????"
                      : openedRemove
                      ? "??????????????"
                      : ""}
                    !
                  </p>
                  <button onClick={() => setChanged(false)}>
                    {openedAdd
                      ? "??????????????????"
                      : openedRemove
                      ? "??????????????"
                      : ""}{" "}
                    ?????? ??????????????
                  </button>
                </div>
              )}
            </>
          }
          popupClassName="add-ucoin-popup"
          togglePopup={() => {
            if (openedAdd) toggleOpenedAdd();
            if (openedRemove) toggleOpenedRemove();

            setChanged(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminUserListItem;

const ChangeUserBalanceForm = ({
  addAction = true,
  userCurrentBalance = 0,
  onSubmit = (f) => f,
  error = {},
}) => {
  const [validationErrorList, setValidationErrorList] = useState([]);

  const checkFormValidation = async (e) => {
    e.preventDefault();

    const { comment, count } = e.target;

    const newValidationErrorList = [];

    if (!comment.value)
      newValidationErrorList.push(
        "???????? ?????????????????????? ???? ???????????? ???????? ????????????."
      );

    if (!count.value)
      newValidationErrorList.push(
        "???????? ?? ??????-?????? ?????????????? ???? ???????????? ???????? ????????????."
      );

    if (!addAction && Number(count.value) > userCurrentBalance)
      newValidationErrorList.push(
        `?????????????? ???????????? ????????????????????????: ${userCurrentBalance}`
      );

    console.log("Here");
    console.log(newValidationErrorList);

    if (!newValidationErrorList.length) {
      onSubmit(comment.value, Number(count.value));
    } else {
      setValidationErrorList(newValidationErrorList);
    }
  };

  return (
    <form
      className={`ucoin-add ${error ? "invalid" : ""}`}
      onSubmit={checkFormValidation}
    >
      <label>
        ???????????????? ?????????????? {addAction ? "????????????????????" : "????????????????"}
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
        placeholder="?????????????????????? ????????????????: 250"
        maxLength={250}
      />
      <label>?????????????? ???????????????????? ??????????????</label>
      <input
        type="text"
        id="ucoin-count"
        name="count"
        onChange={(e) =>
          (e.target.value = e.target.value.replace(/[^\d]/g, ""))
        }
      />
      {error && error?.message && (
        <span className="error">
          {JSON.stringify(error?.message)}
        </span>
      )}
      {Boolean(validationErrorList.length) && (
        <span className="error">
          {validationErrorList.map((item) => (
            <div key={item.length}>{item}</div>
          ))}
        </span>
      )}
      <button type="submit">
        {addAction ? "??????????????????" : "??????????????"}
      </button>
    </form>
  );
};
