import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    role: 'User',
  });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    await register(userData);
    navigate('/login');
  };
  const handlebackto = () => {
    navigate('/login')
  };
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={userData.password}
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
        />
         
        <select value={userData.role} onChange={(e) => setUserData({ ...userData, role: e.target.value })}>
          <option value="User">User</option>
          <option value="Root">Root</option>
        </select>
        <button type="submit">Register</button>
        <button onClick={handlebackto}>Back to Login</button>
      </form>
    </div>
  );
};

export default Register;