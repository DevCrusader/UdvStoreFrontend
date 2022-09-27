import React, { useContext, useEffect, useState } from "react";
import CartContext from "../context/CartContext";
import List from "../utils/List";

const CurrentItemCart = ({ productId, type, size }) => {
  const { cart, addItem, increaseItemCount, decreaseItemCount, loadCart } =
    useContext(CartContext);

  const [currentCartItem, setCurrentCartItem] = useState(null);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    if (cart) {
      setCurrentCartItem(
        cart.filter(
          (item) =>
            item.product_id == productId &&
            item.type == type &&
            item.item_size == size
        )[0]
      );
    }
  }, [cart, productId, type, size]);

  return (
    <div className="cart-mng">
      {currentCartItem ? (
        <span className="item-count-ctrl">
          <button
            className="decrease"
            onClick={() => decreaseItemCount(currentCartItem.id)}
          >
            –
          </button>
          <span>{currentCartItem && currentCartItem.count}</span>
          <button
            className="increase"
            onClick={() => increaseItemCount(currentCartItem.id)}
          >
            +
          </button>
        </span>
      ) : (
        <button
          className="add-order"
          onClick={() => addItem(productId, type, size)}
        >
          Добавить к заказу
        </button>
      )}
    </div>
  );
};

export default CurrentItemCart;
