import { useEffect, useState } from "react";
import { SalaServices } from "../services/sala.service";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/usuario.context";
import "../styles/asientos.css";

const SalasView = () => {
  const { idSalas } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const [sala, setSala] = useState<any>(null);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState<number[]>([]);

  // Protección de ruta: solo administradores pueden acceder
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/");
        return;
      }
      if (!user.rol) {
        alert("No tienes permisos para acceder a esta página. Solo los administradores pueden gestionar salas.");
        navigate("/home");
        return;
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user?.rol && idSalas) {
      const fetchSala = async () => {
        const data = await SalaServices.getByIdSalas(idSalas);
        setSala(data);
      };
      fetchSala();
    }
  }, [user, idSalas]);

  // Mostrar nada mientras se carga o si no es admin
  if (loading || !user || !user.rol) {
    return (
      <div className="asientos-container">
        <div>Cargando...</div>
      </div>
    );
  }

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
