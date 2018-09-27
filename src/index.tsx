import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import App from "./components/app/App";

import "./index.css";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement
);

// import registerServiceWorker from "./registerServiceWorker";
// registerServiceWorker();
