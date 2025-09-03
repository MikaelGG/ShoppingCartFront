import Swal from 'sweetalert2';
import API from '../config/AxiosConfig';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


export default function Header({ onCartClick, cartCount }) {

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [token, setToken] = useState(null);
    const closeTimeout = useRef(null);
    const navigate = useNavigate();

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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const tokdecoded = jwtDecode(token);
                const tokiat = tokdecoded.iat;
                const tokexp = tokdecoded.exp;

                const currentTime = Math.floor(Date.now() / 1000);
                const timeRemaining = tokexp - currentTime;

                currentTime >= tokexp ? localStorage.removeItem('token') && console.log('Token expirado') : console.log('Token válido,' + ` expira en ${timeRemaining} segundos`);
            } catch (error) {
                console.error('Error decodificando token:', error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    useEffect(() => {
        const tok = localStorage.getItem('token');
        setToken(tok);
    }, []);

    const logout = async () => {
        try {
            const result = await API.post('/auth/logout');
            localStorage.removeItem('token');
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
            background: '#f8f8f8',
            borderBottom: '1px solid #ddd',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1000
        }}>
            {/* Logo on the left */}
            <div
                style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#333', cursor: 'pointer' }}
                onClick={() => navigate('/')}
            >
                MyShop
            </div>
            {/* Spacer to push icons to the right */}
            <div style={{ flex: 1 }}></div>
            {/* Icons on the right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '50px', paddingRight: '100px' }}>
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
                    {cartCount > 0 && (
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
                            {cartCount}
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
                            background: '#fff',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                            padding: '18px 24px',
                            minWidth: '220px',
                            zIndex: 2000,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch'
                        }}>
                            <button style={{
                                background: '#2a8',
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
                            <div style={{ fontSize: '15px', color: '#444', marginBottom: '8px', textAlign: 'center' }}>
                                ¿No te has registrado?
                            </div>
                            <button style={{
                                background: '#fff',
                                color: '#2a8',
                                border: '1px solid #2a8',
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
                            background: '#fff',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                            padding: '18px 24px',
                            minWidth: '220px',
                            zIndex: 2000,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch'
                        }}>
                            <button style={{
                                background: '#2a8',
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
                                background: '#fff',
                                color: '#2a8',
                                border: '1px solid #2a8',
                                borderRadius: '5px',
                                padding: '8px',
                                fontWeight: 'bold',
                                marginBottom: '12px',
                                cursor: 'pointer'
                            }} onClick={() => navigate('/user-conf')} >
                                Configuracion del prefil
                            </button>
                            <button onClick={logout} style={{
                                backgroundColor: '#dc3545',
                                color: '#fff',
                                border: '1px solid #ffffff8e',
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
