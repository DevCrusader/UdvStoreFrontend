import React from "react";
import "../static/css/banner.css";
import List from "../utils/List";

const Banner = () => {
  return (
    <div className="banner">
      <List
        data={"МАГАЗИН".split("")}
        renderItem={(item) => item}
        listClassName={"banner-name"}
      />
    </div>
  );
};

export default Banner;
