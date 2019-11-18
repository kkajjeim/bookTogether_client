import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Main from "./Component/main/index";
import "../node_modules/uikit/dist/css/uikit.css";
import "../node_modules/uikit/dist/js/uikit.js";
import "../node_modules/uikit/dist/js/uikit-icons.min.js";
// import MyPage from "./component/mypage/index";
import { Provider } from "react-redux";
import Store from "./Redux/configureStore";

ReactDOM.render(
  <Provider store={Store}>
    {console.log(Store)}
    <App />
  </Provider>,
  document.getElementById("root")
);
