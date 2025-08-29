import API from '../config/AxiosConfig';
import { useState, useEffect, use } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function UserConfig() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null); // null inicialmente
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await API.get('/api/users/14');
            console.log(response);
            setUserData(response.data);
        } catch (error) {
            console.error("Error fetching user data", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

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

    // Ejecutar fetchUserData cuando el componente se monta
    useEffect(() => {
        fetchUserData();
    }, []);

    if (loading) return <div style={{ padding: '2rem', marginTop: '4rem' }}>Cargando...</div>;
    if (error) return <div style={{ padding: '2rem', marginTop: '4rem' }}>Error: {error}</div>;

    return (
        <>
            <button onClick={logout} style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
            }}>Log out</button>
            <div style={{ marginTop: 120, display: 'flex', justifyContent: 'center' }}>
                <form style={{
                    background: '#fff',
                    padding: 32,
                    borderRadius: 12,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    minWidth: 700,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 18
                }}>
                    <h2 style={{ textAlign: 'center' }}>Datos del usuario</h2>
                    
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '50px'
                    }}>
                        <label style={{ 
                            fontSize: '25px', 
                            width: '33.33%', // 1/3 del ancho
                            textAlign: 'left'
                        }}>
                            Nombre completo
                        </label>
                        <input
                            name="fullName"
                            type="text"
                            placeholder="Nombre completo"
                            value={userData.fullName}
                            // onChange={handleChange}
                            required
                            style={{ 
                                padding: 10, 
                                fontSize: 16, 
                                borderRadius: 6, 
                                border: '1px solid #ccc',
                                width: '66.67%'
                            }}
                        />
                    </div>
                    
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '50px'
                    }}>
                        <label style={{ 
                            fontSize: '25px', 
                            width: '33.33%', // 1/3 del ancho
                            textAlign: 'left'
                        }}>
                            Correo electrónico
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Correo electrónico"
                            value={userData.email}
                            // onChange={handleChange}
                            required
                            style={{ 
                                padding: 10, 
                                fontSize: 16, 
                                borderRadius: 6, 
                                border: '1px solid #ccc',
                                width: '66.67%'
                            }}
                        />
                    </div>
                    
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '50px'
                    }}>
                        <label style={{ 
                            fontSize: '25px', 
                            width: '33.33%', // 1/3 del ancho
                            textAlign: 'left'
                        }}>
                            Contraseña
                        </label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Contraseña"
                            value={userData.password || ''} // Prevenir undefined
                            // onChange={handleChange}
                            required
                            style={{ 
                                padding: 10, 
                                fontSize: 16, 
                                borderRadius: 6, 
                                border: '1px solid #ccc',
                                width: '66.67%'
                            }}
                        />
                    </div>
                    
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '50px'
                    }}>
                        <label style={{ 
                            fontSize: '25px', 
                            width: '33.33%', // 1/3 del ancho
                            textAlign: 'left'
                        }}>
                            Número de teléfono
                        </label>
                        <input
                            name="phoneNumber"
                            type="tel"
                            placeholder="Número de teléfono"
                            value={userData.phoneNumber}
                            // onChange={handleChange}
                            required
                            style={{ 
                                padding: 10, 
                                fontSize: 16, 
                                borderRadius: 6, 
                                border: '1px solid #ccc',
                                width: '66.67%'
                            }}
                        />
                    </div>
                    
                    <button type="submit" style={{
                        background: '#2a8',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '12px 0',
                        fontWeight: 'bold',
                        fontSize: 18,
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}>
                        Actualizar Datos
                    </button>
                </form>
            </div>
        </>
    );
}