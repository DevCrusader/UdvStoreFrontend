import React, { memo, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartContext from "../context/CartContext";
import List from "../utils/List";
import NumberWithIcon from "../utils/NumberWithUcoin";
import { BACKEND_PATH } from "../Settings";

import "../static/css/sideCart.css";

const PureSideCart = () => {
  const { cart, increaseItemCount, decreaseItemCount, deleteItem } =
    useContext(CartContext);

  const navigate = useNavigate();

  const [opened, setOpened] = useState(false);

  const cartitemsCount = (length) =>
    [
      length,
      (length > 10 && length < 20) ||
      length % 10 > 4 ||
      length % 10 === 0
        ? "товаров"
        : length % 10 === 1
        ? "товар"
        : "товара",
    ].join(" ");

  return (
    <>
      <div
        id="side-cart"
        className={`card side-cart ${
          !opened ? "close-side-cart" : "open-side-cart"
        }`}
      >
        <header>
          <button
            className="back-img-center"
            onClick={() => setOpened(false)}
          >
            Закрыть
          </button>
        </header>
        <List
          data={cart}
          listClassName={"cart-items"}
          renderItem={(item) => (
            <div className="cart-item">
              <img
                src={`${BACKEND_PATH}media/images/${item.photo}`}
              />
              <div className="item-info">
                <Link
                  to={`/udv/store/?productId=${item.product_id}&type=${item.type}`}
                >
                  {item.item_size
                    ? `${item.name}, ${item.type}, ${item.item_size}`
                    : `${item.name}, ${item.type}`}
                </Link>
                <div>
                  <span className="item-count-ctrl">
                    <button
                      className="decrease"
                      onClick={() => decreaseItemCount(item.id)}
                    >
                      –
                    </button>
                    <span> {item.count} </span>
                    <button
                      className="increase"
                      onClick={() => increaseItemCount(item.id)}
                    >
                      +
                    </button>
                  </span>
                  <NumberWithIcon
                    number={item.price}
                    ucoinColor={"white"}
                  />
                </div>
              </div>
              <div className="item-delete">
                <button
                  className="back-img-center"
                  onClick={() => deleteItem(item.id)}
                ></button>
              </div>
            </div>
          )}
          renderEmpty={<p>Cart is empty</p>}
        />
        <footer>
          {cart ? (
            <>
              <span>
                <span>Итого</span>
                <NumberWithIcon
                  number={
                    cart
                      ? cart.reduce(
                          (prev, next) =>
                            prev + next.count * next.price,
                          0
                        )
                      : 0
                  }
                  ucoinColor={"white"}
                />
              </span>
              <button onClick={() => navigate("/udv/confirm/")}>
                Оформить заказ
              </button>
            </>
          ) : (
            <p>Корзина в данный момент пуста</p>
          )}
        </footer>
      </div>
      {cart && Boolean(cart.length) && (
        <button
          className="back-img-center absolute-side-cart-btn"
          onClick={() => setOpened(true)}
        >
          {cartitemsCount(cart.length)}
        </button>
      )}
    </>
  );
};

const SideCart = memo(PureSideCart);

export default SideCart;
