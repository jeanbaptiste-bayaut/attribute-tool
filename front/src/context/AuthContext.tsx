// AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

// Définir le type du contexte
export interface AuthContextType {
  userName: string | null;
  login: (userName: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
  value?: AuthContextType;
}

// Créer un contexte pour stocker l'état de l'authentification
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Créer un composant AuthProvider pour gérer l'état de l'authentification
export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  value,
}) => {
  // Récupérer le token dans le localStorage
  const [userName, setUserName] = useState<string | null>(() => {
    return localStorage.getItem('userName') || null;
  });

  // Fonction pour se connecter
  const login = (userName: string) => {
    setUserName(userName);
    localStorage.setItem('userId', userName);
  };

  // Fonction pour se déconnecter
  const logout = () => {
    setUserName(null);
    localStorage.removeItem('userName');
  };

  // Vérifier si un token est présent dans le localStorage et le récupérer pour initialiser l'état
  // de l'authentification lors du chargement du composant AuthProvider
  useEffect(() => {
    const storeduserName = Cookies.get('username');
    if (storeduserName) {
      setUserName(storeduserName);
    }
  }, []);

  // Rendre le contexte accessible aux composants enfants
  return (
    <AuthContext.Provider value={value || { userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Créer un hook pour accéder au contexte de l'authentification
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  // Récupérer le contexte de l'authentification
  const context = useContext(AuthContext);
  // Vérifier si le hook est utilisé en dehors du AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
