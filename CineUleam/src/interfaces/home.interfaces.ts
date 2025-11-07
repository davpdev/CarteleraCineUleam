import type { IPeliculas } from "./peliculas.interfaces";
import type { ICartelera } from "./cartelera.interfaces";
import type { ISalas } from "./salas.interfaces";

export interface IPeliculaConCartelera extends IPeliculas {
    cartelera?: ICartelera[];
    salaAsignada?: ISalas;
}

