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
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
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
