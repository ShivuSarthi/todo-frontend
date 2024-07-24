// src/index.js

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <AuthProvider>
    <App />
    <ToastContainer autoClose={2000} />
  </AuthProvider>,
  document.getElementById("root")
);
