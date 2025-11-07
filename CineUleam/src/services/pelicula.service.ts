import { supabase } from "../api/supabase.config";
import type { IPeliculas } from "../interfaces/peliculas.interfaces";

export const PeliculaServices = {
    postPelicula: async(pelicula: Omit<IPeliculas, "idPeliculas">) =>{
        try{
            const {data, error} = await supabase.from('Peliculas').insert(pelicula).select().single();
            if(error){
                console.log('Error al subir pelicula', error.message);
                console.log('Error details:', error);
                throw error; // Lanzar el error para que pueda ser capturado
            }
            return data as IPeliculas;
        }catch (e){
            console.log('Error', e);
            throw e; // Re-lanzar para manejo de errores
        }
    },

    getAllPeliculas: async() =>{
        const {data, error} = await supabase.from('Peliculas').select('*');
        if(error){
            console.log('error al visualizar todas las peliculas', error.message);
            return null;
        }
        return data as IPeliculas[];
    },


    getByIdPelicula: async(idPeliculas: string) =>{
        const {data, error} = await supabase.from('Peliculas').select().eq('idPeliculas', idPeliculas).single();

        if(error){
            console.log('Error al obtener la pelicula por el id', error.message);
            return null;
        }
        return data as IPeliculas;
    },

    putPelicula: async(idPeliculas: string, pelicula: Partial<IPeliculas>) =>{
        const {data, error} = await supabase.from('Peliculas').update(pelicula).eq('idPeliculas', idPeliculas).single();
        if(error){
            console.log('Error al obtener actualizar la pelicula por el id', error.message)
            return null;
        }
        return data as IPeliculas;
    },

    deletePelicula: async(idPeliculas: string) =>{
        const {error} = await supabase.from('Peliculas').delete().eq('idPeliculas', idPeliculas);
        if(error){
            console.log('Error al eliminar pelicula', error.message)
            return false;
        }
        return true;
    }
}