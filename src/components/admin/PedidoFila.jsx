export default function PedidoFila({
    codigo,
    cliente,
    fecha,
    total,
    onVerDetalle
}) {
    return (
        <tr>
            <td>#{codigo}</td>
            <td>{cliente}</td>
            <td>{fecha}</td>

            <td>
                ${total.toLocaleString("es-CL")}
            </td>

            <td>
                <button
                    className="btn-ver-detalle"
                    onClick={() => onVerDetalle(codigo)}
                >
                    Ver detalle
                </button>
            </td>
        </tr>
    );
}