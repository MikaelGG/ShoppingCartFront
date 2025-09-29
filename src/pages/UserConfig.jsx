import API from '../config/AxiosConfig';
import Swal from 'sweetalert2';
import './css/UserConfig.css';
import { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';

export default function UserConfig() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [userPassword, setUserPassword] = useState({ currentPassword: '', newPassword: '', repeatNewPassword: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token, setToken } = useAuth();

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const tokdecoded = jwtDecode(token);
            console.log(tokdecoded);
            const response = await API.get(`/api/users/${tokdecoded.id}`);
            console.log("User config:", response);
            setUserData(response.data);
        } catch (error) {
            console.error("Error fetching user data", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateUserData = async e => {
        e.preventDefault();
        if (userPassword.newPassword !== userPassword.repeatNewPassword) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Contraseñas no coinciden",
                showConfirmButton: false,
                timer: 3000,
            });
            return;
        }
        try {
            const updateData = {
                ...userData,
                currentPassword: userPassword.currentPassword,
                newPassword: userPassword.newPassword,
                repeatNewPassword: userPassword.repeatNewPassword
            };
            console.log("User data:", updateData);
            const resp = await API.put(`/api/users/${userData.id}`, updateData);
            setToken(resp.data.newToken);
            console.log(resp);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Información actualizada con exito",
                showConfirmButton: false,
                timer: 3500,
            }).then(() => {
                setUserPassword({ currentPassword: '', newPassword: '', repeatNewPassword: '' });
                navigate(0);
            });
        } catch (error) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: error.response?.data?.message || 'Ocurrió un error',
                showConfirmButton: false,
                timer: 3000,
            });
            console.log(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInputChangePassword = (e) => {
        const { name, value } = e.target;
        setUserPassword(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    if (loading) return <div className="loading">Cargando...</div>;
    if (error) return <div className="error">Error: {error}</div>;

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

                    <div className="user-config-field">
                        <label >
                            Contraseña
                        </label>
                        <input
                            name="currentPassword"
                            type="password"
                            placeholder="Contraseña actual"
                            value={userPassword.currentPassword}
                            onChange={handleInputChangePassword}
                        />
                    </div>

                    {userPassword.currentPassword || (userPassword.newPassword || userPassword.repeatNewPassword) ? (
                        <>
                            <div className="user-config-field">
                                <label >
                                    Nueva Contraseña
                                </label>
                                <input
                                    name="newPassword"
                                    type="Password"
                                    placeholder="Nueva contraseña"
                                    value={userPassword.newPassword}
                                    onChange={handleInputChangePassword}
                                />
                            </div>
                            <div className="user-config-field">
                                <label >
                                    Repetir Nueva Contraseña
                                </label>
                                <input
                                    name="repeatNewPassword"
                                    type="password"
                                    placeholder="Repetir nueva contraseña"
                                    value={userPassword.repeatNewPassword}
                                    onChange={handleInputChangePassword}
                                />
                            </div>
                        </>
                    ) : null}

                    <button type="submit" className="user-config-save">
                        Actualizar Datos
                    </button>
                </form>
            </div>
        </>
    );
}