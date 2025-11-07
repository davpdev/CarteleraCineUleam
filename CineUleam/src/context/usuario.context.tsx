import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../api/supabase.config";
import React from "react";
import type { User } from "@supabase/supabase-js";

interface UserWithRol extends User {
  rol?: boolean;
}

interface UserContextProps {
  user: UserWithRol | null;
  loading: boolean;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  loading: true
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserWithRol | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("rol")
          .eq("id", user.id)
          .single();
  
        setUser({ ...user, rol: profile?.rol ?? false } as UserWithRol);
      } else {
        setUser(null);
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("rol")
          .eq("id", user.id)
          .single();
  
        setUser({ ...user, rol: profile?.rol ?? false } as UserWithRol);
      } else {
        setUser(null);
      }
      setLoading(false);
    };
  
  
    getSession();
  
  
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
  
  
    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};  

// Hook para usarlo fácil
export const useUser = (): UserContextProps => useContext(UserContext);
