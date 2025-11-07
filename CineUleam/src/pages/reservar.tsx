import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/reserva.css";
import { ReservaServices } from "../services/reserva.service";
import type { IReserva } from "../interfaces/reserva.interfaces";

const Reservar = () => {
  const navigate = useNavigate();

  const [reservaData, setReservaData] = useState<IReserva>({
    idReserva: "",
    peliculasID: "",
    usuarioId: "",
    salasID: "",
    reserva: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReservaData({ ...reservaData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const reserva = await ReservaServices.postReserva(reservaData);

    if (!reserva) {
      alert("No se pudo crear la reserva");
      return;
    }

    alert("Reserva creada con éxito ✅");
    navigate("/home");
  };

  return (
    <div className="reserva-container">
      <div className="reserva-card">
        <h2 className="reserva-titulo">Reservar Sala</h2>

        <form onSubmit={handleSubmit} className="reserva-form">
          <input
            type="text"
            name="idReserva"
            placeholder="ID de la Reserva"
            value={reservaData.idReserva}
            onChange={handleChange}
          />

          <input
            type="text"
            name="peliculasID"
            placeholder="ID de la Película"
            value={reservaData.peliculasID}
            onChange={handleChange}
          />

          <input
            type="text"
            name="usuarioId"
            placeholder="ID del Usuario"
            value={reservaData.usuarioId}
            onChange={handleChange}
          />

          <input
            type="text"
            name="salasID"
            placeholder="ID de la Sala"
            value={reservaData.salasID}
            onChange={handleChange}
          />

          <label className="checkbox-label">
            Confirmar reserva:
            <input
              type="checkbox"
              name="reserva"
              checked={reservaData.reserva}
              onChange={() =>
                setReservaData({ ...reservaData, reserva: !reservaData.reserva })
              }
            />
          </label>

          <button type="submit" className="btn-reservar">Confirmar Reserva</button>
        </form>

        <button className="btn-volver" onClick={() => navigate("/home")}>Volver</button>
      </div>
    </div>
  );
};

export default Reservar;
