import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, getCurrentUser, onAuthStateChange, signOut, handleAuthCallback } from '../lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  connectionError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if this is a callback from magic link (URL contains auth params)
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        if (hashParams.get('access_token') || queryParams.get('code')) {
          // Handle auth callback from magic link
          const result = await handleAuthCallback();
          if (result.success && result.user) {
            setUser(result.user);
            setConnectionError(null);
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
          } else if (result.error) {
            setConnectionError(result.error);
          }
        }
        
        // Check current session
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setConnectionError(null);
        }
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        // Don't set a connection error here - let the app load in offline mode
        setConnectionError(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange((authUser) => {
      setUser(authUser);
      setIsLoading(false);
      setConnectionError(null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      logout,
      setUser,
      connectionError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
