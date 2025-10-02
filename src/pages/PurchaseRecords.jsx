import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { useAuth } from '../context/AuthContext';
import API from "../config/AxiosConfig";

export default function PurchaseRecords() {
    const [records, setRecords] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);
    const [userType, setUserType] = useState("CLIENT");
    const [items, setItems] = useState({});
    const { token } = useAuth();

    useEffect(() => {
        const tkdec = jwtDecode(token);
        setUserType(tkdec.userType);
        console.log(tkdec.userType);
        const fetchRecords = async () => {
            try {
                const response = await API.get("/api/purchases");
                console.log(response.data);
                setRecords(response.data);
            } catch (error) {
                console.error("Error cargando registros:", error);
            }
        };
        fetchRecords();
    }, []);

    const fetchItems = async (mpPaymentId) => {
        try {
            const response = await API.get(`/api/purchases/${mpPaymentId}/items`);
            console.log(response);
            setItems((prev) => ({ ...prev, [mpPaymentId]: response.data }));
        } catch (error) {
            console.error("Error cargando items:", error);
        }
    };

    const toggleExpand = (record) => {
        if (expandedRow === record.id) {
            setExpandedRow(null);
        } else {
            setExpandedRow(record.id);
            if (!items[record.mpPaymentId]) {
                fetchItems(record.mpPaymentId);
            }
        }
    };

    const parseProducts = (rawData) => {
        try {
            const data = JSON.parse(rawData);
            return data.items || [];
        } catch {
            return [];
        }
    };

    const updateShippingStatus = async (id, newStatus) => {
        try {
            await API.put(`/api/purchases/${id}/shipping`, newStatus);
            setRecords((prev) =>
                prev.map((r) =>
                    r.id === id ? { ...r, shippingStatus: newStatus } : r
                )
            );
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Estado de envío actualizado exitosamente",
                showConfirmButton: false,
                timer: 2000,
            });
        } catch (error) {
            console.error("Error actualizando estado:", error);
        }
    };

    return (
        <div style={{ maxWidth: "1000px", margin: "auto", padding: "20px" }}>
            <h1 style={{ textAlign: "center" }}>Registro de compras</h1>

            {records.length === 0 ? (
                <p style={{ textAlign: "center" }}>No hay compras registradas aún</p>
            ) : (
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "20px",
                        textAlign: "center"
                    }}
                >
                    <thead style={{ background: "#f4f4f4" }}>
                        <tr>
                            <th style={th}>ID Pago</th>
                            <th style={th}>Status</th>
                            <th style={th}>Monto</th>
                            <th style={th}>Moneda</th>
                            <th style={th}>Fecha</th>
                            <th style={th}>Acciones</th>
                            <th style={th}>Envío</th>
                        </tr>
                    </thead>

                    <tbody>
                        {records.map((record) => {
                            const products = parseProducts(record.rawData);
                            return (
                                <React.Fragment key={record.id}>
                                    <tr style={{ borderBottom: "1px solid #ddd" }}>
                                        <td style={td}>{record.mpPaymentId}</td>
                                        <td style={td}>{record.status}</td>
                                        <td style={td}>${record.amount}</td>
                                        <td style={td}>{record.currency}</td>
                                        <td style={td}>
                                            {record.createdAt
                                                ? new Date(record.createdAt).toLocaleString()
                                                : "N/A"}
                                        </td>

                                        <td style={td}>
                                            <button
                                                onClick={() => toggleExpand(record)}
                                                style={{
                                                    padding: "5px 10px",
                                                    border: "none",
                                                    background: "#007bff",
                                                    color: "white",
                                                    borderRadius: "5px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                {expandedRow === record.id ? "Ocultar productos" : "Ver productos"}
                                            </button>
                                        </td>
                                        {/* ShippingStatus */}
                                        <td style={td}>
                                            {userType === "Administrator" ? (
                                                <select
                                                    value={record.shippingStatus}
                                                    onChange={(e) => updateShippingStatus(record.id, e.target.value)}
                                                    style={{
                                                        padding: "5px 8px",
                                                        borderRadius: "4px",
                                                        border: "1px solid #ccc",
                                                        background: "#fff",
                                                        color: "#000000ff",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    <option value="EN_PROCESO">En Proceso</option>
                                                    <option value="ENVIADO">Enviado</option>
                                                    <option value="ENTREGADO">Entregado</option>
                                                    <option value="PROBLEMA">Problema detectado</option>
                                                </select>
                                            ) : (
                                                <>
                                                    {
                                                        record.shippingStatus.includes("EN_PROCESO") ? (
                                                            <span style={{ color: "orange" }}>En Proceso</span>
                                                        ) : record.shippingStatus === "ENVIADO" ? (
                                                            <span style={{ color: "blue" }}>Enviado</span>
                                                        ) : record.shippingStatus === "ENTREGADO" ? (
                                                            <span style={{ color: "green" }}>Entregado</span>
                                                        ) : record.shippingStatus === "PROBLEMA" ? (
                                                            <span style={{ color: "red" }}>Probema detectado</span>
                                                        ) : (
                                                            <span>{record.shippingStatus}</span>
                                                        )
                                                    }
                                                </>
                                            )}
                                        </td>

                                    </tr>

                                    {expandedRow === record.id && items[record.mpPaymentId] && (
                                        <tr>
                                            <td colSpan="7">
                                                <table
                                                    style={{
                                                        width: "90%",
                                                        margin: "10px auto",
                                                        borderCollapse: "collapse",
                                                        background: "#fafafa",
                                                        fontSize: "14px"
                                                    }}
                                                >
                                                    <thead style={{ background: "#eee" }}>
                                                        <tr>
                                                            <th>Imagen</th>
                                                            <th>Producto</th>
                                                            <th>Cantidad</th>
                                                            <th>Precio</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {items[record.mpPaymentId].map((p, i) => (
                                                            <tr key={i}>
                                                                <td>
                                                                    <img
                                                                        src={p.pictureUrl}
                                                                        alt={p.title}
                                                                        style={{
                                                                            width: "60px",
                                                                            height: "60px",
                                                                            objectFit: "cover",
                                                                            borderRadius: "5px"
                                                                        }}
                                                                    />
                                                                </td>
                                                                <td>{p.title}</td>
                                                                <td>{p.quantity}</td>
                                                                <td>${p.unitPrice}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}

                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

const th = {
    padding: "10px",
    borderBottom: "2px solid #ddd"
};

const td = {
    padding: "10px",
    borderBottom: "1px solid #ddd"
};
