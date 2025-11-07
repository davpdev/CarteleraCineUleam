import { useEffect, useState } from "react";
import { SalaServices } from "../services/sala.service";
import { useNavigate } from "react-router-dom";
import "../styles/salas.css";

const SalasList = () => {
  const [salas, setSalas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalas = async () => {
      const data = await SalaServices.getAllSalas();
      if (data) setSalas(data);
    };
    fetchSalas();
  }, []);

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
