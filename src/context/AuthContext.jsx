import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // აპლიკაციის ჩატვირთვისას ვამოწმებთ ტოკენს
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await authApi.getMe();
        setUser(data.user || data);
      } catch {
        localStorage.removeItem('accessToken');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  // ლოგინის ფუნქცია
  const login = async (credentials, navigate) => {
    const data = await authApi.login(credentials);
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
    if (navigate) navigate('/');
  };

  // რეგისტრაციის ფუნქცია
  const register = async (userData, navigate) => {
    const data = await authApi.register(userData);
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
    if (navigate) navigate('/');
  };

  // გამოსვლის ფუნქცია
  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // თუნდაც სერვერზე მოთხოვნა ჩავარდეს, კლიენტთან ვასუფთავებთ
    }
    localStorage.removeItem('accessToken');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}