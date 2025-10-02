import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import API from "../config/AxiosConfig";
import './css/ShoppingCart.css';

export default function ShoppingCart() {
    const { cart } = useCart();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        address: true,
        buyerInfo: false,
        paymentGuide: false
    });
    const [preferenceId, setPreferenceId] = useState(null);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    initMercadoPago("APP_USR-f797aea3-027d-460c-a135-f8ff8f445020", { locale: "es-CO" });

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
            const response = await API.get(("/api/shipping-addresses/ShippAdd" + "?idClient=" + tokdecoded.id));
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

    const handlePayment = async () => {
        if (!selectedAddress || cart.length === 0) return;

        try {
            // Prepara items para enviar al backend
            const items = cart.map(item => ({
                code: item.code,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                photo: item.photo
            }));

            const response = await API.post("/mercadopago/create-preference", items);
            console.log(response.data);
            setPreferenceId(response.data.preferenceId);

        } catch (error) {
            console.error("Error creando preferencia:", error);
            alert("Hubo un error al iniciar el pago");
        }
    };

    return (
        <>
            <div className="cart-page">
                <h1 className="cart-title">Productos en el carrito</h1>

                <div className="cart-layout">
                    {/* Columna Izquierda - Secciones */}
                    <div className="cart-left">
                        {/* Sección de Dirección de Envío */}
                        <div className="cart-section">
                            <div
                                onClick={() => toggleSection("address")}
                                className="cart-section-header">
                                <h3>Dirección de envío</h3>
                                <span>
                                    {expandedSections.address ? "−" : "+"}
                                </span>
                            </div>

                            {expandedSections.address && (
                                <div className="cart-section-body">
                                    {addresses.length === 0 ? (
                                        <div className="empty-address">
                                            <p>No tienes direcciones guardadas</p>
                                            <button
                                                onClick={() => setShowAddressModal(true)}
                                                className="btn-primary"
                                            >
                                                Agregar dirección
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            {addresses.map((address, index) => (
                                                <div key={index} className={`address-card ${selectedAddress?.id === address.id ? "selected" : ""}`}
                                                    onClick={() => setSelectedAddress(address)}
                                                >
                                                    <h4>{address.fullName}</h4>
                                                    <p>{address.addressLine1}</p>
                                                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                                                    <p>
                                                        {address.city}, {address.region}, {address.country}
                                                    </p>
                                                    <p>Teléfono: {address.phone}</p>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => setShowAddressModal(true)}
                                                className="btn-outline"
                                            >
                                                Agregar otra dirección
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sección de Información del Comprador */}
                        <div className="cart-section">
                            <div
                                onClick={() => toggleSection("buyerInfo")}
                                className="cart-section-header"
                            >
                                <h3>Información del comprador</h3>
                                <span>
                                    {expandedSections.buyerInfo ? "−" : "+"}
                                </span>
                            </div>

                            {expandedSections.buyerInfo && userData && (
                                <div className="cart-section-body">
                                    <div>
                                        <strong>Nombre completo:</strong>
                                        <p>{userData.fullName}</p>
                                    </div>
                                    <div>
                                        <strong>Correo electrónico:</strong>
                                        <p>{userData.email}</p>
                                    </div>
                                    <div>
                                        <strong>Número de teléfono:</strong>
                                        <p>{userData.phoneNumber}</p>
                                    </div>
                                </div>
                            )}
                            {expandedSections.buyerInfo && !userData && (
                                <div className="loading-text">
                                    <p>Cargando información del comprador...</p>
                                </div>
                            )}
                        </div>

                        {/* Sección de Guía para Pagar */}
                        <div className="cart-section">
                            <div
                                onClick={() => toggleSection("paymentGuide")}
                                className="cart-section-header"
                            >
                                <h3>Guía para pagar</h3>
                                <span>
                                    {expandedSections.paymentGuide ? "−" : "+"}
                                </span>
                            </div>

                            {expandedSections.paymentGuide && (
                                <div className="cart-section-body">
                                    <h4 className="highlight-title">Instrucciones de pago:</h4>
                                    <ol>
                                        <li>Verifica que todos tus datos estén correctos</li>
                                        <li>Selecciona tu dirección de envío</li>
                                        <li>Haz clic en "Ir a la pasarela de pagos"</li>
                                        <li>Serás redirigido a Mercado Pago, una pasarela 100% confiable</li>
                                        <li>Elige tu método de pago preferido</li>
                                        <li>Confirma tu compra y recibe la confirmación por email</li>
                                    </ol>

                                    <div className="payment-methods">
                                        <h4>Métodos de pago disponibles:</h4>
                                        <ul>
                                            <li>Tarjeta de crédito/débito (Visa, Mastercard, American Express)</li>
                                            <li>Efectivo (PSE, Baloto, Efecty)</li>
                                            <li>Transferencia bancaria</li>
                                            <li>Billeteras digitales</li>
                                        </ul>
                                    </div>

                                    <div className="payment-warning">
                                        <h4>⚠️ Importante:</h4>
                                        <p>
                                            Una vez confirmado el pago, recibirás un email con los detalles de tu compra.
                                            El envío se procesará en un plazo de 1-3 días hábiles.
                                        </p>
                                    </div>

                                    <div className="payment-link">
                                        <a
                                            href="https://www.mercadopago.com.co/ayuda/seguridad-y-proteccion_264"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Ver derechos y seguridad de Mercado Pago
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Columna Derecha - Productos */}
                    <div className="cart-right">
                        <div className="cart-summary">
                            <h3>
                                Resumen del pedido
                            </h3>

                            {cart.length === 0 ? (
                                <div className="empty-cart">
                                    <p>Tu carrito está vacío</p>
                                </div>
                            ) : (
                                <>
                                    <div className="cart-items">
                                        {cart.map(item => (
                                            <div key={item.code} className="cart-item">
                                                <img
                                                    src={item.photo}
                                                    alt={item.name}
                                                />
                                                <div className="item-info">
                                                    <h4>
                                                        {item.name}
                                                    </h4>
                                                    <p>
                                                        {item.description}
                                                    </p>
                                                    <div className="item-price">
                                                        <span >
                                                            ${item.price} × {item.quantity}
                                                        </span>
                                                        <strong>
                                                            ${item.price * item.quantity}
                                                        </strong>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="cart-total">
                                        <h2>Total: ${total}</h2>
                                        {!preferenceId && (
                                            <button
                                                onClick={handlePayment}
                                                disabled={!selectedAddress || cart.length === 0}
                                                className={`btn-pay ${!selectedAddress || cart.length === 0 ? "disabled" : ""}`}
                                            >
                                                Ir a la pasarela de pagos
                                            </button>
                                        )}

                                        {preferenceId && (
                                            <Wallet
                                                initialization={{ preferenceId }}
                                                customization={{ texts: { valueProp: "smart_option" } }}
                                            />
                                        )}

                                        {!selectedAddress && cart.length > 0 && (
                                            <p className="warning-text">
                                                ⚠️ Selecciona una dirección de envío para continuar
                                            </p>
                                        )}

                                        {cart.length === 0 && (
                                            <p className="warning-text">
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
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Agregar Dirección de Envío</h2>
                        <p>
                            Agrega una nueva dirección para completar tu compra
                        </p>
                        <button
                            onClick={() => setShowAddressModal(false)}
                            className="modal-close"
                        >
                            ×
                        </button>
                        <div className="modal-body">
                            <p>Para agregar una nueva dirección, ve a la página de "Direcciones de envío"</p>
                            <button
                                onClick={() => {
                                    setShowAddressModal(false);
                                    navigate("/shipping-addresses");
                                }}
                                className="btn-primary"
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
