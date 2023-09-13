import React from "react"; // A default import declaration
import ReactDOM from "react-dom/client"; // A default import declaration
import { BrowserRouter as Router } from "react-router-dom"; // A namespace import declaration
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react"; // Named export declarations
import { Mumbai, Sepolia } from "@thirdweb-dev/chains";

import { StateContextProvider } from "./context";
import App from "./App";
import "./index.css"; // A side effect import declaration

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ThirdwebProvider
    activeChain={Mumbai}
    clientId="b1f529b9e7d0224cf4e37a31fc509e88"
  >
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider>
);
