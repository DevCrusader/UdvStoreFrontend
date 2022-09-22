import React from "react";
import { Outlet } from "react-router-dom";
import { CartProvider } from "../context/CartContext";

const CartRoutes = () => {
  return (
    <CartProvider>
      <Outlet />
    </CartProvider>
  );
};

export default CartRoutes;
