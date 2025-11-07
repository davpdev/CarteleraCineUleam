import React, { useState, useEffect } from "react";
import type { IPeliculas } from "../interfaces/peliculas.interfaces";
import { PeliculaServices } from "../services/pelicula.service";
import { StorageService } from "../services/storage.service";
const CATEGORIAS: string[] = ["terror", "accion", "comedia", "suspenso"];

const EditarPeliculas: React.FC = () => {
    const [peliculas, setPeliculas] = useState<IPeliculas[]>([]);
    const [peliculaSeleccionadaId, setPeliculaSeleccionadaId] = useState<string>("");
    const [nombrePelicula, setNuevoNombrePelicula] = useState("");
    const [descripcion, setNuevaDescripcion] = useState("");
    const [duracion, setNuevaDuracion] = useState("");
    const [errorMensaje, setErrorMensaje] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<(typeof CATEGORIAS)[number]>(CATEGORIAS[0]);
    const [loading, setLoading] = useState(false);
    const [imagenSeleccionada, setImagenSeleccionada] = useState<File | null>(null);
    const [previewImagen, setPreviewImagen] = useState<string | null>(null);
    const [imagenActual, setImagenActual] = useState<string | null>(null);

    useEffect(() => {
        cargarPeliculas();
    }, []);

    const cargarPeliculas = async () => {
        setLoading(true);
        const peliculasData = await PeliculaServices.getAllPeliculas();
        if (peliculasData) {
            setPeliculas(peliculasData);
        }
        setLoading(false);
    };

    const handlePeliculaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const idSeleccionado = e.target.value;
        setPeliculaSeleccionadaId(idSeleccionado);
        
        if (idSeleccionado) {
            const pelicula = await PeliculaServices.getByIdPelicula(idSeleccionado);
            if (pelicula) {
                setNuevoNombrePelicula(pelicula.nombrePelicula);
                setNuevaDescripcion(pelicula.descripcion);
                setNuevaDuracion(pelicula.duracion);
                setCategoriaSeleccionada(pelicula.categoria);
                setImagenActual(pelicula.urlImagen || null);
                setPreviewImagen(pelicula.urlImagen || null);
                setImagenSeleccionada(null);
            }
        } else {
            // Limpiar campos si no hay selección
            setNuevoNombrePelicula("");
            setNuevaDescripcion("");
            setNuevaDuracion("");
            setCategoriaSeleccionada(CATEGORIAS[0]);
            setImagenActual(null);
            setPreviewImagen(null);
            setImagenSeleccionada(null);
        }
    };

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

        if (!peliculaSeleccionadaId) {
            setErrorMensaje("Debes seleccionar una película!");
            return;
        }

        if (!nombrePelicula) {
            setErrorMensaje("Debes ingresar un nombre!");
            return; 
        }

        if (!descripcion) {
            setErrorMensaje("Debes ingresar una descripción!");
            return;
        }

        if (!duracion) {
            setErrorMensaje("Debes ingresar una duración!");
            return;
        }

        if (!categoriaSeleccionada) {
            setErrorMensaje("Debes seleccionar una categoría!");
            return;
        }

        setLoading(true);
        
        try {
            let urlImagen = imagenActual;

            // Si hay una nueva imagen seleccionada, subirla
            if (imagenSeleccionada) {
                console.log("Subiendo nueva imagen...");
                const nuevaUrlImagen = await StorageService.uploadImage(imagenSeleccionada, peliculaSeleccionadaId);
                if (nuevaUrlImagen) {
                    console.log("Imagen subida correctamente:", nuevaUrlImagen);
                    urlImagen = nuevaUrlImagen;
                } else {
                    setErrorMensaje("Error al subir la nueva imagen. Verifica la consola para más detalles.");
                    setLoading(false);
                    return;
                }
            }

            const peliculaActualizada: Partial<IPeliculas> = {
                nombrePelicula,
                descripcion,
                duracion,
                categoria: categoriaSeleccionada as
                  | "terror"
                  | "accion"
                  | "comedia"
                  | "suspenso",
            };

            // Solo agregar urlImagen si tiene un valor
            if (urlImagen) {
                peliculaActualizada.urlImagen = urlImagen;
            }

            console.log("Actualizando película con datos:", peliculaActualizada);
            const resultado = await PeliculaServices.putPelicula(peliculaSeleccionadaId, peliculaActualizada);

            if (resultado) {
                console.log("Película actualizada exitosamente:", resultado);
                setErrorMensaje("Película actualizada exitosamente!");
                // Recargar películas para reflejar cambios
                await cargarPeliculas();
                // Limpiar formulario
                setPeliculaSeleccionadaId("");
                setNuevoNombrePelicula("");
                setNuevaDescripcion("");
                setNuevaDuracion("");
                setCategoriaSeleccionada(CATEGORIAS[0]);
                setImagenActual(null);
                setPreviewImagen(null);
                setImagenSeleccionada(null);
                
                // Limpiar el input de archivo
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = '';
                }
            } else {
                setErrorMensaje("Error al actualizar la película. Revisa la consola del navegador para más detalles.");
            }
        } catch (error: any) {
            console.error("Error al actualizar película:", error);
            setErrorMensaje(`Error al actualizar la película: ${error?.message || 'Error desconocido'}. Revisa la consola para más detalles.`);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <>
          <div className="subir-peliculas-container">
            <h1>Editar Peliculas</h1>
            
            <form onSubmit={handleSubmit}>
              <select
                value={peliculaSeleccionadaId}
                onChange={handlePeliculaChange}
                disabled={loading}
              >
                <option value="">Selecciona una película</option>
                {peliculas.map((pelicula) => (
                  <option key={pelicula.idPeliculas} value={pelicula.idPeliculas}>
                    {pelicula.nombrePelicula}
                  </option>
                ))}
              </select>
    
              <input
                type="text"
                placeholder="Nombre de la película"
                value={nombrePelicula}
                onChange={(e) => setNuevoNombrePelicula(e.target.value)}
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
                onChange={(e) => setNuevaDescripcion(e.target.value)}
              />
              <input
                type="text"
                placeholder="Duracion"
                value={duracion}
                onChange={(e) => setNuevaDuracion(e.target.value)}
              />
              
              <div style={{ marginTop: '1rem' }}>
                <label htmlFor="imagen-editar" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Imagen de la Película
                </label>
                <input
                  type="file"
                  id="imagen-editar"
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

              <button type="submit" disabled={loading || !peliculaSeleccionadaId}>
                {loading ? "Actualizando..." : "Actualizar Película"}
              </button>
              
              {errorMensaje && <p style={{ color: errorMensaje.includes("exitosamente") ? "green" : "red" }}>{errorMensaje}</p>}
            </form>
          </div>
        </>
      );
}

export default EditarPeliculas;