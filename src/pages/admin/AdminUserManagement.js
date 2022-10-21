import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
// import useDelay from "../../hooks/useDelay";
import List from "../../utils/List";
import MemoUserRegister from "../../components/UserRegister";
import MemoUserSearch from "../../components/UserSearch";
import AdminsList from "../../components/AdminsList";

import "../../static/css/adminUserManagement.css";

const AdminUserManagement = () => {
  const { user } = useContext(AuthContext);

  const [transfer, setTransfer] = useState([]);

  const addUser = async (user) => {
    setTransfer([...transfer, user]);
  };

  return (
    <div className="standart-container user-mng">
      <div className="inner-container">
        <h2>AdminUserManagement</h2>
        <MemoUserRegister onRegisterFunc={addUser} />
        <MemoUserSearch />
      </div>

      <AdminsList
        userPermission={user.permission}
        transfered={transfer}
      />
    </div>
  );
};

export default AdminUserManagement;
