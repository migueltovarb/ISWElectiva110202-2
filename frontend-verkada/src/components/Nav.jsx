// src/components/Nav.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <nav>
      <Link to="/">Inicio</Link> | 
      <Link to="/doors">Puertas</Link> | 
      <Link to="/users">Usuarios</Link> | 
      <Link to="/access">Accesos</Link> | 
      <Link to="/alarms">Alarmas</Link>
    </nav>
  );
}
