// src/components/Nav.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../pages/Nav.css';

export default function Nav() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Inicio', icon: '🏠' },
    { path: '/doors', label: 'Puertas', icon: '🚪' },
    { path: '/users', label: 'Usuarios', icon: '👥' },
    { path: '/access', label: 'Accesos', icon: '📊' },
    { path: '/alarms', label: 'Alarmas', icon: '🚨' }
  ];

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-brand">
          <div className="nav-logo">🔐</div>
          <span className="nav-brand-text">Verkada</span>
        </div>
        
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'nav-link-active' : ''}`}
            >
              <span className="nav-link-icon">{item.icon}</span>
              <span className="nav-link-text">{item.label}</span>
            </Link>
          ))}
        </div>
        
        <div className="nav-user">
          <div className="nav-user-avatar">👤</div>
          <span className="nav-user-name">Admin</span>
        </div>
      </div>
    </nav>
  );
}