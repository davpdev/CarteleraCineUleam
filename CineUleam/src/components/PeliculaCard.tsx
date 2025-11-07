import type { IPeliculaConCartelera } from "../interfaces/home.interfaces";
import { HorariosDisponibles } from "./HorariosDisponibles";
import React from "react";

interface PeliculaCardProps {
    pelicula: IPeliculaConCartelera;
    onReservar: (peliculaId: string, salaId: string, horario: string) => void;
}

export const PeliculaCard = ({ pelicula, onReservar }: PeliculaCardProps) => {
    const handleReservarHorario = (horario: string) => {
        const salaId = pelicula.salaAsignada?.idSalas || "";
        onReservar(pelicula.idPeliculas, salaId, horario);
    };

    return (
        <div className="pelicula-card">
            {pelicula.urlImagen && (
                <div className="pelicula-imagen-container">
                    <img 
                        src={pelicula.urlImagen} 
                        alt={pelicula.nombrePelicula}
                        className="pelicula-imagen"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
            )}
            
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

                {pelicula.cartelera && (
                    <HorariosDisponibles 
                        horarios={pelicula.cartelera} 
                        onReservar={handleReservarHorario}
                    />
                )}
            </div>
        </div>
    );
};

