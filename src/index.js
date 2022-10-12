import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";

Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});

Array.prototype.insertWithDelete = function (index, ...items) {
  this.splice(index, items.length, ...items);
  return this;
};

Array.prototype.removeByIndex = function (index) {
  if (index >= 0 && index < this.length) this.splice(index, 1);
  return this;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    {/* <React.StrictMode> */}
    <App />
    {/* </React.StrictMode> */}
  </Router>
);
