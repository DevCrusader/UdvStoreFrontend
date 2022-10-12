import React, { useEffect, memo, useReducer, useState } from "react";
import List from "../utils/List";
import AdminUserListItem from "./AdminUserListItem";

import "../static/css/userRoleManagement.css";
import { BACKEND_PATH } from "../Settings";

const UsersRole = ({ userRole, role = "", transfered = [] }) => {
  useEffect(() => {
    console.log(`Render Additional Component ${role}`);
  });

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
              <AdminUserListItem
                userObj={item}
                curUserRole={userRole}
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
