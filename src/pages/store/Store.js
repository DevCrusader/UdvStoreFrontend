import React from "react";
import Banner from "../../components/Banner";
import ProductsList from "../../components/ProductsList";
import SideCart from "../../components/SideCart";
const Store = ({ theme }) => {
  return (
    <div>
      <Banner />
      <ProductsList theme={theme} />
      <SideCart />
    </div>
  );
};

export default Store;
