import React, { useState } from "react";
import { PeliculaServices } from "../services/pelicula.service";
import { StorageService } from "../services/storage.service";
import type { INuevaPelicula } from "../interfaces/peliculas.interfaces";
import "../styles/subirPeliculas.css"
const CATEGORIAS: string[] = ["terror", "accion", "comedia", "suspenso"];

const SubirPeliculas: React.FC = () => {
  const [nombrePelicula, setNombrePelicula] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [duracion, setDuracion] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<(typeof CATEGORIAS)[number]>(CATEGORIAS[0]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<File | null>(null);
  const [previewImagen, setPreviewImagen] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        setErrorMensaje("Por favor, selecciona un archivo de imagen válido");
        return;
      }
      setImagenSeleccionada(file);
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagen(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMensaje("");
    setSubiendo(true);

    if (nombrePelicula === "") {
      setErrorMensaje("El nombre de la pelicula es requerido");
      setSubiendo(false);
      return;
    }
    if (descripcion === "") {
      setErrorMensaje("La descripcion es requerida");
      setSubiendo(false);
      return;
    }
    if (duracion === "") {
      setErrorMensaje("La duracion es requerida");
      setSubiendo(false);
      return;
    }

    try {
      // Primero crear la película para obtener el ID
      const pelicula: INuevaPelicula = {
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
      
      if (!resultado) {
        setErrorMensaje("Error al subir la pelicula");
        setSubiendo(false);
        return;
      }

      // Si hay imagen, subirla al storage
      if (imagenSeleccionada && resultado.idPeliculas) {
        const urlImagen = await StorageService.uploadImage(imagenSeleccionada, resultado.idPeliculas);
        
        if (urlImagen) {
          // Actualizar la película con la URL de la imagen
          await PeliculaServices.putPelicula(resultado.idPeliculas, { urlImagen });
        } else {
          setErrorMensaje("Película creada pero error al subir la imagen");
          setSubiendo(false);
          return;
        }
      }

      setErrorMensaje("Pelicula subida correctamente");
      // Limpiar campos después de subir exitosamente
      setNombrePelicula("");
      setDescripcion("");
      setDuracion("");
      setCategoriaSeleccionada(CATEGORIAS[0]);
      setImagenSeleccionada(null);
      setPreviewImagen(null);
      
      // Limpiar el input de archivo
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error("Error al subir película:", error);
      setErrorMensaje("Error al subir la pelicula");
    } finally {
      setSubiendo(false);
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
          
          <div style={{ marginTop: '1rem' }}>
            <label htmlFor="imagen" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Imagen de la Película
            </label>
            <input
              type="file"
              id="imagen"
              accept="image/*"
              onChange={handleImagenChange}
              style={{ marginBottom: '0.5rem' }}
            />
            {previewImagen && (
              <div style={{ marginTop: '1rem' }}>
                <img 
                  src={previewImagen} 
                  alt="Preview" 
                  style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '8px', border: '2px solid #ddd' }}
                />
              </div>
            )}
          </div>

          <button type="submit" disabled={subiendo}>
            {subiendo ? "Subiendo..." : "Subir Pelicula"}
          </button>
          {errorMensaje && <p style={{ color: errorMensaje.includes("correctamente") ? "green" : "red" }}>{errorMensaje}</p>}
        </form>
      </div>
    </>
  );
};

export default SubirPeliculas;
