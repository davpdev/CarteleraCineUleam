import { supabase } from "../api/supabase.config";
import type { INotificaciones } from "../interfaces/notificaciones.services";

export const NotificacionesServices = {
    postNotificacion: async(notificacion: INotificaciones) =>{
        try{
            const {data, error} = await supabase.from('Notificacion').insert(notificacion).select().single();
            if(error){
                console.log('Error al subir notificacion', error.message);
                return null;
            }
            return data as INotificaciones;
        }catch(e){
            console.log('Error', e);
        }
    },

    getAllNotificaciones: async() => {
        const {data, error} = await supabase.from('Notificacion').select('*');
        if (error){
            console.log('Error al obtener las notificaciones', error.message);
            return null;
        }
        return data as INotificaciones[]
    },

    getByIdNotificaciones: async (idNotificaciones: string) => { 
        const {data, error} = await supabase.from('Notificacion').select().eq('idNotificaciones', idNotificaciones).single();
        if (error){
            console.log('Error al obtener la notificacion', error.message);
            return null;
        }
        return data as INotificaciones;
    },

    putNotificaciones: async(idNotificaciones: string, notificacion: Partial<INotificaciones>) =>{
        const {data, error} = await supabase.from('Notificacion').update(notificacion).eq('idNotificaciones', idNotificaciones).single();
        if (error){
            console.log('Error al actualizar la notificacion', error.message);
            return null;
        }
        return data as INotificaciones;
    },


    deleteNotificaciones: async(idNotificaciones: string) =>{
        const {error} = await supabase.from('Notificacion').delete().eq('idNotificaciones', idNotificaciones).single();
        if (error){
            console.log('Error al elimianr la notificacion', error.message);
            return false;
        }
        return true;
    },
}