import Header from '../components/HeaderNav';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import API from '../config/AxiosConfig';

export default function LoginPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', password: '' });

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const result = await API.post('/auth/signin', form);
            console.log(result);
            const token = result.data;
            localStorage.setItem('token', token);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Successful Sign In",
                showConfirmButton: false,
                timer: 2000
            }).then(() => navigate('/user-conf'));
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error", 
                text: "Credenciales incorrectas"
            });
        }
    };

    return (
        <>
            <Header />
            <div style={{ marginTop: 120, display: 'flex', justifyContent: 'center' }}>
                <form onSubmit={handleSubmit} style={{
                    background: '#fff',
                    padding: 32,
                    borderRadius: 12,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    minWidth: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 18
                }}>
                    <h2 style={{ textAlign: 'center' }}>Iniciar sesión</h2>
                    <input
                        name="email"
                        type="text"
                        placeholder="Email o número de teléfono"
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
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </>
    );
}