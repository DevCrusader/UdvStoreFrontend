import React, { useEffect, useReducer, useState } from "react";
import useAuthFetch from "../hooks/useAuthFetch";
import { BACKEND_PATH } from "../Settings";
import List from "../utils/List";

const AdminOrderItem = ({ initialOrder }) => {
  const [order, setOrder] = useState(initialOrder);
  const [view, toggleView] = useReducer((prev) => !prev, false);

  const [fetchParams, setFetchParams] = useState({
    url: "",
    options: {},
  });

  const { loading, data, error } = useAuthFetch(fetchParams);

  useEffect(() => {
    if (data) {
      setOrder(data);
    }
  }, [data]);

  const changeOrderState = async (id) => {
    const newState =
      order.state === "Accepted" ? "Completed" : "Accepted";

    setFetchParams({
      url: `${BACKEND_PATH}service-admin/order/${id}/`,
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: newState,
        }),
      },
    });
  };

  const cancelOrder = async () => {
    setFetchParams({
      url: BACKEND_PATH + "service-admin/order/cancellation/",
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
        }),
      },
    });
  };

  if (!order) return;

  return (
    <>
      {order && order.id ? (
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
            {error && (
              <span style={{ fontSize: "0.8px", color: "red" }}>
                {JSON.stringify(error?.message)}
              </span>
            )}

            <button
              className="cancellation-btn"
              onClick={cancelOrder}
            >
              Отменить заказ
            </button>
            {/* <div className="cancellation-block">
          <span className="accept"></span>
          <span className="reject"></span>

        </div> */}
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
                  {new Date(order.created_date).toLocaleString(
                    "ru-Ru",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }
                  )}{" "}
                  г.
                </li>
              </ul>
              <ul className="state">
                <li
                  className={`back-img-center ${
                    order.state === "Accepted" ? "active" : "near"
                  }`}
                >
                  Заказ принят
                </li>
                <li
                  className={`back-img-center ${
                    order.state === "Completed" ? "active" : "near"
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
                  {order.state === "Accepted" ? "Готово" : "Отменить"}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center" }}>Заказ удалён</div>
      )}
    </>
  );
};

export default AdminOrderItem;
