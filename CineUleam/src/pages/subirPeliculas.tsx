import { useState } from "react";
import { PeliculaServices } from "../services/pelicula.service";
import type { IPeliculas } from "../interfaces/peliculas.interfaces";
const CATEGORIAS: string[] = ["terror", "accion", "comedia", "suspenso"];

const SubirPeliculas: React.FC = () => {
  const [nombrePelicula, setNombrePelicula] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [duracion, setDuracion] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    (typeof CATEGORIAS)[number]
  >(CATEGORIAS[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMensaje("");

    if (nombrePelicula === "") {
      setErrorMensaje("El nombre de la pelicula es requerido");
      return;
    }
    if (descripcion === "") {
      setErrorMensaje("La descripcion es requerida");
      return;
    }
    if (duracion === "") {
      setErrorMensaje("La duracion es requerida");
      return;
    }
    const pelicula: Omit<IPeliculas, "idPeliculas"> = {
      nombrePelicula,
      descripcion,
      duracion,
      categoria: categoriaSeleccionada as
        | "terror"
        | "accion"
        | "comedia"
        | "suspenso",
    };

    const resultado = await PeliculaServices.postPelicula(pelicula);
    console.log(resultado);
    if (resultado) {
      setErrorMensaje("Pelicula subida correctamente");
    } else {
      setErrorMensaje("Error al subir la pelicula");
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
          <button type="submit">Subir Pelicula</button>
          {errorMensaje && <p>{errorMensaje}</p>}
        </form>
      </div>
    </>
  );
};

export default SubirPeliculas;
