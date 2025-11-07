import { useEffect, useState } from "react";
import { SalaServices } from "../services/sala.service";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/usuario.context";
import { ISalas } from "../interfaces/salas.interfaces";
import "../styles/salas.css";

const SalasList = () => {
  const [salas, setSalas] = useState<ISalas[]>([]);
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
        alert(
          "No tienes permisos para acceder a esta página. Solo los administradores pueden gestionar salas."
        );
        navigate("/home");
        return;
      }
    }
  }, [user, loading, navigate]);

  // Cargar salas solo si el usuario es admin
  useEffect(() => {
    if (user?.rol) {
      const fetchSalas = async () => {
        const data = await SalaServices.getAllSalas();
        if (data) setSalas(data);
      };
      fetchSalas();
    }
  }, [user]);

  // Mostrar mensaje de carga mientras se valida el usuario
  if (loading || !user || !user.rol) {
    return (
      <div className="salas-container">
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <div className="salas-container">
      <h2>Salas Disponibles 🎬</h2>
      <div className="salas-grid">
        {salas.map((sala) => (
          <div key={sala.idSalas} className="sala-card">
            <p>
              <b>Sala:</b> {sala.nombre_sala}
            </p>
            <p>
              <b>Asientos:</b> {sala.asientos}
            </p>
            <p>
              <b>Disponibilidad:</b> {sala.disponibleAsiento ? "Sí" : "No"}
            </p>
            <button onClick={() => navigate(`/salas/${sala.idSalas}`)}>
              Ver asientos
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalasList;
