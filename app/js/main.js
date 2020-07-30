import React from "react";
import ReactDOM from "react-dom";

import { App } from "./view/app.jsx";

export function main() {
  ReactDOM.render(
    <App />,
    document.getElementById("app")
  );
}
