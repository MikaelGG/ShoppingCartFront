import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      try {
        const tokdecoded = jwtDecode(token);
        const tokiat = tokdecoded.iat;
        const tokexp = tokdecoded.exp;

        const currentTime = Math.floor(Date.now() / 1000);
        const timeRemaining = tokexp - currentTime;

        currentTime >= tokexp ? setToken(null) && console.log('Token expirado') : console.log('Token válido,' + ` expira en ${timeRemaining} segundos`);
      } catch (error) {
        console.error('Error decodificando token:', error);
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
