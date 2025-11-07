import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HomeService } from "../services/home.service";
import { FiltrosCartelera } from "../components/FiltrosCartelera";
import { PeliculaCard } from "../components/PeliculaCard";
import { useUser } from "../context/usuario.context";
import type { IPeliculaConCartelera } from "../interfaces/home.interfaces";
import type { ISalas } from "../interfaces/salas.interfaces";
import "../styles/home.css";

const Home = () => {
    const [peliculasConCartelera, setPeliculasConCartelera] = useState<IPeliculaConCartelera[]>([]);
    const [salas, setSalas] = useState<ISalas[]>([]);
    const [salaFiltro, setSalaFiltro] = useState<string>("todas");
    const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todas");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user, loading: userLoading } = useUser();

    // Validación explícita del rol: admin = true, no-admin = false o undefined
    const isAdmin = user?.rol === true;

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const { peliculas, cartelera, salas } = await HomeService.cargarDatos();
            const combinadas = HomeService.combinarDatos(peliculas, cartelera, salas);
            setPeliculasConCartelera(combinadas);
            setSalas(salas);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReservar = (peliculaId: string, salaId: string, _horario: string) => {
        // Validación: solo usuarios no-admin pueden reservar
        if (isAdmin) {
            alert("Los administradores no pueden realizar reservas. Esta función está disponible solo para usuarios regulares.");
            return;
        }

        // Validación: debe haber un usuario autenticado
        if (!user) {
            alert("Debes iniciar sesión para realizar una reserva");
            navigate("/");
            return;
        }

        // Validación: debe haber una sala disponible
        if (!salaId) {
            alert("No hay salas disponibles para esta película");
            return;
        }

        // Guardar la película seleccionada para pre-seleccionarla en la página de reservar
        localStorage.setItem("peliculaReservaSeleccionada", peliculaId);
        
        // Redirigir a la página de reservar
        navigate("/reservar");
    };

    const peliculasFiltradas = HomeService.filtrarPeliculas(
        peliculasConCartelera,
        salaFiltro,
        categoriaFiltro
    );

    // Mostrar loading mientras se cargan los datos o el usuario
    if (loading || userLoading) {
        return (
            <div className="home-container">
                <div className="loading">Cargando cartelera...</div>
            </div>
        );
    }

    // Si no hay usuario, no debería llegar aquí (debería estar protegido por el navbar)
    // Pero por si acaso, verificamos
    if (!user) {
        return (
            <div className="home-container">
                <div className="loading">Cargando información del usuario...</div>
            </div>
        );
    }

    return (
        <div className="home-container">
            <header className="home-header">
                <h1 className="home-title">🎬 Cine ULEAM</h1>
                <p className="home-subtitle">Cartelera de Películas</p>
            </header>

            <FiltrosCartelera
                salas={salas}
                salaFiltro={salaFiltro}
                categoriaFiltro={categoriaFiltro}
                onSalaChange={setSalaFiltro}
                onCategoriaChange={setCategoriaFiltro}
            />

            <div className="cartelera-container">
                {peliculasFiltradas.length === 0 ? (
                    <div className="no-peliculas">
                        <p>No hay películas disponibles con los filtros seleccionados</p>
                    </div>
                ) : (
                    <div className="peliculas-grid">
                        {peliculasFiltradas.map((pelicula) => (
                            <PeliculaCard
                                key={pelicula.idPeliculas}
                                pelicula={pelicula}
                                onReservar={handleReservar}
                                isAdmin={isAdmin}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Mostrar botón de subir películas solo para administradores */}
            {isAdmin && (
                <div className="subir-peliculas-container">
                    <h1>Subir Peliculas</h1>
                    <button onClick={() => navigate("/subir-peliculas")}>Subir Pelicula</button>
                </div>
            )}
        </div>
    );
};

export default Home;