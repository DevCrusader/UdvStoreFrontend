import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import CartContext from "../../context/CartContext";
import List from "../../utils/List";
import NumberWithIcon from "../../utils/NumberWIthUcoin";
import "../../static/css/confirmPage.css";

const Confirm = () => {
  const { cart, increaseItemCount, decreaseItemCount, deleteItem, reloadCart } =
    useContext(CartContext);

  const { user, authFetch, updateUserBalance } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    reloadCart();
  }, []);

  const returnToStore = () => navigate("/udv/store/");

  const placeOrder = useCallback((e) => {
    const fn = async () => {
      e.preventDefault();

      // setOrderDetails({});
      const response = await authFetch(
        "https://artomdev.pythonanywhere.com/user/order/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            office: e.target.office.value,
            paymentMethod: e.target.paymentMethod.checked ? "ucoins" : "rubles",
          }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setOrderDetails(data);
        reloadCart();
        updateUserBalance();
      }
    };

    fn();
  }, []);

  return (
    <>
      {orderDetails ? (
        <div className="confirm-order back-img-center">
          <div className="order-details">
            <h3>Ваш заказ успешно сформирован</h3>
            <div>
              <p>Номер заказа: {orderDetails.id}</p>
              <p>Способ оплаты: {orderDetails.payment_method}</p>
              <p>Место получения: {orderDetails.office}</p>
            </div>
            <div>
              <p>Какие-нибудь детали самого заказа</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="confirm-page">
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
                  >
                    Удалить
                  </button>
                </div>
              </div>
            )}
            renderEmpty={<p>Cart is empty</p>}
          />
          <ConfirmManage
            totalCount={
              cart
                ? cart.reduce((prev, next) => prev + next.count * next.price, 0)
                : 0
            }
            userBalance={user.balance}
            formSubmit={placeOrder}
            returnToStore={returnToStore}
          />
        </div>
      )}
    </>
  );
};

export default Confirm;

const ConfirmManage = ({
  totalCount,
  userBalance,
  formSubmit = (f) => f,
  returnToStore = (f) => f,
}) => {
  const [ucoinsPayment, setUcoinsPayment] = useState(true);
  return (
    <div className="confirm-mng">
      <form onSubmit={formSubmit}>
        <div>
          <span>Итого</span>
          <NumberWithIcon number={totalCount} ucoinColor={"black"} />
        </div>
        <List
          data={[
            {
              label: "Ясная, 14А",
              value: "Yasnaya",
            },
            {
              label: "Ленина, 8",
              value: "Lenina",
            },
            {
              label: "Мира, 6",
              value: "Mira",
            },
          ]}
          listClassName={"offices-wrapper"}
          renderItem={(office, index) => (
            <>
              <input
                type="radio"
                name="office"
                id={`office-${office.value.toLowerCase()}`}
                value={office.value}
                defaultChecked={!index}
              />
              <label htmlFor={`office-${office.value.toLowerCase()}`}>
                {office.label}
              </label>
            </>
          )}
        />
        <div>
          <label htmlFor="paymentMethod">Оплачу юкоинами: </label>
          <input
            type="checkbox"
            id="paymentMethod"
            name="paymentMethod"
            checked={ucoinsPayment}
            onChange={() => setUcoinsPayment(!ucoinsPayment)}
          />
        </div>
        <div className="mng-btns">
          <button
            className="place-order-btn"
            type="submit"
            disabled={ucoinsPayment && totalCount > userBalance}
          >
            Оформить заказ
          </button>
          {ucoinsPayment && totalCount > userBalance && (
            <span className="err-msg">Недостаточно юкоинов</span>
          )}
          <button
            className="back-to-store-btn"
            type="button"
            onClick={returnToStore}
          >
            Вернуться в магазин
          </button>
        </div>
      </form>
    </div>
  );
};
