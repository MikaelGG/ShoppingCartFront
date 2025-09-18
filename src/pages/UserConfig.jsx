import API from '../config/AxiosConfig';
import './css/UserConfig.css';
import { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';

export default function UserConfig() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const tokdecoded = jwtDecode(token);
            console.log(tokdecoded);
            const response = await API.get('/api/users/email' + '?email=' + tokdecoded.sub);
            console.log(response);
            setUserData(response.data);
        } catch (error) {
            console.error("Error fetching user data", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateUserData = async () => {
        try {

        } catch (error) {

        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    if (loading) return <div style={{ padding: '2rem', marginTop: '4rem' }}>Cargando...</div>;
    if (error) return <div style={{ padding: '2rem', marginTop: '4rem' }}>Error: {error}</div>;

    return (
        <>
            <div className="user-config-container">
                <h2 className="user-config-title">Datos del usuario</h2>
                <form onSubmit={updateUserData} className="user-config-form">

                    <div className="user-config-field">
                        <label >
                            Nombre completo
                        </label>
                        <input
                            name="fullName"
                            type="text"
                            placeholder="Nombre completo"
                            value={userData.fullName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="user-config-field">
                        <label>
                            Correo electrónico
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Correo electrónico"
                            value={userData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="user-config-field">
                        <label >
                            Contraseña
                        </label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Contraseña"
                            value={userData.password || ''} // Prevenir undefined
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="user-config-field">
                        <label>
                            Número de teléfono
                        </label>
                        <input
                            name="phoneNumber"
                            type="tel"
                            placeholder="Número de teléfono"
                            value={userData.phoneNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <button type="submit" className="user-config-save">
                        Actualizar Datos
                    </button>
                </form>
            </div>
        </>
    );
}