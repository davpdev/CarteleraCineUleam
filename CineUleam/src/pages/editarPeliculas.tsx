import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/usuario.context";

const EditarPeliculas: React.FC = () => {
    const navigate = useNavigate();
    const { user, loading } = useUser();

    // Protección de ruta: solo administradores pueden acceder
    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate("/");
                return;
            }
            if (!user.rol) {
                alert("No tienes permisos para acceder a esta página. Solo los administradores pueden editar películas.");
                navigate("/home");
                return;
            }
        }
    }, [user, loading, navigate]);

    // Mostrar nada mientras se carga o si no es admin
    if (loading || !user || !user.rol) {
        return (
            <div className="editar-container">
                <div>Cargando...</div>
            </div>
        );
    }

    return (
        <div className="editar-container">
            <h1>Editar Películas</h1>
            <button onClick={() => navigate("/home")}>Volver</button>
        </div>
    );
};

export default EditarPeliculas;