import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <Router>
    <AppContextProvider>
      <App />
      <Toaster />
    </AppContextProvider>
    
  </Router>
);
