import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import API from '../config/AxiosConfig';
import './css/SignUpPage.css';

export default function RegisterPage() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        repeatPassword: '',
        phoneNumber: '',
        userType: 1
    });

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        if (form.password !== form.repeatPassword) {
            Swal.fire({
                icon: "error",
                title: "Las contraseñas no coinciden",
                showConfirmButton: true
            });
            return;
        }
        try {
            await API.post('/auth/signup', {
                ...form,
                repeatPassword: undefined // No enviar repeatPassword al backend
            }).then(result => {
                console.log("Object saved succesfully", result);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "successful registration",
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => navigate('/signin'));
            })
        } catch (error) {
            console.error("Error saving object", error);
        }
    };

    return (
        <>
            <div className="register-container">
                <h2 className="register-title">Registrarse</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    <div>
                        <label>Nombre completo</label>
                        <input
                            name="fullName"
                            type="text"
                            placeholder="Nombre completo"
                            value={form.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Número de telefono</label>
                        <input
                            name="phoneNumber"
                            type="tel"
                            placeholder="Número de teléfono"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Correo electrónico"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Repetir Contraseña</label>
                        <input
                            name="repeatPassword"
                            type="password"
                            placeholder="Repetir Contraseña"
                            value={form.repeatPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="register-actions">
                        <button type="submit" className="register-btn">
                            Registrarse
                        </button>
                    </div>
                </form>
                <div className="register-login">
                    ¿Ya tienes cuenta? <span className="sendlog" onClick={() => navigate("/signin")}>Inicia sesión</span>
                </div>
            </div>
        </>
    );
}