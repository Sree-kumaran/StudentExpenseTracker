import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { ThemeProvider } from "./context/ThemeContext";
import { ExpenseProvider } from "./context/ExpenseContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <ExpenseProvider>
        <App />
      </ExpenseProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
