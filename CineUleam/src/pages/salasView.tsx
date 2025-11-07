import { useEffect, useState } from "react";
import { SalaServices } from "../services/sala.service";
import { useParams } from "react-router-dom";
import "../styles/asientos.css";

const SalasView = () => {
  const { idSalas } = useParams();
  const [sala, setSala] = useState<any>(null);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState<number[]>([]);

  useEffect(() => {
    const fetchSala = async () => {
      const data = await SalaServices.getByIdSalas(idSalas!);
      setSala(data);
    };
    fetchSala();
  }, []);

  if (!sala) return <p>Cargando...</p>;

  const totalAsientos = sala.asientos;
  const columnas = 8;
  const toggleAsiento = (index: number) => {
    setAsientosSeleccionados((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="asientos-container">
      <h2>Sala {idSalas} 🎞️</h2>

      <div className="asientos-grid" style={{ gridTemplateColumns: `repeat(${columnas}, 1fr)` }}>
        {Array.from({ length: totalAsientos }).map((_, index) => (
          <div
            key={index}
            className={`asiento ${asientosSeleccionados.includes(index) ? "seleccionado" : ""}`}
            onClick={() => toggleAsiento(index)}
          >
            {index + 1}
          </div>
        ))}
      </div>

      <button className="confirmar">Confirmar selección</button>
    </div>
  );
};

export default SalasView;
