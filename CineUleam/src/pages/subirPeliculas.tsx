import { useState } from "react";
import { PeliculaServices } from "../services/pelicula.service";
import type { IPeliculas } from "../interfaces/peliculas.interfaces";
import { useUser } from "../context/usuario.context";
const CATEGORIAS: string[] = ["terror", "accion", "comedia", "suspenso"];

const SubirPeliculas: React.FC = () => {
  const [nombrePelicula, setNombrePelicula] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [duracion, setDuracion] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
  const [successMensaje, setSuccessMensaje] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    (typeof CATEGORIAS)[number]
  >(CATEGORIAS[0]);
  
  const { user, loading } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMensaje("");
    setSuccessMensaje("");

    if (loading) {
      setErrorMensaje("Cargando información de usuario...");
      return;
    }

    if (!user || !user.id) {
      setErrorMensaje("Debes iniciar sesión para subir una película");
      return;
    }

    if (nombrePelicula.trim() === "") {
      setErrorMensaje("El nombre de la pelicula es requerido");
      return;
    }
    if (descripcion.trim() === "") {
      setErrorMensaje("La descripcion es requerida");
      return;
    }
    if (duracion.trim() === "") {
      setErrorMensaje("La duracion es requerida");
      return;
    }

    try {
      const pelicula: Omit<IPeliculas, "idPeliculas"> = {
        nombrePelicula: nombrePelicula.trim(),
        descripcion: descripcion.trim(),
        duracion: duracion.trim(),
        categoria: categoriaSeleccionada as
          | "terror"
          | "accion"
          | "comedia"
          | "suspenso",
        usuario_id: user.id
      };

      const resultado = await PeliculaServices.postPelicula(pelicula);
      
      if (resultado) {
        setSuccessMensaje("Pelicula subida correctamente");
        // Limpiar el formulario
        setNombrePelicula("");
        setDescripcion("");
        setDuracion("");
        setCategoriaSeleccionada(CATEGORIAS[0]);
      }
    } catch (error: any) {
      console.error("Error al subir película:", error);
      
      // Manejar error de RLS específicamente
      if (error?.message?.includes("row-level security policy")) {
        setErrorMensaje(
          "Error de permisos: No tienes permisos para crear películas. " +
          "Verifica que las políticas RLS en Supabase permitan INSERT para usuarios autenticados. " +
          `Usuario ID: ${user.id}`
        );
      } else if (error?.message) {
        setErrorMensaje(`Error al subir la película: ${error.message}`);
      } else {
        setErrorMensaje("Error al subir la película. Verifica tu conexión y permisos.");
      }
    }
  };

  return (
    <>
      <div className="subir-peliculas-container">
        <h1>Subir Peliculas</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre de la pelicula"
            value={nombrePelicula}
            onChange={(e) => setNombrePelicula(e.target.value)}
          />

          <select
            value={categoriaSeleccionada}
            onChange={(e) =>
              setCategoriaSeleccionada(
                e.target.value as (typeof CATEGORIAS)[number]
              )
            }
          >
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <input
            type="text"
            placeholder="Duracion"
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
          />
          <button type="submit" disabled={loading || !user}>
            {loading ? "Cargando..." : "Subir Pelicula"}
          </button>
          {errorMensaje && <p style={{ color: "red" }}>{errorMensaje}</p>}
          {successMensaje && <p style={{ color: "green" }}>{successMensaje}</p>}
        </form>
      </div>
    </>
  );
};

export default SubirPeliculas;
