import Swal from 'sweetalert2';
import API from '../config/AxiosConfig';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext';


export default function Header({ onCartClick }) {

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { token, setToken } = useAuth();
    const closeTimeout = useRef(null);
    const navigate = useNavigate();

    const { totalItems } = useCart();

    const handleMouseEnter = () => {
        if (closeTimeout.current) {
            clearTimeout(closeTimeout.current);
            closeTimeout.current = null;
        }
            setShowProfileMenu(true)
    };

    const handleMouseLeave = () => {
        closeTimeout.current = setTimeout(() => {
            setShowProfileMenu(false);
        }, 500); 
    };

    const logout = async () => {
        try {
            const result = await API.post('/auth/logout');
            setToken(null);
            delete API.defaults.headers.common['Authorization'];
            console.log(result);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Successful Logout",
                showConfirmButton: false,
                timer: 2000
            }).then(() => navigate('/signin'));
        } catch (error) {
            console.error("Error during logout", error);
        }
    };

    return (

        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 2rem',
            background: 'var(--color-surface)',
            borderBottom: 'var(--border-subtle)',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1000
        }}>
            {/* Logo on the left */}
            <div
                style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--color-text)', cursor: 'pointer' }}
                onClick={() => navigate('/')}
            >
                MyShop
            </div>
            {/* Spacer to push icons to the right */}
            <div style={{ flex: 1 }}></div>
            {/* Icons on the right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '50px', paddingRight: '100px', color: 'var(--color-text)' }}>
                {/* Shopping cart icon */}
                <div style={{ position: 'relative', fontSize: '1.8rem', cursor: 'pointer' }} onClick={onCartClick}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="7" cy="21" r="1" />
                        <circle cx="17" cy="21" r="1" />
                    </svg>
                    {totalItems > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: -6,
                            left: 18,
                            background: '#e74c3c',
                            color: '#fff',
                            borderRadius: '50%',
                            padding: '2px 7px',
                            fontSize: 13,
                            fontWeight: 'bold',
                            minWidth: 20,
                            textAlign: 'center',
                            lineHeight: '18px',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
                        }}>
                            {totalItems}
                        </span>
                    )}
                </div>
                {/* Perfil icon con menú desplegable */}
                <div
                    style={{ position: 'relative', fontSize: '1.8rem', height: '32px' }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ cursor: 'pointer' }}
                    >
                        <circle cx="12" cy="8" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {!token ? showProfileMenu && (
                        <div style={{
                            position: 'absolute',
                            top: '36px',
                            right: 0,
                            background: 'var(--color-surface-2)',
                            border: 'var(--border-subtle)',
                            borderRadius: '8px',
                            boxShadow: 'var(--shadow-lg)',
                            padding: '18px 24px',
                            minWidth: '220px',
                            zIndex: 2000,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch'
                        }}>
                            <button style={{
                                background: 'var(--color-accent)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '10px',
                                fontWeight: 'bold',
                                marginBottom: '12px',
                                cursor: 'pointer'
                            }} onClick={() => navigate('/signin')}>
                                Iniciar sesión
                            </button>
                            <div style={{ fontSize: '15px', color: 'var(--color-text-muted)', marginBottom: '8px', textAlign: 'center' }}>
                                ¿No te has registrado?
                            </div>
                            <button style={{
                                background: 'transparent',
                                color: 'var(--color-accent)',
                                border: '1px solid var(--color-accent)',
                                borderRadius: '5px',
                                padding: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }} onClick={() => navigate('/signup')} >
                                Registrarse
                            </button>
                        </div>
                    ) : showProfileMenu && (

                        <div style={{
                            position: 'absolute',
                            top: '36px',
                            right: 0,
                            background: 'var(--color-surface-2)',
                            border: 'var(--border-subtle)',
                            borderRadius: '8px',
                            boxShadow: 'var(--shadow-lg)',
                            padding: '18px 24px',
                            minWidth: '220px',
                            zIndex: 2000,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch'
                        }}>
                            <button style={{
                                background: 'transparent',
                                color: 'var(--color-accent)',
                                border: '1px solid var(--color-accent)',
                                borderRadius: '5px',
                                padding: '8px',
                                fontWeight: 'bold',
                                marginBottom: '12px',
                                cursor: 'pointer'
                            }} onClick={() => navigate('/user-conf')} >
                                Configuración del prefil
                            </button>
                            <button style={{
                                background: 'var(--color-accent)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '10px',
                                fontWeight: 'bold',
                                marginBottom: '12px',
                                cursor: 'pointer'
                            }} onClick={() => navigate('/shopping-cart')}>
                                Carrito de compras
                            </button>
                            <button style={{
                                background: 'transparent',
                                color: 'var(--color-accent)',
                                border: '1px solid var(--color-accent)',
                                borderRadius: '5px',
                                padding: '8px',
                                fontWeight: 'bold',
                                marginBottom: '12px',
                                cursor: 'pointer'
                            }} onClick={() => navigate('/shipping-addresses')} >
                                Direcciones de envío
                            </button>
                            <button onClick={logout} style={{
                                backgroundColor: 'var(--color-danger)',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.25)',
                                borderRadius: '5px',
                                padding: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}>
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}