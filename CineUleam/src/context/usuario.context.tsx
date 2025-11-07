import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../api/supabase.config";
import type { User } from "@supabase/supabase-js";
import React from "react";

interface UserWithRol extends User {
  rol?: boolean;
}

interface UserContextProps {
  user: UserWithRol | null;
  loading: boolean;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserWithRol | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      // Obtenemos el usuario actual
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (currentUser) {
        // Obtenemos el rol desde la tabla profiles
        const { data: profile } = await supabase
          .from("profiles")
          .select("rol")
          .eq("id", currentUser.id)
          .single();

        setUser({ ...currentUser, rol: profile?.rol ?? false } as UserWithRol);
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    getSession();

    // Suscribimos a los cambios de sesión (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("rol")
          .eq("id", session.user.id)
          .single();

        setUser({ ...session.user, rol: profile?.rol ?? false } as UserWithRol);
      } else {
        setUser(null);
      }
    });

    // Limpiamos la suscripción al desmontar el componente
    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usarlo en cualquier componente
export const useUser = (): UserContextProps => useContext(UserContext);
