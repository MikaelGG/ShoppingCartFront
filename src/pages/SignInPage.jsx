import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../config/AxiosConfig";
import './css/SignInPage.css';
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const { setToken } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await API.post("/auth/signin", form);
            console.log(result);
            const token = result.data;
            setToken(token);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Successful Sign In",
                showConfirmButton: false,
                timer: 2000,
            }).then(() => navigate("/user-conf"));
        } catch (error) {
            if (error.response.status == 404 || error.response.status == 401) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Credenciales incorrectas",
                });
                console.log(error);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error de servidor, intente más tarde",
                });
                console.log(error);
            }
        }
    };

    return (
        <>
            <div
                className="login-container"
            >
                <h2 className="login-title">Iniciar sesión</h2>
                <form
                    onSubmit={handleSubmit}
                    className="login-form"
                >
                    <div>
                        <label>Email</label>
                        <input
                            name="email"
                            type="text"
                            placeholder="Email o número de teléfono"
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
                    <div className="login-actions">
                        <button type="submit" className="login-btn">
                            Ingresar
                        </button>
                    </div>
                </form>
                <p className="login-register">
                    ¿No tienes cuenta? <span className="sendres" onClick={() => navigate("/signup")}>Regístrate aquí</span>
                </p>
            </div>
        </>
    );
}
