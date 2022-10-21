import React, { memo, useEffect, useState } from "react";
import List from "../utils/List";

import "../static/css/adminUserSearch.css";
import useDelay from "../hooks/useDelay";
import { BACKEND_PATH, Roles } from "../Settings";
import AdminUserListItem from "./AdminUserListItem";
import useFetch from "../hooks/useFetch";

const UserSearch = () => {
  // const [pinnedList, setPinnedList] = useState(
  //   localStorage.getItem("adminInfo")
  //     ? JSON.parse(localStorage.getItem("adminInfo")).pinnedList
  //     : []
  // );

  const [userList, setUserList] = useState(null);

  const [fetchParams, setFetchParams] = useState({
    url: "",
    options: {},
  });

  const { loading, data, error } = useFetch(fetchParams);

  useEffect(() => {
    if (data) {
      setUserList(data);
    }
  }, [data]);

  const [userSearchWithDelay, clearQueue, _] = useDelay((args) => {
    const [search, _] = args;

    const [lastName, firstName, patronymic] = search
      .trim()
      .split(" ");

    if (search)
      setFetchParams({
        url:
          BACKEND_PATH +
          `user/search?firstName=${
            firstName ? firstName : "*"
          }&lastName=${lastName ? lastName : "*"}&patronymic=${
            patronymic ? patronymic : "*"
          }`,
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
      clearQueue();
      setUserList([]);
    }
  };

  // const savePinnedList = async (list) => {
  //   setPinnedList(list);
  //   const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  //   localStorage.setItem(
  //     "adminInfo",
  //     JSON.stringify({
  //       ...adminInfo,
  //       pinnedList: list,
  //     })
  //   );
  // };

  // const pinUser = async (user) => {
  //   savePinnedList([...pinnedList, user]);
  // };

  // const unpinUser = async (userId) => {
  //   savePinnedList(
  //     pinnedList.filter((item) => item.user_id !== userId)
  //   );
  // };

  return (
    <div className="user-search">
      <input
        type="text"
        className="user-search"
        placeholder="Поиск сотрудника"
        onChange={userSearch}
        title={
          "Для лучшего поиска вводите запрос в формате: Фамилия Имя Отчество."
        }
      />
      <div className={`${error ? "error-place" : ""}`}>
        {error && <>{JSON.stringify(error?.message)}</>}
      </div>
      <List
        data={userList}
        renderItem={(item) => (
          <>
            <AdminUserListItem userObj={item} />
            {/* <button
              disabled={pinnedList.some(
                (user) => user.user_id === item.user_id
              )}
              className="pin"
              onClick={() => pinUser(item)}
            >
              Закрепить
            </button> */}
          </>
        )}
        renderEmpty={
          <>
            {userList &&
              !userList.length &&
              !loading &&
              "По вашему запросу ничего не найдено."}
          </>
        }
        keyByItemId={"user_id"}
        listClassName={"user-search-list"}
      />
      {/* <List
        data={pinnedList}
        renderItem={(item) => (
          <>
            <AdminUserListItem userObj={item} />
            <button
              className="unpin"
              onClick={() => unpinUser(item.user_id)}
            >
              Открепить
            </button>
          </>
        )}
        renderEmpty={<></>}
        listClassName={"pinned-list"}
      /> */}
    </div>
  );
};

const MemoUsersearch = memo(UserSearch, () => true);

export default MemoUsersearch;
