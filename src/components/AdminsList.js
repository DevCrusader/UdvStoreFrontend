import React, { useEffect, useReducer, useState } from "react";
import { BACKEND_PATH } from "../Settings";
import List from "../utils/List";

import "../static/css/adminsList.css";

const AdminsList = ({ transfered = [] }) => {
  const [adminsList, setAdminsList] = useState(null);
  const [expand, toggleExpand] = useReducer(
    (expand) => !expand,
    false
  );

  useEffect(() => {
    if (expand) if (!adminsList) getAdminsList();
  }, [expand]);

  const getAdminsList = async () => {
    const response = await fetch(`${BACKEND_PATH}user/admins/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      setAdminsList(data);
    } else {
      setAdminsList([]);
    }
  };

  return (
    <div className={`additional-info`}>
      <div className="info-header">
        <span>
          Администраторы
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
        {adminsList !== null ? (
          <List
            data={[...new Set([...adminsList, ...transfered])]}
            renderItem={(item) => <>{item.name}</>}
            keyByItemId="user_id"
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default AdminsList;
