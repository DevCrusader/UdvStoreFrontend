import React, { createContext, useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";

const CartContext = createContext();

export default CartContext;

export const CartProvider = ({ children }) => {
  const { authFetch } = useContext(AuthContext);

  const [cart, setCart] = useState(
    localStorage.getItem("userCart")
      ? JSON.parse(localStorage.getItem("userCart"))
      : null
  );

  useEffect(() => {
    if (!cart) loadCart();
  }, [cart]);

  const successResponse = (data) => {
    setCart(data);
    localStorage.setItem("userCart", JSON.stringify(data));
  };

  const reloadCart = async () => setCart(null);

  const loadCart = async () => {
    if (cart) return;

    console.log("Load cart");
    const response = await authFetch(
      "https://udvstore.pythonanywhere.com/store/cart/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (response.status === 200) {
      successResponse(data);
    } else {
      console.error(response);
    }
  };

  const increaseItemCount = async (id) => {
    const item = cart.filter((item) => item.id === id)[0];

    if (item && item.count === 10) return;

    const newCart = cart.map((item) =>
      item.id === id ? { ...item, count: item.count + 1 } : item
    );

    const response = await authFetch(
      `https://udvstore.pythonanywhere.com/store/cart/${id}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "add",
        }),
      }
    );

    if (response.status === 200) {
      successResponse(newCart);
    } else {
      console.error(response);
    }
  };

  const decreaseItemCount = async (id) => {
    if (cart.filter((item) => item.id === id)[0]?.count === 1)
      return deleteItem(id);

    const newCart = cart.map((item) =>
      item.id === id ? { ...item, count: item.count - 1 } : item
    );

    const response = await authFetch(
      `https://udvstore.pythonanywhere.com/store/cart/${id}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "remove",
        }),
      }
    );

    if (response.status === 200) {
      successResponse(newCart);
    } else {
      console.error(response);
    }
  };

  const deleteItem = async (id) => {
    const newCart = cart.filter((item) => item.id !== id);

    const response = await authFetch(
      `https://udvstore.pythonanywhere.com/store/cart/${id}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      successResponse(newCart);
    } else {
      console.error(response);
    }
  };

  const addItem = async (productId, type, size) => {
    const response = await authFetch(
      "https://udvstore.pythonanywhere.com/store/cart/add/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          type,
          size,
        }),
      }
    );

    const data = await response.json();

    if (response.status === 200) {
      successResponse([...cart, data]);
    } else {
      console.error(response);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        increaseItemCount,
        decreaseItemCount,
        deleteItem,
        loadCart,
        reloadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
