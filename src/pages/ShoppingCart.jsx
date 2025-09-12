import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import API from "../config/AxiosConfig";

export default function ShoppingCart() {
    const { cart } = useCart();
    const { token } = useAuth();
    const [userData, setUserData] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        address: true,
        buyerInfo: false,
        paymentGuide: false
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    useEffect(() => {
        if (token) {
            fetchUserData();
            fetchAddresses();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const fetchUserData = async () => {
        try {
            const tokdecoded = jwtDecode(token);
            const response = await API.get(`/api/users/email?email=${tokdecoded.sub}`);
            setUserData(response.data);
        } catch (error) {
            console.error("Error fetching user data", error);
        }
    };

    const fetchAddresses = async () => {
        try {
            const tokdecoded = jwtDecode(token);
            console.log(tokdecoded);
            const response = await API.get(("/api/shipping-addresses/ShippAdd" + "?idClient=" + tokdecoded.ID));
            const addressesData = Array.isArray(response.data) ? response.data : [];
            setAddresses(response.data);
        } catch (error) {
            console.error("Error fetching addresses", error);
        }
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handlePayment = () => {
        if (!selectedAddress || cart.length === 0) {
            return;
        }
        
        // Aquí se integraría con Mercado Pago
        // Por ahora mostramos un mensaje de confirmación
        const confirmPayment = window.confirm(
            `¿Confirmar compra por $${total}?\n\n` +
            `Dirección de envío: ${selectedAddress.fullName}\n` +
            `${selectedAddress.addressLine1}, ${selectedAddress.city}\n\n` +
            `Serás redirigido a Mercado Pago para completar el pago.`
        );
        
        if (confirmPayment) {
            // Aquí iría la integración real con Mercado Pago
            alert("Redirigiendo a Mercado Pago...\n\n(Esta es una simulación - en producción se abriría la pasarela de pago real)");
        }
    };

    return (
        <>
            <div style={{ marginTop: "100px", textAlign: "center" }}>
                <h1>Productos en el carrito</h1>
                
                <div style={{ 
                    display: "flex", 
                    gap: "40px", 
                    maxWidth: "1200px", 
                    margin: "40px auto",
                    padding: "0 20px"
                }}>
                    {/* Columna Izquierda - Secciones */}
                    <div style={{ flex: 1, maxWidth: "600px" }}>
                        {/* Sección de Dirección de Envío */}
                        <div style={{
                            background: "#fff",
                            borderRadius: "12px",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                            marginBottom: "20px",
                            overflow: "hidden"
                        }}>
                            <div 
                                onClick={() => toggleSection("address")}
                                style={{
                                    background: "#f8f9fa",
                                    padding: "20px",
                                    cursor: "pointer",
                                    borderBottom: expandedSections.address ? "1px solid #eee" : "none",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <h3 style={{ margin: 0, color: "#333" }}>Dirección de envío</h3>
                                <span style={{ fontSize: "20px" }}>
                                    {expandedSections.address ? "−" : "+"}
                                </span>
                            </div>
                            
                            {expandedSections.address && (
                                <div style={{ padding: "20px" }}>
                                    {addresses.length === 0 ? (
                                        <div style={{ textAlign: "center", color: "#666" }}>
                                            <p>No tienes direcciones guardadas</p>
                                            <button 
                                                onClick={() => setShowAddressModal(true)}
                                                style={{
                                                    background: "#2a8",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    padding: "10px 20px",
                                                    cursor: "pointer",
                                                    marginTop: "10px"
                                                }}
                                            >
                                                Agregar dirección
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            {addresses.map((address, index) => (
                                                <div key={index} style={{
                                                    border: selectedAddress?.id === address.id ? "2px solid #2a8" : "1px solid #eee",
                                                    borderRadius: "8px",
                                                    padding: "15px",
                                                    marginBottom: "10px",
                                                    cursor: "pointer",
                                                    background: selectedAddress?.id === address.id ? "#f0f8ff" : "#fff"
                                                }}
                                                onClick={() => setSelectedAddress(address)}
                                                >
                                                    <h4 style={{ margin: "0 0 8px 0" }}>{address.fullName}</h4>
                                                    <p style={{ margin: "4px 0", color: "#666" }}>{address.addressLine1}</p>
                                                    {address.addressLine2 && <p style={{ margin: "4px 0", color: "#666" }}>{address.addressLine2}</p>}
                                                    <p style={{ margin: "4px 0", color: "#666" }}>
                                                        {address.city}, {address.region}, {address.country}
                                                    </p>
                                                    <p style={{ margin: "4px 0", color: "#666" }}>Teléfono: {address.phone}</p>
                                                </div>
                                            ))}
                                            <button 
                                                onClick={() => setShowAddressModal(true)}
                                                style={{
                                                    background: "transparent",
                                                    color: "#2a8",
                                                    border: "1px solid #2a8",
                                                    borderRadius: "6px",
                                                    padding: "8px 16px",
                                                    cursor: "pointer",
                                                    marginTop: "10px"
                                                }}
                                            >
                                                Agregar otra dirección
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sección de Información del Comprador */}
                        <div style={{
                            background: "#fff",
                            borderRadius: "12px",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                            marginBottom: "20px",
                            overflow: "hidden"
                        }}>
                            <div 
                                onClick={() => toggleSection("buyerInfo")}
                                style={{
                                    background: "#f8f9fa",
                                    padding: "20px",
                                    cursor: "pointer",
                                    borderBottom: expandedSections.buyerInfo ? "1px solid #eee" : "none",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <h3 style={{ margin: 0, color: "#333" }}>Información del comprador</h3>
                                <span style={{ fontSize: "20px" }}>
                                    {expandedSections.buyerInfo ? "−" : "+"}
                                </span>
                            </div>
                            
                            {expandedSections.buyerInfo && userData && (
                                <div style={{ padding: "20px" }}>
                                    <div style={{ marginBottom: "15px" }}>
                                        <strong>Nombre completo:</strong>
                                        <p style={{ margin: "5px 0", color: "#666" }}>{userData.fullName}</p>
                                    </div>
                                    <div style={{ marginBottom: "15px" }}>
                                        <strong>Correo electrónico:</strong>
                                        <p style={{ margin: "5px 0", color: "#666" }}>{userData.email}</p>
                                    </div>
                                    <div>
                                        <strong>Número de teléfono:</strong>
                                        <p style={{ margin: "5px 0", color: "#666" }}>{userData.phoneNumber}</p>
                                    </div>
                                </div>
                            )}
                            {expandedSections.buyerInfo && !userData && (
                                <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                                    <p>Cargando información del comprador...</p>
                                </div>
                            )}
                        </div>

                        {/* Sección de Guía para Pagar */}
                        <div style={{
                            background: "#fff",
                            borderRadius: "12px",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                            marginBottom: "20px",
                            overflow: "hidden"
                        }}>
                            <div 
                                onClick={() => toggleSection("paymentGuide")}
                                style={{
                                    background: "#f8f9fa",
                                    padding: "20px",
                                    cursor: "pointer",
                                    borderBottom: expandedSections.paymentGuide ? "1px solid #eee" : "none",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <h3 style={{ margin: 0, color: "#333" }}>Guía para pagar</h3>
                                <span style={{ fontSize: "20px" }}>
                                    {expandedSections.paymentGuide ? "−" : "+"}
                                </span>
                            </div>
                            
                            {expandedSections.paymentGuide && (
                                <div style={{ padding: "20px" }}>
                                    <div style={{ marginBottom: "20px" }}>
                                        <h4 style={{ color: "#2a8", marginBottom: "10px" }}>Instrucciones de pago:</h4>
                                        <ol style={{ paddingLeft: "20px", lineHeight: "1.6" }}>
                                            <li>Verifica que todos tus datos estén correctos</li>
                                            <li>Selecciona tu dirección de envío</li>
                                            <li>Haz clic en "Ir a la pasarela de pagos"</li>
                                            <li>Serás redirigido a Mercado Pago, una pasarela 100% confiable</li>
                                            <li>Elige tu método de pago preferido</li>
                                            <li>Confirma tu compra y recibe la confirmación por email</li>
                                        </ol>
                                    </div>
                                    
                                    <div style={{ 
                                        background: "#f0f8ff", 
                                        padding: "15px", 
                                        borderRadius: "8px",
                                        border: "1px solid #2a8",
                                        marginBottom: "15px"
                                    }}>
                                        <h4 style={{ margin: "0 0 10px 0", color: "#2a8" }}>Métodos de pago disponibles:</h4>
                                        <ul style={{ margin: 0, paddingLeft: "20px" }}>
                                            <li>Tarjeta de crédito/débito (Visa, Mastercard, American Express)</li>
                                            <li>Efectivo (PSE, Baloto, Efecty)</li>
                                            <li>Transferencia bancaria</li>
                                            <li>Billeteras digitales</li>
                                        </ul>
                                    </div>

                                    <div style={{ 
                                        background: "#fff3cd", 
                                        padding: "15px", 
                                        borderRadius: "8px",
                                        border: "1px solid #ffeaa7",
                                        marginBottom: "15px"
                                    }}>
                                        <h4 style={{ margin: "0 0 10px 0", color: "#856404" }}>⚠️ Importante:</h4>
                                        <p style={{ margin: 0, fontSize: "14px", color: "#856404" }}>
                                            Una vez confirmado el pago, recibirás un email con los detalles de tu compra. 
                                            El envío se procesará en un plazo de 1-3 días hábiles.
                                        </p>
                                    </div>
                                    
                                    <div style={{ textAlign: "center" }}>
                                        <a 
                                            href="https://www.mercadopago.com.co/ayuda/seguridad-y-proteccion_264" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{ 
                                                color: "#2a8", 
                                                textDecoration: "none",
                                                fontSize: "14px"
                                            }}
                                        >
                                            Ver derechos y seguridad de Mercado Pago
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Columna Derecha - Productos */}
                    <div style={{ flex: 1, maxWidth: "500px" }}>
                        <div style={{
                            background: "#fff",
                            borderRadius: "12px",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                            padding: "20px"
                        }}>
                            <h3 style={{ marginTop: 0, marginBottom: "20px", textAlign: "center" }}>
                                Resumen del pedido
                            </h3>
                            
                            {cart.length === 0 ? (
                                <div style={{ textAlign: "center", color: "#666", padding: "40px 0" }}>
                                    <p>Tu carrito está vacío</p>
                                </div>
                            ) : (
                                <>
                                    <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "20px" }}>
                                        {cart.map(item => (
                                            <div key={item.code} style={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                padding: "12px 0",
                                                borderBottom: "1px solid #eee"
                                            }}>
                                                <img 
                                                    src={item.photo} 
                                                    alt={item.name}
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                        objectFit: "cover",
                                                        borderRadius: "6px",
                                                        marginRight: "12px",
                                                        flexShrink: 0
                                                    }}
                                                />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <h4 style={{ 
                                                        margin: "0 0 4px 0", 
                                                        fontSize: "14px",
                                                        fontWeight: "bold",
                                                        lineHeight: "1.3"
                                                    }}>
                                                        {item.name}
                                                    </h4>
                                                    <p style={{ 
                                                        margin: "0 0 6px 0", 
                                                        color: "#666", 
                                                        fontSize: "12px",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                        lineHeight: "1.3"
                                                    }}>
                                                        {item.description}
                                                    </p>
                                                    <div style={{ 
                                                        display: "flex", 
                                                        justifyContent: "space-between", 
                                                        alignItems: "center",
                                                        fontSize: "13px"
                                                    }}>
                                                        <span style={{ color: "#2a8", fontWeight: "bold" }}>
                                                            ${item.price} × {item.quantity}
                                                        </span>
                                                        <span style={{ fontWeight: "bold", color: "#333" }}>
                                                            ${item.price * item.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div style={{ 
                                        borderTop: "2px solid #eee", 
                                        paddingTop: "20px",
                                        textAlign: "center"
                                    }}>
                                        <div style={{ 
                                            fontSize: "24px", 
                                            fontWeight: "bold", 
                                            color: "#333",
                                            marginBottom: "20px"
                                        }}>
                                            Total: ${total}
                                        </div>
                                        
                                        <button 
                                            onClick={handlePayment}
                                            disabled={!selectedAddress || cart.length === 0}
                                            style={{
                                                background: selectedAddress && cart.length > 0 ? "#2a8" : "#ccc",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "8px",
                                                padding: "15px 30px",
                                                fontSize: "18px",
                                                fontWeight: "bold",
                                                cursor: selectedAddress && cart.length > 0 ? "pointer" : "not-allowed",
                                                width: "100%",
                                                transition: "background-color 0.3s ease"
                                            }}
                                        >
                                            Ir a la pasarela de pagos
                                        </button>
                                        
                                        {!selectedAddress && cart.length > 0 && (
                                            <p style={{ 
                                                color: "#e74c3c", 
                                                fontSize: "14px", 
                                                marginTop: "10px",
                                                margin: "10px 0 0 0",
                                                textAlign: "center"
                                            }}>
                                                ⚠️ Selecciona una dirección de envío para continuar
                                            </p>
                                        )}
                                        
                                        {cart.length === 0 && (
                                            <p style={{ 
                                                color: "#e74c3c", 
                                                fontSize: "14px", 
                                                marginTop: "10px",
                                                margin: "10px 0 0 0",
                                                textAlign: "center"
                                            }}>
                                                ⚠️ Tu carrito está vacío
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para agregar dirección */}
            {showAddressModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        background: "#fff",
                        padding: "32px",
                        borderRadius: "12px",
                        width: "90%",
                        maxWidth: "600px",
                        maxHeight: "90vh",
                        overflowY: "auto"
                    }}>
                        <h2 style={{ marginTop: 0, textAlign: "center" }}>Agregar Dirección de Envío</h2>
                        <p style={{ textAlign: "center", color: "#666", marginBottom: "20px" }}>
                            Agrega una nueva dirección para completar tu compra
                        </p>
                        <button 
                            onClick={() => setShowAddressModal(false)}
                            style={{
                                position: "absolute",
                                top: "15px",
                                right: "15px",
                                background: "none",
                                border: "none",
                                fontSize: "24px",
                                cursor: "pointer"
                            }}
                        >
                            ×
                        </button>
                        <div style={{ textAlign: "center", padding: "40px 0" }}>
                            <p>Para agregar una nueva dirección, ve a la página de "Direcciones de envío"</p>
                            <button 
                                onClick={() => {
                                    setShowAddressModal(false);
                                    window.location.href = "/shipping-addresses";
                                }}
                                style={{
                                    background: "#2a8",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    padding: "12px 24px",
                                    cursor: "pointer",
                                    marginTop: "15px"
                                }}
                            >
                                Ir a Direcciones de Envío
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
