import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { findIndex } from "underscore";
import useAuthFetch from "../hooks/useAuthFetch";
import { BACKEND_PATH } from "../Settings";
import AuthContext from "./AuthContext";

const CartContext = createContext();

export default CartContext;

export const CartProvider = ({ children }) => {
  const { authTokens } = useContext(AuthContext);

  const [cart, setCart] = useState(() =>
    localStorage.getItem("userCart")
      ? JSON.parse(localStorage.getItem("userCart"))
      : null
  );

  const [fetchParams, setFetchParams] = useState({
    url: "",
    options: {},
  });

  const { loading, data, error } = useAuthFetch(fetchParams);

  useEffect(() => {
    if (!cart) loadCart();
  }, [cart]);

  useEffect(() => {
    if (data && typeof data === "object") {
      if (typeof data.length === "number") {
        successResponse([...(cart ? cart : []), ...data]);
      } else {
        if (!cart) return successResponse([data]);

        const index = findIndex(
          cart,
          (item) =>
            item.product_id === data.product_id &&
            item.type === data.type &&
            item.item_size === data.item_size
        );

        if (index === -1) return successResponse([...cart, data]);

        if (data.id === null) {
          return successResponse([...cart.removeByIndex(index)]);
        }

        return successResponse([
          ...cart.insertWithDelete(index, data),
        ]);
      }
    }
  }, [data]);

  const successResponse = (newCart) => {
    setCart([...newCart]);
    localStorage.setItem("userCart", JSON.stringify(newCart));
  };

  const reloadCart = async () => setCart(null);

  const loadCart = async () => {
    if (cart) return;

    setFetchParams({
      url: BACKEND_PATH + "store/cart/",
      options: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authTokens.access,
        },
      },
    });
  };

  const increaseItemCount = async (id) => {
    const item = cart.filter((item) => item.id === id)[0];

    if (item && item.count === 10) return;

    setFetchParams({
      url: BACKEND_PATH + `store/cart/${id}/`,
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authTokens.access,
        },
        body: JSON.stringify({
          action: "add",
        }),
      },
    });
  };

  const decreaseItemCount = async (id) => {
    if (cart.filter((item) => item.id === id)[0]?.count === 1)
      return deleteItem(id);

    setFetchParams({
      url: BACKEND_PATH + `store/cart/${id}/`,
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authTokens.access,
        },
        body: JSON.stringify({
          action: "remove",
        }),
      },
    });
  };

  const deleteItem = async (id) => {
    setFetchParams({
      url: BACKEND_PATH + `store/cart/${id}/`,
      options: {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authTokens.access,
        },
      },
    });
  };

  const addItem = async (productId, type, size) => {
    setFetchParams({
      url: BACKEND_PATH + "store/cart/add/",
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authTokens.access,
        },
        body: JSON.stringify({
          productId,
          type,
          size,
        }),
      },
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
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
