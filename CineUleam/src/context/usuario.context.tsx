import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../api/supabase.config";
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
      setLoading(false);
    };
  
    getSession();
  
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Set user immediately without profile data
        setUser({ ...session.user, rol: false } as UserWithRol);
        
        // Defer profile fetch to avoid dead-lock
        setTimeout(async () => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("rol")
            .eq("id", session.user.id)
            .single();
  
          setUser({ ...session.user, rol: profile?.rol ?? false } as UserWithRol);
        }, 0);
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
export const useUser = () => useContext(UserContext);
