import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/usuario.context";
import { HomeService } from "../services/home.service";
import { ReservaServices } from "../services/reserva.service";
import type { IPeliculaConCartelera } from "../interfaces/home.interfaces";
import type { IReserva } from "../interfaces/reserva.interfaces";
import "../styles/reserva.css";

const Reservar = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const [peliculasConCartelera, setPeliculasConCartelera] = useState<IPeliculaConCartelera[]>([]);
  const [loadingPeliculas, setLoadingPeliculas] = useState(true);
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState<IPeliculaConCartelera | null>(null);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState<string>("");
  const [errorMensaje, setErrorMensaje] = useState("");
  const [successMensaje, setSuccessMensaje] = useState("");

  // Protección de ruta: solo usuarios no-admin pueden reservar
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/");
        return;
      }
      if (user.rol) {
        alert("Los administradores no pueden realizar reservas. Esta función está disponible solo para usuarios regulares.");
        navigate("/home");
        return;
      }
    }
  }, [user, loading, navigate]);

  // Cargar películas con sus carteleras y salas
  useEffect(() => {
    const cargarDatos = async () => {
      if (user && !user.rol) {
        setLoadingPeliculas(true);
        try {
          const { peliculas, cartelera, salas } = await HomeService.cargarDatos();
          const combinadas = HomeService.combinarDatos(peliculas, cartelera, salas);
          // Filtrar solo películas que tengan cartelera y sala asignada
          const peliculasDisponibles = combinadas.filter(
            (p) => p.cartelera && p.cartelera.length > 0 && p.salaAsignada
          );
          setPeliculasConCartelera(peliculasDisponibles);

          // Pre-seleccionar la película si viene de home
          const peliculaIdGuardada = localStorage.getItem("peliculaReservaSeleccionada");
          if (peliculaIdGuardada) {
            const peliculaPreSeleccionada = peliculasDisponibles.find(
              (p) => p.idPeliculas === peliculaIdGuardada
            );
            if (peliculaPreSeleccionada) {
              setPeliculaSeleccionada(peliculaPreSeleccionada);
            }
            // Limpiar el localStorage después de usar
            localStorage.removeItem("peliculaReservaSeleccionada");
          }
        } catch (error) {
          console.error("Error al cargar datos:", error);
          setErrorMensaje("Error al cargar las películas disponibles");
        } finally {
          setLoadingPeliculas(false);
        }
      }
    };

    if (!loading && user && !user.rol) {
      cargarDatos();
    }
  }, [user, loading]);

  // Cuando se selecciona una película, resetear el horario
  const handlePeliculaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const peliculaId = e.target.value;
    const pelicula = peliculasConCartelera.find((p) => p.idPeliculas === peliculaId);
    setPeliculaSeleccionada(pelicula || null);
    setHorarioSeleccionado("");
    setErrorMensaje("");
    setSuccessMensaje("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMensaje("");
    setSuccessMensaje("");

    if (!user || !user.id) {
      setErrorMensaje("Error: No se pudo obtener la información del usuario");
      return;
    }

    if (!peliculaSeleccionada) {
      setErrorMensaje("Por favor, selecciona una película");
      return;
    }

    if (!peliculaSeleccionada.salaAsignada) {
      setErrorMensaje("La película seleccionada no tiene una sala asignada");
      return;
    }

    if (!horarioSeleccionado) {
      setErrorMensaje("Por favor, selecciona un horario");
      return;
    }

    try {
      // Crear el objeto de reserva con los campos correctos
      const reserva = {
        idReserva: crypto.randomUUID(),
        peliculasID: peliculaSeleccionada.idPeliculas,
        usuarioid: user.id,
        salasID: peliculaSeleccionada.salaAsignada.idSalas,
        reserva: true,
      } as IReserva;

      const resultado = await ReservaServices.postReserva(reserva);

      if (!resultado) {
        setErrorMensaje("No se pudo crear la reserva. Intenta de nuevo.");
        return;
      }

      setSuccessMensaje(`¡Reserva creada con éxito para ${peliculaSeleccionada.nombrePelicula} a las ${horarioSeleccionado}!`);
      
      // Resetear el formulario después de 2 segundos y redirigir
      setTimeout(() => {
        setPeliculaSeleccionada(null);
        setHorarioSeleccionado("");
        navigate("/home");
      }, 2000);
    } catch (error) {
      console.error("Error al crear reserva:", error);
      setErrorMensaje("Error al crear la reserva. Verifica tu conexión e intenta de nuevo.");
    }
  };

  // Mostrar nada mientras se carga o si es admin
  if (loading || !user || user.rol) {
    return (
      <div className="reserva-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="reserva-container">
      <div className="reserva-card">
        <h2 className="reserva-titulo">Reservar Película</h2>
        <p className="reserva-subtitulo">Usuario: {user.email}</p>

        {loadingPeliculas ? (
          <div className="loading">Cargando películas disponibles...</div>
        ) : (
          <form onSubmit={handleSubmit} className="reserva-form">
            {/* Selector de Película */}
            <div className="form-group">
              <label htmlFor="pelicula">Selecciona una Película *</label>
              <select
                id="pelicula"
                value={peliculaSeleccionada?.idPeliculas || ""}
                onChange={handlePeliculaChange}
                required
                className="form-select"
              >
                <option value="">-- Selecciona una película --</option>
                {peliculasConCartelera.map((pelicula) => (
                  <option key={pelicula.idPeliculas} value={pelicula.idPeliculas}>
                    {pelicula.nombrePelicula} ({pelicula.categoria})
                  </option>
                ))}
              </select>
            </div>

            {/* Sala asignada (solo lectura) */}
            {peliculaSeleccionada && peliculaSeleccionada.salaAsignada && (
              <div className="form-group">
                <label>Sala Asignada</label>
                <input
                  type="text"
                  value={`Sala ${peliculaSeleccionada.salaAsignada.idSalas} - ${peliculaSeleccionada.salaAsignada.asientos} asientos`}
                  readOnly
                  className="form-input-readonly"
                />
              </div>
            )}

            {/* Información de la película */}
            {peliculaSeleccionada && (
              <div className="form-group">
                <label>Información de la Película</label>
                <div className="pelicula-info-box">
                  <p><strong>Descripción:</strong> {peliculaSeleccionada.descripcion}</p>
                  <p><strong>Duración:</strong> {peliculaSeleccionada.duracion}</p>
                </div>
              </div>
            )}

            {/* Selector de Horario */}
            {peliculaSeleccionada && peliculaSeleccionada.cartelera && peliculaSeleccionada.cartelera.length > 0 && (
              <div className="form-group">
                <label htmlFor="horario">Selecciona un Horario *</label>
                <select
                  id="horario"
                  value={horarioSeleccionado}
                  onChange={(e) => setHorarioSeleccionado(e.target.value)}
                  required
                  className="form-select"
                >
                  <option value="">-- Selecciona un horario --</option>
                  {peliculaSeleccionada.cartelera.map((carteleraItem) => (
                    <option key={carteleraItem.idCartelera} value={carteleraItem.horarios}>
                      {carteleraItem.horarios}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Mensajes de error y éxito */}
            {errorMensaje && (
              <div className="mensaje-error">{errorMensaje}</div>
            )}
            {successMensaje && (
              <div className="mensaje-exito">{successMensaje}</div>
            )}

            <button 
              type="submit" 
              className="btn-reservar"
              disabled={!peliculaSeleccionada || !horarioSeleccionado}
            >
              Confirmar Reserva
            </button>
          </form>
        )}

        <button className="btn-volver" onClick={() => navigate("/home")}>
          Volver a la Cartelera
        </button>
      </div>
    </div>
  );
};

export default Reservar;
