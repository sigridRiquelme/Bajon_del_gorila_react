import axios from "axios";


export const subirImagenProductoApi = async (
    archivo
) => {

    const token =
        localStorage.getItem(
            "token"
        );


    const formulario =
        new FormData();


    formulario.append(
        "archivo",
        archivo
    );


    const respuesta =
        await axios.post(
            "http://localhost:8080/api/v1/productos/imagenes",
            formulario,
            {
                headers: {

                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


    return respuesta.data.url;
};