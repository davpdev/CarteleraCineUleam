import { supabase } from "../api/supabase.config";
import type { IReserva } from "../interfaces/reserva.interfaces";

export const ReservaServices = {
    postReserva: async(reserva: IReserva) =>{
        try{
            const {data, error} = await supabase.from('Reserva').insert(reserva).select().single()
            if(error){
                console.log('Error al hacer la reserva', error.message)
                return null
            }
            return data as IReserva
        }catch(e){
            console.log('error', e)
        }
    },

    getAllReserva: async() => {
        const { data, error } = await supabase.from('Reserva').select('*')
        if(error){
            console.log('Error al obtener las reservas', error.message)
        }
        return data as IReserva[]
    },

    getByIdReserva: async(idReserva: string) => {
        const { data, error } = await supabase.from('Reserva').select().eq('idReserva', idReserva).single()
        if(error){
            console.log('Error al obtener la reserva', error.message)
        }
        return data as IReserva
    },

    putReserva: async(idReserva: string, reserva: Partial<IReserva>) =>{
        const { data, error } = await supabase.from('Reserva').update(reserva).eq('idReserva', idReserva).select().single()
        if(error){
            console.log('Error al actualizar la reserva', error.message)
        }
        alert('Se actualizo la reserva')
        return data as IReserva
    },

    deleteReserva: async(idReserva: string) =>{
        const { error } = await supabase.from('Reserva').delete().eq('idReserva', idReserva).single()
        if(error){
            console.log('Error al eliminar reserva', error.message)
            return false
        }
        alert('Reserva eliminada')
        return true
    }


}