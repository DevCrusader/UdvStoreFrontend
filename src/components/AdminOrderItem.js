import React, {
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import AuthContext from "../context/AuthContext";
import useAuthFetch from "../hooks/useAuthFetch";
import { BACKEND_PATH } from "../Settings";
import List from "../utils/List";

const AdminOrderorder = ({ initialOrder }) => {
  const [order, setOrder] = useState(initialOrder);
  const [view, toggleView] = useReducer((prev) => !prev, false);

  const [fetchParams, setFetchParams] = useState({
    url: "",
    options: {},
  });

  const { loading, data, error } = useAuthFetch(fetchParams);

  useEffect(() => {
    if (data) {
      setOrder({ ...order, state: data.state });
    }
  }, [data]);

  const changeOrderState = async (id) => {
    const newState =
      order.state === "Accepted"
        ? "Formed"
        : order.state === "Formed"
        ? "Completed"
        : "Formed";

    setFetchParams({
      url: `${BACKEND_PATH}service-admin/order/${id}/?state=${newState}`,
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    });
  };

  return (
    <>
      <div className="order-header">
        <span>Заказ #{order.id}</span>
        <button
          className={`back-img-center ${
            view ? "to-order-info" : "to-product-list"
          }`}
          onClick={toggleView}
        >
          {!view ? <>К списку товаров</> : <>Вернуться</>}
        </button>
      </div>
      {view ? (
        <List
          data={order.products}
          listClassName={"products-list"}
          renderItem={(item) => (
            <>
              <img
                className="back-img-center"
                src={`${BACKEND_PATH}media/images/${item.photo}`}
                alt="Photo"
              />
              <div className="prod-info">
                <div className="name">
                  {item.name}, {item.count} шт.
                </div>
                <div className="type-size">
                  <span className="type">
                    {item.type.toLowerCase()}
                  </span>
                  {item.item_size ? (
                    <span className="size">
                      {item.item_size.toLowerCase()}
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </>
          )}
        />
      ) : (
        <div className="order-info">
          <ul className="info">
            <li>Сотрудник: {order.user_name}</li>
            <li>Адрес: {order.office}</li>
            <li>
              Дата:{" "}
              {new Date(order.created_date).toLocaleString("ru-Ru", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}{" "}
              г.
            </li>
            <li>Способ олаты: {order.payment_method}</li>
          </ul>
          <ul className="state">
            <li
              className={`back-img-center ${
                order.state === "Accepted"
                  ? "active"
                  : order.state === "Formed"
                  ? "near"
                  : ""
              }`}
            >
              Заказ принят
            </li>
            <li
              className={`back-img-center ${
                order.state === "Formed" ? "active" : "near"
              }`}
            >
              Заказ сформирован
            </li>
            <li
              className={`back-img-center ${
                order.state === "Completed"
                  ? "active"
                  : order.state === "Formed"
                  ? "near"
                  : ""
              }`}
            >
              Заказ передан
            </li>
          </ul>
          <div className="toggle">
            <button
              className={`${
                order.state === "Completed" ? "completed" : ""
              }`}
              onClick={() => changeOrderState(order.id)}
            >
              {order.state === "Accepted"
                ? "Заказ сформирован"
                : order.state === "Formed"
                ? "Заказ передан"
                : "Отменить передачу"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminOrderorder;
