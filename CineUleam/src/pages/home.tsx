import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/supabase.config";
import { ReservaServices } from "../services/reserva.service";
import { HomeService } from "../services/home.service";
import { FiltrosCartelera } from "../components/FiltrosCartelera";
import { PeliculaCard } from "../components/PeliculaCard";
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

    const handleReservar = async (peliculaId: string, salaId: string, horario: string) => {
        if (!salaId) {
            alert("No hay salas disponibles para esta película");
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                alert("Por favor, inicia sesión para reservar");
                navigate("/");
                return;
            }

            const reserva = {
                idReserva: crypto.randomUUID(),
                peliculasID: peliculaId,
                usuarioId: user.id,
                salasID: salaId,
                reserva: true
            };

            const resultado = await ReservaServices.postReserva(reserva);
            if (resultado) {
                alert(`Reserva exitosa para ${horario}`);
                navigate("/reservar");
            } else {
                alert("Error al realizar la reserva");
            }
        } catch (error) {
            console.error("Error al realizar reserva:", error);
            alert("Error al realizar la reserva");
        }
    };

    const peliculasFiltradas = HomeService.filtrarPeliculas(
        peliculasConCartelera,
        salaFiltro,
        categoriaFiltro
    );

    if (loading) {
        return (
            <div className="home-container">
                <div className="loading">Cargando cartelera...</div>
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
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="subir-peliculas-container">
                    <h1>Subir Peliculas</h1>
                    <button onClick={() => navigate("/subir-peliculas")}>Subir Pelicula</button>
                </div>
        </div>
    );
};

// export default Home;