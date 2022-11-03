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
          <div style={{ color: "#767676" }}>
            <p style={{ color: "white" }}>
              Для поиска наберите в порядке: Фамилия Имя Отчество.
              <br />
              Введите запрос и через две секунды увидите результат.
              <br />
              Если ничего не появилось, значит искомые пользователи не
              найдены.
            </p>

            <p>
              Вы можете набрать только Фамилию, тогда получите всех
              пользователей с данной фамилией.
            </p>
            <p>
              Вы можете набрать Фамилию + Имя, тогда получите всех
              соответствующих пользователей.
            </p>
            <p>В остальных случаях впишите полное ФИО.</p>
            <p>
              Если Вам неизвестны некоторые параметры из ФИО, то
              поставьте на их место "*". К примеру:
            </p>

            <ol>
              <li style={{ marginBottom: "5px" }}>
                Запрос "Япрынцев * Максимович" вернёт всех
                пользователей с фамилией Япрынцев и отчеством
                Максимович.
              </li>
              <li>
                Запрос "* Артём *" вернёт всех Артёмов,
                зарегистрированных в сервисе.
              </li>
            </ol>
          </div>
        }
        keyByItemId={"user_id"}
        listClassName={"user-search-list"}
      />
    </div>
  );
};

const MemoUsersearch = memo(UserSearch, () => true);

export default MemoUsersearch;
