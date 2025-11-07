import { supabase } from "../api/supabase.config";


export const authService = {
    singIn: async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error){
                console.log('Error al iniciar sesión', error.message)
                return 
            }
            return data
        } catch (error) {	
            console.error(error)
            throw error
        }
    },

    singUp: async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: "http://localhost:5173/home"
                }
            })
            if (error){
                console.log('Error al registrar usuario', error.message)
                return 
            }
            return data
        } catch (error) {
            console.error(error)
            throw error
        }
    },

    singOut: async () => {
        const { error } = await supabase.auth.signOut()
        if (error){
            console.log('Error al cerrar sesión', error.message)
            return 
        }
    },

    singInGoogle: async() =>{
        try{
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: "http://localhost:5173/home"
                }
            });
            if ( error ){
                console.log('Error al autentificarse con google', error.message)
                return null;
            }
            return data;
        }catch (e){
            console.error(e)
            throw e
        }
    }

}