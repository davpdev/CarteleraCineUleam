import { useState } from "react";
// import { supabase } from "../api/supabase.config";
// import { authService } from "../services/auth.service";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (evento: React.FormEvent) =>{
        evento.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);
    };
return (
    <div>
        <form onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>

        <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />

        <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />

        <button type="submit">
            Entrar
        </button>
        </form>
    </div>
    );
}

export default Login;

