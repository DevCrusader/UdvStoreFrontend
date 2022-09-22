import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import List from "../../utils/List";

import "../../static/css/adminOrder.css";
import AdminOrderItem from "../../components/AdminOrderItem";

const AdminOrders = () => {
  const { authFetch } = useContext(AuthContext);

  const [orders, setOrders] = useState(null);

  useEffect(() => {
    getOrdersList();
  }, []);

  const getOrdersList = async () => {
    const response = await authFetch(
      "https://artomdev.pythonanywhere.com/service-admin/orders/",
      {
        method: "GET",
        Headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (response.status === 200) setOrders(data);
  };

  return (
    <div className="admin-orders container">
      <List
        data={orders}
        listClassName={"orders-wrapper"}
        renderItem={(item) => <AdminOrderItem initialOrder={item} />}
        renderEmpty={
          <p style={{ color: "white" }}>В настоящий момент нет заказов</p>
        }
      />
    </div>
  );
};

export default AdminOrders;
