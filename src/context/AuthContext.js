import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create Auth Context
const API='http://3.87.252.240:3000/api'
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  const login = async (credentials) => {
    try {
      const res = await axios.post(`${API}/login`, credentials);
      const { token, user } = res.data;
      localStorage.setItem('token', token);  // Store token
      setAuth(user);  // Set user data
    } catch (err) {
      console.error(err);
    }
  };
   
  const register = async (userData) => {
    try {
      console.log(userData);
      await axios.post(`${API}/register/`, userData);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user data based on token
      axios.get(`${API}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then((res) => setAuth(res.data)).catch(() => logout());
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
