export interface IPeliculas{
    idPeliculas: string;
    nombrePelicula: string;
    categoria: 'terror' | 'accion' | 'comedia' | 'suspenso';
    descripcion: string;
    duracion: string;
}