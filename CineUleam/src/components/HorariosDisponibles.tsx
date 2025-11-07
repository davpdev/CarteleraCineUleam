import type { ICartelera } from "../interfaces/cartelera.interfaces";

interface HorariosDisponiblesProps {
    horarios: ICartelera[];
    onReservar: (horario: string) => void;
}

export const HorariosDisponibles = ({ horarios, onReservar }: HorariosDisponiblesProps) => {
    if (!horarios || horarios.length === 0) {
        return <p className="sin-horarios">No hay horarios disponibles</p>;
    }

    return (
        <div className="horarios-container">
            <h3>Horarios Disponibles:</h3>
            <div className="horarios-grid">
                {horarios.map((carteleraItem) => (
                    <button
                        key={carteleraItem.idCartelera}
                        className="horario-btn"
                        onClick={() => onReservar(carteleraItem.horarios)}
                    >
                        {carteleraItem.horarios}
                    </button>
                ))}
            </div>
        </div>
    );
};

