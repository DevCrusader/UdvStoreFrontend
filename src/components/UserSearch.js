import React, { memo, useEffect, useState } from "react";
import List from "../utils/List";

import "../static/css/adminUserSearch.css";
import useDelay from "../hooks/useDelay";
import { BACKEND_PATH, Roles } from "../Settings";
import AdminUserManagement from "../pages/admin/AdminUserManagement";
import AdminUserListItem from "./AdminUserListItem";
import useFetch from "../hooks/useFetch";

const UserSearch = ({ userRole = Roles.Employee }) => {
  const [pinnedList, setPinnedList] = useState(
    localStorage.getItem("adminInfo")
      ? JSON.parse(localStorage.getItem("adminInfo")).pinnedList
      : []
  );

  const [userList, setUserList] = useState([]);

  const [fetchParams, setFetchParams] = useState({
    url: "",
    options: {},
  });

  const { loading, data, error } = useFetch(fetchParams);

  const [userSearchWithDelay, _] = useDelay((args) => {
    const [search, ...rest] = args;

    if (search)
      setFetchParams({
        url: BACKEND_PATH + `user/search/?search=${search}`,
        options: {
          method: "GET",
          headers: {
            "Content-Type": "applications/json",
          },
        },
      });
  });

  const userSearch = async (e) => {
    e.preventDefault();

    if (e.target.value) {
      userSearchWithDelay(e.target.value);
    } else {
      setUserList([]);
    }
  };

  useEffect(() => {
    if (data) {
      setUserList(data);
    }
  }, [data]);

  const savePinnedList = async (list) => {
    setPinnedList([...list]);
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

    localStorage.setItem(
      JSON.stringify({
        ...adminInfo,
        pinnedList: list,
      })
    );
  };

  const pinUser = async (user) => {
    // savePinnedList)
  };

  const unpinUser = async (user) => {};

  return (
    <div className="user-search">
      <input
        type="text"
        className="user-search"
        placeholder="Поиск сотрудника"
        onChange={userSearch}
      />
      <List
        data={userList}
        renderItem={(item) => (
          <>
            <AdminUserListItem
              userObj={item}
              curUserRole={userRole}
            />
          </>
        )}
      />
      <List
        data={pinnedList}
        renderItem={(item) => (
          <>
            <AdminUserListItem
              userObj={item}
              curUserRole={userRole}
            />
          </>
        )}
        listClassName={"pinned-list"}
      />
    </div>
  );
};

const MemoUsersearch = memo(UserSearch, () => true);

export default MemoUsersearch;
