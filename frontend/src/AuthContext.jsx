import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, logout as apiLogout, me } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    me()
      .then((r) => {
        if (r.user) setUser(r.user);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const r = await apiLogin(email, password);
    if (r.user) {
      setUser(r.user);
      return { ok: true, msg: r.msg };
    }
    return { ok: false, msg: r.msg || 'Error al iniciar sesión' };
  }

  async function logout() {
    await apiLogout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
