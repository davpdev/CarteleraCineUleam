import { supabase } from "../api/supabase.config";
import type { ISalas } from "../interfaces/salas.interfaces";

export const SalaServices = {
    postSalas: async (salas: ISalas ) => {
        const {data, error } = await supabase.from('Salas').insert(salas).select().single();
        if(error){
            console.log('error al ingresar salas', error.message)
            return null;
        }
        return data as ISalas;
    },

    getAllSalas: async ( ) => {
        const {data, error } = await supabase.from('Salas').select();
        if(error){
            console.log('error al encontrar las salas', error.message)
            return null;
        }
        return data as ISalas[];
    },

    getByIdSalas: async (idSalas: string ) => {
        const {data, error } = await supabase.from('Salas').select().eq('idSalas', idSalas).single();
        if(error){
            console.log('error al encontrar la sala', error.message)
            return null;
        }
        return data as ISalas;
    },

    putSalas: async (idSalas: string, salas: Partial<ISalas>) => {
        const {data, error } = await supabase.from('Salas').update(salas).eq('idSalas', idSalas).single();
        if(error){
            console.log('error al ingresar salas', error.message)
            return null;
        }
        return data as ISalas;
    },

    deleteSalas: async (idSalas: string ) => {
        const { error } = await supabase.from('Salas').delete().eq('idSalas', idSalas).single();
        if(error){
            console.log('error al ingresar salas', error.message)
            return false;
        }
        return true;
    }


}