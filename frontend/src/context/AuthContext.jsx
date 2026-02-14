import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);   // full org profile
  const [loading, setLoading] = useState(true);    // initial load
  const [token, setTokenState] = useState(() => localStorage.getItem('auth_token'));

  // Persist token to localStorage + state in one go
  const setToken = (t) => {
    if (t) {
      localStorage.setItem('auth_token', t);
    } else {
      localStorage.removeItem('auth_token');
    }
    setTokenState(t);
  };

  // On mount (or when token changes), fetch the user profile
  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    api.get('/auth/me')
      .then((data) => { if (!cancelled) setUser(data); })
      .catch(() => {
        // Token invalid / expired → clear auth
        if (!cancelled) {
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [token]);

  // ── Login ───────────────────────────────────
  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    setToken(data.token);
    // Store basic info immediately so components can read it
    // before the /me fetch completes
    localStorage.setItem('org_name', data.org_name);
    localStorage.setItem('org_id', data.org_id);
    setUser({ org_id: data.org_id, org_name: data.org_name });
    return data;
  };

  // ── Register ────────────────────────────────
  const register = async (formData) => {
    const data = await api.post('/auth/register', formData);
    return data;
  };

  // ── Logout ──────────────────────────────────
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('org_name');
    localStorage.removeItem('org_id');
  };

  // ── Refresh profile (call after profile edits) ──
  const refreshProfile = async () => {
    try {
      const data = await api.get('/auth/me');
      setUser(data);
    } catch { /* ignore */ }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
