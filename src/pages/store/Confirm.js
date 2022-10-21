import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import CartContext from "../../context/CartContext";
import List from "../../utils/List";
import NumberWithIcon from "../../utils/NumberWithUcoin";
import "../../static/css/confirmPage.css";
import useAuthFetch from "../../hooks/useAuthFetch";
import { BACKEND_PATH } from "../../Settings";

const Confirm = () => {
  const {
    cart,
    increaseItemCount,
    decreaseItemCount,
    deleteItem,
    reloadCart,
  } = useContext(CartContext);

  const { user, changeUserBalance } = useContext(AuthContext);

  const [fetchParams, setFetchParams] = useState({
    url: "",
    options: {},
  });

  const { loading, data, error } = useAuthFetch(fetchParams);

  const [orderDetails, setOrderDetails] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    reloadCart();
  }, []);

  useEffect(() => {
    console.log("Get Data!");
    if (data) {
      console.log("Get Data!");

      setOrderDetails(data);
      reloadCart();
      changeUserBalance(
        "decrease",
        data.products.reduce(
          (prev, next) => prev + next.count * next.price,
          0
        )
      );
    }
  }, [data]);

  const returnToStore = () => navigate("/udv/store/");

  const placeOrder = async (office, paymentMethod) => {
    setFetchParams({
      url: BACKEND_PATH + "user/order/create/",
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          office,
          paymentMethod,
        }),
      },
    });
  };

  return (
    <>
      {orderDetails ? (
        <div className="confirm-order back-img-center">
          <div className="order-details">
            <h3>Ваш заказ успешно сформирован</h3>
            <div>
              <p>Номер заказа: {orderDetails.id}</p>
              <p>Место получения: {orderDetails.office}</p>
            </div>
            <div style={{ width: "400px" }}>
              Товары:{" "}
              {orderDetails.products
                .map(
                  (item) =>
                    `${item.name} ${item.type}${
                      item.item_size ? ` ${item.item_size}` : ""
                    }`
                )
                .join(", ")}
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
                ? cart.reduce(
                    (prev, next) => prev + next.count * next.price,
                    0
                  )
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
  const [office, setOffice] = useState("Шейнкмана, 123");

  return (
    <div className="confirm-mng">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          formSubmit(office, ucoinsPayment ? "ucoins" : "rubles");
        }}
      >
        <div>
          <span>Итого</span>
          <NumberWithIcon number={totalCount} ucoinColor={"black"} />
        </div>
        <ul className="offices-wrapper">
          <li>
            <input
              type="radio"
              name="office"
              id={`office-1`}
              defaultChecked={true}
              onFocus={() => setOffice("Шейнкмана, 123")}
            />
            <label htmlFor={`office-1`}>Шейнкмана, 123</label>
          </li>
          <li>
            <input
              type="radio"
              name="office"
              id={`office-2`}
              onFocus={() => setOffice("Деловой квартал")}
            />
            <label htmlFor={`office-2`}>Деловой квартал</label>
          </li>
          <li>
            <input
              type="radio"
              name="office"
              id={`office-3`}
              onFocus={() => setOffice("Ткачей, 23")}
            />
            <label htmlFor={`office-3`}>Ткачей, 23</label>
          </li>
          <li>
            <input
              type="radio"
              name="office"
              id={`office-4`}
              onFocus={() => setOffice("Ткачей, 6")}
            />
            <label htmlFor={`office-4`}>Ткачей, 6</label>
          </li>
          <li>
            <input
              type="radio"
              name="office"
              id={`office-5`}
              onFocus={() => setOffice("Космонавтов, 15")}
            />
            <label htmlFor={`office-5`}>Космонавтов, 15</label>
          </li>
          <li>
            <input type="radio" name="office" id={`office-6`} />
            <label htmlFor={`office-6`}>
              <input
                type="text"
                name="office"
                placeholder="Другое:"
                onFocus={(e) => {
                  const element = document.getElementById("office-6");
                  element.checked = true;
                  setOffice(e.target.value);
                }}
                onChange={(e) => setOffice(e.target.value)}
              />
            </label>
          </li>
        </ul>
        <input
          type="hidden"
          id="paymentMethod"
          name="paymentMethod"
          checked={ucoinsPayment}
          onChange={() => setUcoinsPayment(!ucoinsPayment)}
        />
        <div className="mng-btns">
          <button
            className="place-order-btn"
            type="submit"
            disabled={
              !totalCount ||
              (ucoinsPayment && totalCount > userBalance)
            }
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
