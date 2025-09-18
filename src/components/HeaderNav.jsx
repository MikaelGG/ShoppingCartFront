import Swal from 'sweetalert2';
import API from '../config/AxiosConfig';
import './css/HeaderNav.css'
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';


export default function Header({ onCartClick }) {

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [tokdec, setTokdec] = useState(null);
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

    useEffect(() => {
        if (typeof token === "string" && token.trim() !== "") {
            try {
                const tokdec = jwtDecode(token);
                setTokdec(tokdec.userType);
            } catch (e) {
                setTokdec(null);
            }
        } else {
            setTokdec(null);
        }
    }, [token]);

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
        <header className="header">
            {/* Logo on the left */}
            <div className="header-logo" onClick={() => navigate('/')}>
                MyShop
            </div>
            
            {/* Spacer to push icons to the right */}
            <div className="header-spacer"></div>
            
            {/* Icons on the right */}
            <div className="header-icons">
                {/* Shopping cart icon */}
                <div className="cart-icon-container" onClick={onCartClick}>
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
                        <span className="cart-badge">
                            {totalItems}
                        </span>
                    )}
                </div>
                
                {/* Perfil icon con menú desplegable */}
                <div
                    className="profile-icon-container"
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
                        className="profile-icon"
                    >
                        <circle cx="12" cy="8" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    
                    {!token ? showProfileMenu && (
                        <div className="profile-menu">
                            <button 
                                className="menu-btn-primary"
                                onClick={() => navigate('/signin')}
                            >
                                Iniciar sesión
                            </button>
                            <div className="menu-text">
                                ¿No te has registrado?
                            </div>
                            <button 
                                className="menu-btn-secondary"
                                onClick={() => navigate('/signup')}
                            >
                                Registrarse
                            </button>
                        </div>
                    ) : tokdec == "Client" ? showProfileMenu && (
                        <div className="profile-menu">
                            <button 
                                className="menu-btn-primary"
                                onClick={() => navigate('/user-conf')}
                            >
                                Configuración del prefil
                            </button>
                            <button 
                                className="menu-btn-secondary"
                                onClick={() => navigate('/shopping-cart')}
                            >
                                Carrito de compras
                            </button>
                            <button 
                                className="menu-btn-primary"
                                onClick={() => navigate('/purchase-records')}
                            >
                                Registro de compras
                            </button>
                            <button 
                                className="menu-btn-secondary"
                                onClick={() => navigate('/shipping-addresses')}
                            >
                                Direcciones de envío
                            </button>
                            <button onClick={logout} className="menu-btn-danger">
                                Cerrar sesión
                            </button>
                        </div>
                    ) : tokdec == "Administrator" ? showProfileMenu && (
                        <div className="profile-menu">
                            <button 
                                className="menu-btn-primary"
                                onClick={() => navigate('/user-conf')}
                            >
                                Configuración del prefil
                            </button>
                            <button 
                                className="menu-btn-secondary"
                                onClick={() => navigate('/purchase-records')}
                            >
                                Registro de compras
                            </button>
                            <button 
                                className="menu-btn-primary"
                                onClick={() => navigate('/administrators')}
                            >
                                Administradores
                            </button>
                            <button 
                                className="menu-btn-secondary"
                                onClick={() => navigate('/manage-products')}
                            >
                                Productos
                            </button>
                            <button onClick={logout} className="menu-btn-danger">
                                Cerrar sesión
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    );
}