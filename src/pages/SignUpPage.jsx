import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import API from '../config/AxiosConfig';

export default function RegisterPage() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        userType: 1
    });

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await API.post('/auth/signup', form).then(result => {
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
            <div style={{ marginTop: 120, display: 'flex', justifyContent: 'center' }}>
                <form onSubmit={handleSubmit} style={{
                    background: '#fff',
                    padding: 32,
                    borderRadius: 12,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    minWidth: 340,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 18
                }}>
                    <h2 style={{ textAlign: 'center' }}>Registrarse</h2>
                    <input
                        name="fullName"
                        type="text"
                        placeholder="Nombre completo"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        style={{ padding: 10, fontSize: 16, borderRadius: 6, border: '1px solid #ccc' }}
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Correo electrónico"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={{ padding: 10, fontSize: 16, borderRadius: 6, border: '1px solid #ccc' }}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Contraseña"
                        value={form.password}
                        onChange={handleChange}
                        required
                        style={{ padding: 10, fontSize: 16, borderRadius: 6, border: '1px solid #ccc' }}
                    />
                    <input
                        name="phoneNumber"
                        type="tel"
                        placeholder="Número de teléfono"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        required
                        style={{ padding: 10, fontSize: 16, borderRadius: 6, border: '1px solid #ccc' }}
                    />
                    <button type="submit" style={{
                        background: '#2a8',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '12px 0',
                        fontWeight: 'bold',
                        fontSize: 18,
                        cursor: 'pointer'
                    }}>
                        Registrarse
                    </button>
                </form>
            </div>
        </>
    );
}