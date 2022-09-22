import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Confirm from "./pages/store/Confirm";
import AdminMain from "./pages/admin/AdminMain";
import AdminOrders from "./pages/admin/AdminOrders";

import StoreRouter from "./routes/StoreRouter";
import CartRoutes from "./routes/CartRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import RoleAccessRoutes from "./routes/RoleAccessRoutes";

import { AuthProvider } from "./context/AuthContext";

import NotFound404 from "./pages/error/NotFound404";
import Forbidden403 from "./pages/error/Forbidden403";

import "./static/css/main.css";
import "./static/css/cartItem.css";

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route element={<ProtectedRoutes />}>
            <Route element={<CartRoutes />}>
              <Route path="udv">
                <Route path="store" element={<StoreRouter theme={"Udv"} />} />
                <Route path="confirm" element={<Confirm theme={"Udv"} />} />
              </Route>
              <Route path="ussc">
                <Route path="store" element={<StoreRouter theme={"Ussc"} />} />
                <Route path="confirm" element={<Confirm theme={"Ussc"} />} />
              </Route>
            </Route>
            <Route path="admin" element={<RoleAccessRoutes />}>
              <Route path="" element={<AdminMain />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>
          </Route>
          <Route path="access-error" element={<Forbidden403 />} />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
