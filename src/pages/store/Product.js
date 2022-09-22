import React, { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";

import SideCart from "../../components/SideCart";
import CurrentItemCart from "../../components/CurrentItemCart";
import ProductPhotos from "../../components/ProductPhotos";

import NumberWithIcon from "../../utils/NumberWIthUcoin";
import List from "../../utils/List";

import "../../static/css/productPage.css";

const _ProductInfo = ({ product }) => {
  return (
    <div className="info">
      <h1>{product?.name}</h1>
      <p>
        <NumberWithIcon number={product?.price} ucoinColor={"white"} />
      </p>
      <p>{product?.description}</p>
    </div>
  );
};

const ProductInfo = memo(_ProductInfo);

const Product = ({ productId, type, theme }) => {
  const [productInfo, setProductInfo] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentSize, setCurrentSize] = useState(null);
  const [productTheme, setProductTheme] = useState(theme);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Change theme");
    getProductInfo();
  }, [productTheme]);

  useEffect(() => {
    if (currentItem)
      if (currentItem.type !== type)
        navigate(`./?productId=${productId}&type=${currentItem.type}`);
  }, [currentItem]);

  useEffect(() => {
    if (currentItem)
      if (productInfo.have_size) setCurrentSize(currentItem.sizes[0]);
  }, [currentItem]);

  const getProductInfo = async () => {
    const url = `https://udvstore.pythonanywhere.com/store/products/${productId}/?theme=${productTheme}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "applications/json",
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      const searchedItem = data.items_list.filter((item) => item.type === type);

      setProductInfo(data);
      setCurrentItem(
        searchedItem.length ? searchedItem[0] : data.items_list[0]
      );
    } else if (response.status === 404 && data.theme) {
      navigate(
        `/${data.theme.toLowerCase()}/store/?productId=${productId}&type=${type}`
      );
      setProductTheme(data.theme);
    }
  };

  return (
    <div className="product-page">
      <div className={`decoration`}></div>
      <ProductPhotos photos={currentItem ? currentItem.photos : []} />
      <div className="product-info">
        <ProductInfo product={productInfo ? productInfo : null} />
        Цвет
        <br />
        <List
          data={productInfo ? productInfo.items_list : []}
          listClassName={"cur-item-mng colors"}
          renderItem={(item) => (
            <>
              <input
                id={`type-${item.id}`}
                name="type"
                type="radio"
                value={item.type}
                onChange={() =>
                  setCurrentItem(
                    productInfo.items_list.filter(
                      (_item) => _item.id === item.id
                    )[0]
                  )
                }
                checked={currentItem && currentItem.id === item.id}
              />
              <label htmlFor={`type-${item.id}`}>
                {item.type.toLowerCase()}
              </label>
            </>
          )}
          renderEmpty={<p>Empty</p>}
        />
        {productInfo &&
          productInfo.have_size &&
          currentItem &&
          currentItem.sizes &&
          currentSize && (
            <>
              <br />
              Размер
              <br />
              <List
                data={currentItem.sizes ? currentItem.sizes : []}
                listClassName={"cur-item-mng sizes"}
                renderItem={(size, index) => (
                  <>
                    <input
                      id={`size-${index}`}
                      name="size"
                      type="radio"
                      value={size}
                      checked={currentSize && currentSize === size}
                      onChange={() => setCurrentSize(size)}
                    />
                    <label htmlFor={`size-${index}`}>
                      {size.toLowerCase()}
                    </label>
                  </>
                )}
              />
            </>
          )}
        <CurrentItemCart
          productId={productId}
          type={currentItem ? currentItem.type : null}
          size={currentSize ? currentSize : null}
        />
        <SideCart />
      </div>
    </div>
  );
};

export default Product;
