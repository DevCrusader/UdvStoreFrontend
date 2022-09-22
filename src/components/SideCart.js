import React, { memo, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartContext from "../context/CartContext";
import List from "../utils/List";
import NumberWithIcon from "../utils/NumberWIthUcoin";

import "../static/css/sideCart.css";

const PureSideCart = () => {
  const { cart, increaseItemCount, decreaseItemCount, deleteItem, loadCart } =
    useContext(CartContext);

  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const openSideCart = () => {
    const element = document.getElementById("side-cart");

    element.classList.remove("close-side-cart");
    element.classList.add("open-side-cart");
  };

  const closeSideCart = () => {
    const element = document.getElementById("side-cart");

    element.classList.remove("open-side-cart");
    element.classList.add("close-side-cart");
  };

  const cartitemsCount = () => {
    const count = cart.length;

    return [
      count,
      (count > 10 && count < 20) || count % 10 > 4 || count % 10 === 0
        ? "товаров"
        : count % 10 === 1
        ? "товар"
        : "товара",
    ].join(" ");
  };

  return (
    <>
      <div id="side-cart" className="card side-cart">
        <header>
          <button className="back-img-center" onClick={closeSideCart}>
            Закрыть
          </button>
        </header>
        <List
          data={cart}
          listClassName={"cart-items"}
          renderItem={(item) => (
            <div className="cart-item">
              <img
                src={`https://artomdev.pythonanywhere.com/media/images/${item.photo}`}
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
                  <NumberWithIcon number={item.price} ucoinColor={"white"} />
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
                          (prev, next) => prev + next.count * next.price,
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
      <div>
        <button
          className="back-img-center absolute-side-cart-btn"
          onClick={openSideCart}
        >
          {cart && cart.length ? cartitemsCount() : "Корзина"}
        </button>
      </div>
    </>
  );
};

const SideCart = memo(PureSideCart);

export default SideCart;
