import React, { useEffect, memo, useReducer, useState } from "react";
import { BACKEND_PATH, Roles } from "../Settings";
import useAuthFetch from "../hooks/useAuthFetch";
import List from "../utils/List";

import "../static/css/userRoleManagement.css";

const UsersRole = ({ userRole, role = "", transfered = [] }) => {
  const [roleUsers, setRoleUsers] = useState(null);
  const [expand, toggleExpand] = useReducer(
    (expand) => !expand,
    false
  );

  useEffect(() => {
    if (expand) {
      if (!roleUsers) {
        getRoleUsers();
      }
    }
  }, [expand]);

  if (!userRole) return;

  const getRoleUsers = async () => {
    const response = await fetch(
      `${BACKEND_PATH}user/role/?role=${role}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (response.status === 200) {
      setRoleUsers(data);
    } else {
      setRoleUsers([]);
    }
  };

  return (
    <div className={`additional-info ${role}`}>
      <div className="info-header">
        <span>
          {role === "Administrator"
            ? "Администраторы"
            : role === "Moderator"
            ? "Модераторы"
            : "Неверная роль"}
          <button
            onClick={toggleExpand}
            className={`${expand ? "expanded" : ""}`}
          ></button>
        </span>
      </div>
      <div
        className={`user-role-main inner-container ${
          expand ? "expanded" : "unexpanded"
        }`}
      >
        {roleUsers !== null ? (
          <List
            data={[...transfered, ...roleUsers]}
            renderItem={(item) => (
              <ListItem
                userObj={item}
                permission={userRole === Roles.Administrator}
              />
            )}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

const MemoUsersRoleComponent = memo(
  UsersRole,
  (prev, next) => prev.transfered === next.transfered
);

export default MemoUsersRoleComponent;

const ListItem = ({ userObj = {}, permission = false }) => {
  const [fetchParams, setFetchParams] = useState({
    url: "",
    options: {},
  });

  const { loading, data, error } = useAuthFetch(fetchParams);
  const [user, setUser] = useState(userObj);

  useEffect(() => {
    if (data) setUser(data);
  }, [data]);

  const changeUserRole = async (newRole) => {
    if (!permission) return;

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

  return (
    <>
      {permission && user.role === Roles.Moderator ? (
        <button
          style={{
            backgroundColor: "rgba(0,0,0,0)",
            color: "#FF5454",
            marginRight: "25px",
          }}
          onClick={() => changeUserRole(Roles.Employee)}
          className="remove-user-role-btn"
        >
          Разжаловать
        </button>
      ) : (
        <>
          {user.role === Roles.Employee && (
            <button
              style={{
                backgroundColor: "rgba(0,0,0,0)",
                color: "#95FF54",
                marginRight: "25px",
              }}
              onClick={() => changeUserRole(Roles.Moderator)}
            >
              Вернуть роль
            </button>
          )}
        </>
      )}
      <span>{user.name}</span>
      <span>{loading ? "Loading..." : ""}</span>
      <span style={{ color: "red" }}>
        {error ? error?.message : ""}
      </span>
    </>
  );
};
