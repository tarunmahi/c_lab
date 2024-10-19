
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) return <h2>Loading...</h2>;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h2>Welcome, {auth.email}</h2>  {/* Display email or username */}
      <p>Role: {auth.role}</p>  {/* Display user role */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
