import { PeliculaServices } from "./pelicula.service";
import { categoriaService } from "./cartelera.service";
import { SalaServices } from "./sala.service";
import type { IPeliculas } from "../interfaces/peliculas.interfaces";
import type { ICartelera } from "../interfaces/cartelera.interfaces";
import type { ISalas } from "../interfaces/salas.interfaces";
import type { IPeliculaConCartelera } from "../interfaces/home.interfaces";

export const HomeService = {
    cargarDatos: async (): Promise<{
        peliculas: IPeliculas[];
        cartelera: ICartelera[];
        salas: ISalas[];
    }> => {
        const [peliculasData, carteleraData, salasData] = await Promise.all([
            PeliculaServices.getAllPeliculas(),
            categoriaService.getAllCartelera(),
            SalaServices.getAllSalas()
        ]);

        return {
            peliculas: peliculasData || [],
            cartelera: carteleraData || [],
            salas: salasData || []
        };
    },

    combinarDatos: (
        peliculas: IPeliculas[],
        cartelera: ICartelera[],
        salas: ISalas[]
    ): IPeliculaConCartelera[] => {
        return peliculas.map(pelicula => {
            const cartelerasPelicula = cartelera.filter(c => c.peliculasID === pelicula.idPeliculas);
            return {
                ...pelicula,
                cartelera: cartelerasPelicula,
                salaAsignada: salas.find((_, index) => index === peliculas.indexOf(pelicula) % salas.length)
            };
        });
    },

    filtrarPeliculas: (
        peliculas: IPeliculaConCartelera[],
        salaFiltro: string,
        categoriaFiltro: string
    ): IPeliculaConCartelera[] => {
        return peliculas.filter(pelicula => {
            const pasaFiltroSala = salaFiltro === "todas" || 
                (pelicula.salaAsignada && pelicula.salaAsignada.idSalas === salaFiltro);
            const pasaFiltroCategoria = categoriaFiltro === "todas" || 
                pelicula.categoria === categoriaFiltro;
            return pasaFiltroSala && pasaFiltroCategoria;
        });
    }
};

