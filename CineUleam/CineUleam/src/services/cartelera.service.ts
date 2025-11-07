import { supabase } from "../api/supabase.config";
import type { ICartelera } from "../interfaces/cartelera.interfaces";

export const categoriaService= {

    postCartelera: async(cartelera: ICartelera) =>{
        const {data, error} = await supabase.from('Cartelera').insert(cartelera).select().single();
        if(error){
            console.log('Error al crear la cartelera');
            return null;
        }
        return data as ICartelera
    },


    getAllCartelera: async() =>{
        const {data, error} = await supabase.from('Cartelera').select('*');
        if(error){
            console.log('Error al cargar las peliculas',error.message)
            return null;
        }
        return data as ICartelera[];
    },

    getByIdCartelera: async(idCartelera: string) =>{
        const {data, error} = await supabase.from('Cartelera').select().eq('idCartelera', idCartelera).single();
        if( error ){
            console.log('Error al obtener la cartelera', error.message);
            return null;
        }
        return data as ICartelera;
    },

    putCartelera: async (idCartelera: string, cartelera: Partial<ICartelera>) =>{
        const {data, error} = await supabase.from('Cartelera').update(cartelera).eq('idCartelera', idCartelera).single();
        if( error ){
            console.log('Error al actualizar la cartelera', error.message);
            return null;
        }
        return data as ICartelera;
    },

    deleteCartelera: async(idCartelera: string) =>{
        const {error} = await supabase.from('Cartelera').delete().eq('idCartelera', idCartelera).single();
        if( error ){
            console.log('Error al actualizar la cartelera', error.message);
            return false;
        }
        return true;
    }

}
