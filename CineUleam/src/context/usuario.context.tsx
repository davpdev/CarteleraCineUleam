import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../api/supabase.config";

interface UserContextProps {
  user: null;
  loading: boolean;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  loading: true
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
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
  
        setUser({ ...user, rol: profile?.rol ?? false });
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
  
        setUser({ ...session.user, rol: profile?.rol ?? false });
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
