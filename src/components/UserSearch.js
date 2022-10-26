import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import List from "../utils/List";

import "../static/css/adminUserSearch.css";
import useDelay from "../hooks/useDelay";
import { BACKEND_PATH } from "../Settings";
import AdminUserListItem from "./AdminUserListItem";
import useFetch from "../hooks/useFetch";
import AuthContext from "../context/AuthContext";

const UserSearch = () => {
  const { user, changeUserBalance } = useContext(AuthContext);

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

  const onChangeUserBalance = useCallback(changeUserBalance, [
    changeUserBalance,
  ]);

  return (
    <div className="user-search">
      <input
        type="text"
        className="user-search"
        placeholder="Поиск сотрудника"
        onChange={userSearch}
      />
      <span className="faq-search">dqqwd</span>
      <div className={`${error ? "error-place" : ""}`}>
        {error && <>{JSON.stringify(error?.message)}</>}
      </div>
      <List
        data={userList}
        renderItem={(item) => (
          <>
            <AdminUserListItem
              userObj={item}
              onChangeUserBalance={
                item.user_id === user.user_id
                  ? onChangeUserBalance
                  : (f) => f
              }
            />
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
    </div>
  );
};

const MemoUsersearch = memo(UserSearch, () => true);

export default MemoUsersearch;
