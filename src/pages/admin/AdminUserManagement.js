import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
// import useDelay from "../../hooks/useDelay";
import List from "../../utils/List";
import MemoUserRegister from "../../components/UserRegister";
import MemoUserSearch from "../../components/UserSearch";
import MemoUsersRoleComponent from "../../components/UserRoleManagement";

import "../../static/css/adminUserManagement.css";

const AdminUserManagement = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log("Rerendered!");
  });

  const [transfer, setTransfer] = useState({
    administrator: [],
    moderator: [],
  });

  const addUser = async (user, role = "moderator") =>
    setTransfer({ ...transfer, [role]: [...transfer[role], user] });

  return (
    <div className="standart-container user-mng">
      <div className="inner-container">
        <h2>AdminUserManagement, your role is {String(user.role)}</h2>
        <MemoUserRegister
          userRole={user.role}
          onRegisterFunc={addUser}
        />
        <MemoUserSearch userRole={user.role} />
      </div>

      <MemoUsersRoleComponent
        userRole={user.role}
        userId={user.id}
        role="Moderator"
        transfered={transfer.moderator}
      />
      <MemoUsersRoleComponent
        userRole={user.role}
        role="Administrator"
        transfered={transfer.administrator}
      />
    </div>
  );
};

export default AdminUserManagement;
