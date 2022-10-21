import React, { useState, useEffect } from "react";
import List from "../../utils/List";
import AdminOrderItem from "../../components/AdminOrderItem";

import "../../static/css/adminOrder.css";
import useAuthFetch from "../../hooks/useAuthFetch";
import { BACKEND_PATH } from "../../Settings";

const AdminOrders = () => {
  const [fetchParams, setFetchParams] = useState({
    url: "",
    options: {},
  });

  const { loading, data, error } = useAuthFetch(fetchParams);

  const [orders, setOrders] = useState(null);

  useEffect(() => {
    getOrdersList();
  }, []);

  useEffect(() => {
    if (data) setOrders(data);
  }, [data]);

  const getOrdersList = async () => {
    setFetchParams({
      url: BACKEND_PATH + "service-admin/orders/",
      options: {
        method: "GET",
        Headers: {
          "Content-Type": "application/json",
        },
      },
    });
  };

  return (
    <div className="admin-orders standart-container">
      <List
        data={orders}
        listClassName={"orders-wrapper"}
        renderItem={(item) => <AdminOrderItem initialOrder={item} />}
        renderEmpty={
          <p style={{ color: "white", textAlign: "center" }}>
            В настоящий момент нет заказов
          </p>
        }
      />
    </div>
  );
};

export default AdminOrders;
