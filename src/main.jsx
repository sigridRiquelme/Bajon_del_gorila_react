import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

// ESTILOS GENERALES DEL SITIO
import "./styles/Base.css";
import "./styles/componentes.css";

// BOOTSTRAP
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";


createRoot(document.getElementById("root")).render(
    <StrictMode>

        <BrowserRouter>

            <App />

        </BrowserRouter>

    </StrictMode>
);