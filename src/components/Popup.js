import React, { useEffect } from "react";

import "../static/css/popup.css";

const Popup = ({
  header = <h3>Popup header</h3>,
  body = <p>Popup body</p>,
  popupClassName = "",
  togglePopup = (f) =>
    console.log("Не задана функция закрытия попапа."),
}) => {
  return (
    <div className={`popup ${popupClassName}`}>
      {/* <button onClick={() => console.log("Click on popup bg.")}></button> */}
      <div className="popup-box">
        <button className="close-icon" onClick={togglePopup}></button>
        <div className="header">{header}</div>
        <div className="body">{body}</div>
      </div>
    </div>
  );
};

export default Popup;
