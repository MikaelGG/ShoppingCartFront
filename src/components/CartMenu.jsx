import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CartMenu({
    open,
    onClose,
    cart,
    onUpdateQuantity,
    onRemove,
    onClear
}) {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [expanded, setExpanded] = useState({});

    const [token, setToken] = useState(null);

    const scrollRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const tok = localStorage.getItem('token');
        setToken(tok);
    }, []);

    // Prevent page scroll when mouse is over the cart menu's scroll area
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleWheel = (e) => {
            const { scrollTop, scrollHeight, clientHeight } = el;
            const deltaY = e.deltaY;
            const atTop = scrollTop === 0;
            const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

            if (
                (deltaY < 0 && atTop) ||
                (deltaY > 0 && atBottom)
            ) {
                e.preventDefault();
            }
        };

        el.addEventListener('wheel', handleWheel, { passive: false });
        return () => el.removeEventListener('wheel', handleWheel);
    }, [open]);

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
        <div style={{
            position: 'fixed',
            top: 0,
            right: open ? 0 : '-40vw',
            width: '33vw',
            minWidth: 340,
            height: '100vh',
            background: '#fff',
            boxShadow: '-2px 0 16px rgba(0,0,0,0.15)',
            zIndex: 1000,
            transition: 'right 0.3s',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            boxSizing: 'border-box'
        }}>
            <button onClick={onClose} style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                border: 'none',
                fontSize: 28,
                cursor: 'pointer'
            }}>×</button>
            <h2 style={{ marginTop: 0, marginBottom: 24 }}>Carrito de compras</h2>
            <div
                ref={scrollRef}
                style={{ flex: 1, overflowY: 'auto', marginBottom: 24 }}
            >
                {cart.length === 0 && <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>El carrito está vacío.</div>}
                {cart.map(item => {
                    const isExpanded = expanded[item.code];
                    return (
                        <div key={item.code} style={{
                            border: '1px solid #eee',
                            borderRadius: 10,
                            marginBottom: 18,
                            padding: 16,
                            background: '#fafafa'
                        }}>
                            <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>{item.name}</div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: isExpanded ? 8 : 0 }}>
                                <img src={item.photo} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginRight: 12 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: '#666', fontSize: 15, marginBottom: 8, wordBreak: 'break-word' }}>
                                        {!isExpanded
                                            ? (
                                                <>
                                                    {getTruncatedDescription(item.description)}
                                                    {item.description.length > 60 && (
                                                        <span
                                                            onClick={() => handleToggleDescription(item.code)}
                                                            style={{ color: '#888', fontSize: 13, cursor: 'pointer', marginLeft: 4 }}
                                                        >
                                                            ...ver más
                                                        </span>
                                                    )}
                                                </>
                                            )
                                            : (
                                                <>
                                                    {item.description}
                                                    <span
                                                        onClick={() => handleToggleDescription(item.code)}
                                                        style={{ color: '#888', fontSize: 13, cursor: 'pointer', marginLeft: 8 }}
                                                    >
                                                        ver menos
                                                    </span>
                                                </>
                                            )
                                        }
                                    </div>
                                    {!isExpanded && (
                                        <div style={{ fontWeight: 'bold', color: '#2a8', fontSize: 17, marginBottom: 8 }}>
                                            Precio: ${item.price}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {isExpanded && (
                                <div style={{ fontWeight: 'bold', color: '#2a8', fontSize: 17, marginBottom: 8, marginLeft: 92 }}>
                                    Precio: ${item.price}
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                <button onClick={() => onUpdateQuantity(item.code, item.quantity - 1)} style={{ fontSize: 20, width: 32, height: 32 }}>-</button>
                                <span style={{ margin: '0 12px', fontSize: 18 }}>{item.quantity}</span>
                                <button onClick={() => onUpdateQuantity(item.code, item.quantity + 1)} style={{ fontSize: 20, width: 32, height: 32 }}>+</button>
                                <button onClick={() => onRemove(item.code)} style={{ marginLeft: 16, color: '#c00', background: 'none', border: 'none', cursor: 'pointer' }}>Eliminar</button>
                            </div>
                            <div style={{ fontWeight: 'bold', color: '#444', fontSize: 16 }}>
                                Subtotal: ${item.price * item.quantity}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div style={{
                borderTop: '1px solid #eee',
                paddingTop: 16,
                marginTop: 8,
                background: '#fff'
            }}>
                <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 12 }}>
                    Total: ${total}
                </div>
                {!token ? (
                <button
                    style={{
                        background: '#2a8',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '12px 0',
                        fontWeight: 'bold',
                        fontSize: 18,
                        width: '100%',
                        cursor: 'pointer'
                    }}
                    disabled={cart.length === 0}
                    onClick={() => navigate('/signin')}>
                    Iniciar sesión para comprar productos
                </button>
                ) : (
                    <button
                        style={{
                            background: '#2a8',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '12px 0',
                            fontWeight: 'bold',
                            fontSize: 18,
                            width: '100%',
                            cursor: 'pointer'
                        }}
                        disabled={cart.length === 0}
                        onClick={() => navigate('/shopping-cart')}>
                        Comprar productos
                    </button>
                )}
            </div>
        </div>
    );
}