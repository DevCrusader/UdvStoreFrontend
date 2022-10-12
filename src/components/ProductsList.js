import React, { useState, useEffect } from "react";
import List from "../utils/List";
import { Link } from "react-router-dom";
import NumberWithIcon from "../utils/NumberWithUcoin";
import { BACKEND_PATH } from "../Settings";

import "../static/css/productsList.css";

const ProductsList = ({ theme }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    const url = `${BACKEND_PATH}store/products/?theme=${theme}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      setProducts(data);
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <div className="store products-list standart-container">
      <List
        data={products}
        renderItem={(item) => (
          <Link
            className="product-card back-img-center"
            to={`./?productId=${item.product_id}&type=${item.type}`}
          >
            <img
              className="contain"
              src={`${BACKEND_PATH}media/images/${item.photo}`}
              alt="photo"
            />
            <NumberWithIcon
              number={item.price}
              ucoinColor={"white"}
              additionalClasses={["item-price"]}
            />
          </Link>
        )}
        renderEmpty={<p>List is not empty</p>}
      />
    </div>
  );
};

export default ProductsList;
