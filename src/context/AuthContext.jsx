// context/AuthContext.jsx — status login pengguna, disimpan di localStorage
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  }

 // async function register(name, email, password) {
  //  const data = await api.post('/auth/register', { name, email, password });
    //localStorage.setItem('token', data.token);
  //  setUser(data.user);
    //return data.user;
    
    // Langkah 1: Minta kode OTP ke email
  async function requestRegister(name, email, password) {
    return await api.post('/auth/register-request', { name, email, password });
  }
  // Langkah 2: Verifikasi OTP dan aktifkan akun di TiDB
  async function verifyOtp(email, otp) {
    const data = await api.post('/auth/verify-otp', { email, otp });
    if (data.token) {
      localStorage.setItem('token', data.token);
      setUser(data.user);
    }
    return data;
  }

  async function loginWithGoogle(credential) {
    const data = await api.post('/auth/google', { credential });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        requestRegister,
        verifyOtp,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
