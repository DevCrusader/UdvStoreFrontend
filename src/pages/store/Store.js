import React from "react";
import Banner from "../../components/Banner";
import ProductsList from "../../components/ProductsList";
import SideCart from "../../components/SideCart";
const Store = ({ theme }) => {
  return (
    <>
      <Banner />
      <ProductsList theme={theme} />
      <SideCart />
    </>
  );
};

export default Store;
