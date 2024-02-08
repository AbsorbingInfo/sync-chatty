import { createContext, useContext, useState, FC, ReactNode } from 'react';
import { useEffect } from 'react';
import AuthenticationService from '../services/AuthenticationService';

export interface UserType {
  id: string;
  username: string;
  roomId: string | null;
}

interface UserContextType {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const checkLoginStatus = async () => {
    const response = await AuthenticationService.isLoggedIn();
    if (response?.status === 200) {
      if (response.data.isLoggedIn) {
        console.log('==>', response.data.user);
        setUser(response.data.user);
      }
    }
  };
  useEffect(() => {
    checkLoginStatus();
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
