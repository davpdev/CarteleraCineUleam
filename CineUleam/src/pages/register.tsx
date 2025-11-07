import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css"
import React from "react";
import { authService } from "../services/auth.service";
import { Eye, EyeClosed } from "lucide-react";


const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [errorName, setErrorName] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [passwordTooShort, setPasswordTooShort] = useState(false);
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (evento: React.FormEvent) => {
        evento.preventDefault();
        
        setErrorName(false);
        setErrorEmail(false);
        setErrorPassword(false);
        setErrorConfirmPassword(false);
        setPasswordMismatch(false);
        setPasswordTooShort(false);

        console.log("Name:", name);
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Confirm Password:", confirmPassword);

        let error = false;

        if (name === "") {
            setErrorName(true);
            error = true;
        }
        
        if (email === "") {
            setErrorEmail(true);
            error = true;
        }
        
        if (password === "") {
            setErrorPassword(true);
            error = true;
        }
        
        if (confirmPassword === "") {
            setErrorConfirmPassword(true);
            error = true;
        }

        if (password && password.length < 6) {
            setPasswordTooShort(true);
            error = true;
        }

        if (password && confirmPassword && password !== confirmPassword) {
            setPasswordMismatch(true);
            error = true;
        }

        if (error) return;

        const result = await authService.singUp(email, password);
        
        if (!result) {
            alert('Error al registrar usuario');
            return;
        }
        
        alert('Usuario registrado correctamente \n revisa tu correo para confirmar la cuenta');
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <img src="/logoUleam.png" alt="Logo ULEAM" className="logo-uleam" />
                    <h2 className="register-nombre">Cine ULEAM</h2>
                </div>
                <h1>Registro de Usuario</h1>
                <form onSubmit={handleSubmit}>
                    <div className="register-form-group">
                        <label>Nombre Completo:</label>
                        <input
                            type="text"
                            placeholder="Ingrese su nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={errorName ? 'register-input-error' : ''}
                        />
                        {errorName && <p className="register-error-message">El nombre es requerido</p>}
                    </div>

                    <div className="register-form-group">
                        <label>Correo Electrónico:</label>
                        <input
                            type="email"
                            placeholder="Ingrese su email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={errorEmail ? 'register-input-error' : ''}
                        />
                        {errorEmail && <p className="register-error-message">El email es requerido</p>}
                    </div>

                    <div className="register-form-group">
                        <label>Contraseña:</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Ingrese su contraseña (mínimo 6 caracteres)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={errorPassword || passwordTooShort || passwordMismatch ? 'register-input-error' : ''}
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? <Eye/> : <EyeClosed/>}
                            </button>
                        </div>
                        {errorPassword && <p className="register-error-message">La contraseña es requerida</p>}
                        {passwordTooShort && <p className="register-error-message">La contraseña debe tener al menos 6 caracteres</p>}
                    </div>

                    <div className="register-form-group">
                        <label>Confirmar Contraseña:</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirme su contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={errorConfirmPassword || passwordMismatch ? 'register-input-error' : ''}
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showConfirmPassword ? <Eye/> : <EyeClosed/>}
                            </button>
                        </div>
                        {errorConfirmPassword && <p className="register-error-message">Debe confirmar la contraseña</p>}
                        {passwordMismatch && <p className="register-error-message">Las contraseñas no coinciden</p>}
                    </div>

                    <button type="submit">Registrarse</button>
                </form>

                <div className="register-login-link">
                    <p>¿Ya tienes una cuenta?</p>
                    <button type="button" className="register-btn-login" onClick={() => navigate("/")}>
                        Iniciar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;