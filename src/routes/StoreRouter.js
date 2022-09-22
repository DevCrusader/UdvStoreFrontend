import React from "react";
import { useLocation } from "react-router-dom";

import Store from "../pages/store/Store";
import Product from "../pages/store/Product";

const StoreRouter = ({ theme }) => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);

  return (
    <div className={[theme.toLowerCase(), "container"].join(" ")}>
      {search.get("productId") ? (
        <Product
          theme={theme}
          productId={search.get("productId")}
          type={search.get("type")}
        />
      ) : (
        <Store theme={theme} />
      )}
    </div>
  );
};

export default StoreRouter;
