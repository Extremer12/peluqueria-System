import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>✂️ Peluquería</h1>
        <div className="navbar-actions">
          <span>Hola, {user?.name}</span>
          {user?.role === 'client' && (
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/book')}
            >
              Reservar Turno
            </button>
          )}
          <button className="btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;