import React from "react";

import { Link } from "react-router-dom";

import "../../static/css/adminMain.css";

import RequestsAdminIcon from "../../static/svg/RequestsAdminIcon.svg";
import ProductsAdminIcon from "../../static/svg/ProductsAdminIcon.svg";
import OrdersAdminIcon from "../../static/svg/OrdersAdminIcon.svg";
import UserManagementAdminIcon from "../../static/svg/UserManagementAdminIcon.svg";
import UserRegistrationAdminIcon from "../../static/svg/UserRegistrationAdminIcon.svg";

const AdminMain = () => {
  return (
    <div className="admin-main standart-container">
      <Link className="requests vertical v__thin" to="/admin/requests/">
        <img
          className="back-img-center"
          src={RequestsAdminIcon}
          alt="Request Admin Icon"
        />
        <span>
          <span className="name">Запросы</span>
          <span className="description">
            Рассмотрение заявок на
            <br />
            зачисление юкойнов
          </span>
        </span>
      </Link>
      <Link className="products vertical v__fat" to="/admin/products/">
        <img
          className="back-img-center"
          src={ProductsAdminIcon}
          alt="Products Admin Icon"
        />
        <span>
          <span className="name">Управление товарами</span>
          <span className="description">
            Создание и редактирование карточек мерча
          </span>
        </span>
      </Link>
      <Link className="orders horizontal" to="/admin/orders/">
        <img
          className="back-img-center"
          src={OrdersAdminIcon}
          alt="Orders Admin Icon"
        />
        <span>
          <span className="name">Заказы</span>
          <span className="description">Просмотр заказов пользователей</span>
        </span>
      </Link>
      <Link className="users-mng vertical v__fat" to="/admin/users/management/">
        <img
          className="back-img-center"
          src={UserManagementAdminIcon}
          alt="UserManagement Admin Icon"
        />
        <span>
          <span className="name">Менеджемент пользователей</span>
          <span className="description">
            Управление сотрудниками, начисление юкойнов
          </span>
        </span>
      </Link>
      <Link
        className="users-reg vertical v__thin"
        to="/admin/users/registration/"
      >
        <img
          className="back-img-center"
          src={UserRegistrationAdminIcon}
          alt="UserRegistration Admin Icon"
        />
        <span>
          <span className="name">Импорт</span>
          <span className="description">Импорт Excel-таблицы</span>
        </span>
      </Link>
    </div>
  );
};

export default AdminMain;
