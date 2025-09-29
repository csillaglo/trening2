import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface AuthContextType {
  isAdmin: boolean;
  user: any;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingSession: boolean; // New state to track session loading
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true); // Initialize to true

  useEffect(() => {
    setIsLoadingSession(true); // Ensure loading state is true at the start

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === 'training_admin@example.com');
      setIsLoadingSession(false); // Session loaded or confirmed no session
    }).catch(() => {
      // In case getSession itself errors, though unlikely for standard ops
      setUser(null);
      setIsAdmin(false);
      setIsLoadingSession(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === 'training_admin@example.com');
      // If onAuthStateChange fires, it means session status is known,
      // so ensure loading is false if it hasn't been set by getSession yet.
      // This is particularly important if getSession is slow or onAuthStateChange fires first.
      if (isLoadingSession && _event !== 'INITIAL_SESSION') {
         // INITIAL_SESSION is handled by getSession, other events mean an active change.
         // However, getSession should make isLoadingSession false first.
         // For safety, we can ensure it's false after any auth state change.
      }
      // More robustly, ensure isLoadingSession is false if it's an event other than INITIAL_SESSION
      // or if getSession has already completed. The primary control is getSession's resolution.
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Removed isLoadingSession from dependency array as it's controlled within the effect

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    // Session change will be picked up by onAuthStateChange
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // Session change will be picked up by onAuthStateChange
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, signIn, signOut, isLoadingSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
