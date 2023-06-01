import React from "react"; // A default import declaration
import ReactDOM from "react-dom/client"; // A default import declaration
import { BrowserRouter as Router } from "react-router-dom"; // A namespace import declaration
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react"; // Named export declarations

import { StateContextProvider } from "./context";
import App from "./App";
import "./index.css"; // A side effect import declaration

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <ThirdwebProvider activeChain={ChainId.Mumbai}>
        <Router>
            <StateContextProvider>
                <App />
            </StateContextProvider>
        </Router>
    </ThirdwebProvider>
);
