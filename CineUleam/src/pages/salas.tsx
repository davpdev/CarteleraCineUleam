import { useEffect, useState } from "react";
import { SalaServices } from "../services/sala.service";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/usuario.context";
import "../styles/salas.css";

const SalasList = () => {
  const [salas, setSalas] = useState([]);
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
        alert("No tienes permisos para acceder a esta página. Solo los administradores pueden gestionar salas.");
        navigate("/home");
        return;
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user?.rol) {
      const fetchSalas = async () => {
        const data = await SalaServices.getAllSalas();
        if (data) setSalas(data);
      };
      fetchSalas();
    }
  }, [user]);

  // Mostrar nada mientras se carga o si no es admin
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
        {salas.map((sala: any) => (
          <div key={sala.idSalas} className="sala-card">
            <p><b>Sala:</b> {sala.idSalas}</p>
            <p><b>Asientos:</b> {sala.asientos}</p>
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
