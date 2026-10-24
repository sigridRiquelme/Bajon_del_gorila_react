import {
    useEffect
} from "react";

import {
    Outlet,
    useLocation
} from "react-router-dom";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";


function PublicLayout() {

    const location =
        useLocation();


    // SUBO ARRIBA CADA VEZ QUE CAMBIO DE PAGINA

    useEffect(() => {

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });

    }, [
        location.pathname
    ]);


    return (

        <>

            <Header />

            <Outlet />

            <Footer />

        </>

    );
}


export default PublicLayout;