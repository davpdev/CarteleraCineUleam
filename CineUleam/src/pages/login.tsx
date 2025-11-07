import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"
import { authService } from "../services/auth.service";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (evento: React.FormEvent) =>{
        evento.preventDefault();

        setErrorEmail(false);
        setErrorPassword(false);


        console.log("Email:", email);
        console.log("Password:", password);

        let error = false;

        if (email === "") {
            setErrorEmail(true);
            error = true;
        }

        if (password === "") {
            setErrorPassword(true);
            error = true;
        }

        if (error) return;

        const result = await authService.singIn(email, password)

        if (!result){
            alert('Error al iniciar sesion');
            return;
        }

        console.log("Login exitoso:", { email, password });
        navigate("/home");
        

    };
return (
    <div className = "login-container">
        <div className = "login-card">
            <div className = "sistema-header">
                <h2 className = "sistema-nombre">Cine ULEAM</h2>
            </div>

            <h1>Iniciar Sesión</h1>

            <form onSubmit = {handleSubmit}>
                <div className = "form-group">
                    <label>Usuario:</label>
                    <input
                    type = "email"
                    placeholder = "Ingrese su email"
                    value = {email}
                    onChange = {(e) => setEmail(e.target.value)}
                    />
                    {errorEmail && <p className = "error-message">El email es requerido</p>}
                </div>

                <div className = "form-group">
                    <label>Contraseña:</label>
                    <input
                    type = "password"
                    placeholder = "Ingrese su contraseña"
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}
                    />
                    {errorPassword && <p className = "error-message">La contraseña es requerida</p>}
                </div>

                <button type = "submit">Iniciar Sesión</button>
                <button type= "submit" onClick={authService.singInGoogle}>google</button>
            </form>
            <div className="registro-link">
                <p>¿No tienes una cuenta?</p>
                <button
                type="button"
                className="btn-registro"
                onClick = {() => navigate("/register")}>Registrarse</button>
            </div>
        </div>
    </div>
    );
}

export default Login;