import React from 'react';
import './css/CartMenu.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartMenu({
    open,
    onClose,
}) {

    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [expanded, setExpanded] = useState({});
    const { token } = useAuth();

    const navigate = useNavigate();

    const handleToggleDescription = (code) => {
        setExpanded(prev => ({
            ...prev,
            [code]: !prev[code]
        }));
    };

    // Helper to truncate text and add "ver más"
    const getTruncatedDescription = (desc, maxLen = 60) => {
        if (desc.length <= maxLen) return desc;
        return desc.slice(0, maxLen) + '...';
    };

    return (
        <div className={`cart-menu ${open ? 'open' : ''}`}>
            <button onClick={onClose} className="cart-close">×</button>

            <h2 className="cart-header">Productos en el carrito</h2>

            <div className="cart-content">
                {cart.length === 0 && (
                    <div className="cart-empty">El carrito está vacío.</div>
                )}

                {cart.map(item => {
                    const isExpanded = expanded[item.code];
                    return (
                        <div key={item.code} className="cart-item">
                            <div className="item-title">{item.name}</div>

                            <div className={`item-main ${isExpanded ? 'expanded' : ''}`}>
                                <img
                                    src={item.photo}
                                    alt={item.name}
                                    className="item-image"
                                />
                                <div className="item-details">
                                    <div className="item-description">
                                        {!isExpanded
                                            ? (
                                                <>
                                                    {getTruncatedDescription(item.description)}
                                                    {item.description.length > 60 && (
                                                        <span
                                                            onClick={() => handleToggleDescription(item.code)}
                                                            className="toggle-desc"
                                                        >
                                                            ver más
                                                        </span>
                                                    )}
                                                </>
                                            )
                                            : (
                                                <>
                                                    {item.description}
                                                    <span
                                                        onClick={() => handleToggleDescription(item.code)}
                                                        className="toggle-desc less"
                                                    >
                                                        ver menos
                                                    </span>
                                                </>
                                            )
                                        }
                                    </div>
                                    {!isExpanded && (
                                        <div className="item-price">
                                            Precio: ${item.price}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="item-price expanded">
                                    Precio: ${item.price}
                                </div>
                            )}

                            <div className="quantity-controls">
                                <button
                                    onClick={() => updateQuantity(item.code, item.quantity - 1)}
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.code, item.quantity + 1)}
                                >
                                    +
                                </button>
                                <span
                                    onClick={() => removeFromCart(item.code)}
                                    className="remove-btn"
                                >
                                    Eliminar
                                </span>
                            </div>

                            <div className="item-subtotal">
                                Subtotal: ${item.price * item.quantity}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="cart-footer">
                <div className="cart-total">
                    Total: ${total}
                </div>

                {!token ? (
                    <button
                        className="checkout-btn"
                        disabled={cart.length === 0}
                        onClick={() => {
                            onClose();
                            navigate('/signin')
                        }}
                    >
                        Iniciar sesión para comprar productos
                    </button>
                ) : (
                    <button
                        className="checkout-btn"
                        disabled={cart.length === 0}
                        onClick={() => {
                            onClose();
                            navigate('/shopping-cart')
                        }}
                    >
                        Comprar productos
                    </button>
                )}
            </div>
        </div>
    );
}