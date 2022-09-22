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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    {/* <React.StrictMode> */}
    <App />
    {/* </React.StrictMode> */}
  </Router>
);
