import type { IPeliculaConCartelera } from "../interfaces/home.interfaces";
import { HorariosDisponibles } from "./HorariosDisponibles";

interface PeliculaCardProps {
    pelicula: IPeliculaConCartelera;
    onReservar: (peliculaId: string, salaId: string, horario: string) => void;
    isAdmin?: boolean;
}

export const PeliculaCard = ({ pelicula, onReservar, isAdmin = false }: PeliculaCardProps) => {
    const handleReservarHorario = (horario: string) => {
        const salaId = pelicula.salaAsignada?.idSalas || "";
        onReservar(pelicula.idPeliculas, salaId, horario);
    };

    // Verificar si hay cartelera y horarios disponibles
    const tieneCartelera = pelicula.cartelera && pelicula.cartelera.length > 0;

    return (
        <div className="pelicula-card">
            <div className="pelicula-header">
                <h2 className="pelicula-titulo">{pelicula.nombrePelicula}</h2>
                <span className={`pelicula-categoria categoria-${pelicula.categoria}`}>
                    {pelicula.categoria}
                </span>
            </div>
            
            <div className="pelicula-info">
                <p className="pelicula-descripcion">{pelicula.descripcion}</p>
                <p className="pelicula-duracion">⏱️ Duración: {pelicula.duracion}</p>
                
                {pelicula.salaAsignada && (
                    <div className="pelicula-sala">
                        <p>🎭 Sala: {pelicula.salaAsignada.idSalas}</p>
                        <p>💺 Asientos disponibles: {pelicula.salaAsignada.asientos}</p>
                    </div>
                )}

                {tieneCartelera ? (
                    <>
                        {isAdmin ? (
                            <div className="horarios-container">
                                <h3>Horarios Disponibles:</h3>
                                <div className="horarios-grid">
                                    {pelicula.cartelera!.map((carteleraItem) => (
                                        <div
                                            key={carteleraItem.idCartelera}
                                            className="horario-btn"
                                            style={{
                                                opacity: 0.7,
                                                cursor: "not-allowed",
                                                backgroundColor: "#ccc"
                                            }}
                                        >
                                            {carteleraItem.horarios}
                                        </div>
                                    ))}
                                </div>
                                <p style={{ 
                                    color: "#666", 
                                    fontSize: "0.9rem", 
                                    marginTop: "0.5rem",
                                    fontStyle: "italic"
                                }}>
                                    Los administradores no pueden realizar reservas
                                </p>
                            </div>
                        ) : (
                            <HorariosDisponibles 
                                horarios={pelicula.cartelera!} 
                                onReservar={handleReservarHorario}
                            />
                        )}
                    </>
                ) : (
                    <div className="horarios-container">
                        <p className="sin-horarios">No hay horarios disponibles para esta película</p>
                    </div>
                )}
            </div>
        </div>
    );
};

