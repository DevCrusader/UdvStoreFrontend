import React from "react";

const NumberWithIcon = ({
  number,
  ucoinColor = "black",
  additionalClasses = [],
}) => {
  return (
    <span className={["number-with-icon", ...additionalClasses].join(" ")}>
      <span className="price">{number}</span>
      <span className={`back-img-center icon ${ucoinColor}`}></span>
    </span>
  );
};

export default NumberWithIcon;
