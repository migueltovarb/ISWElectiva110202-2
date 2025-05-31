// src/pages/Doors.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import '../pages/Doors.css';

export default function Doors() {
  const [doors, setDoors] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const fetchDoors = async () => {
    const res = await api.get('doors/');
    setDoors(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('doors/', { name, location });
    setName('');
    setLocation('');
    fetchDoors();
  };

  useEffect(() => {
    fetchDoors();
  }, []);

  return (
    <div className="doors-container">
      {/* Header */}
      <div className="doors-card doors-header">
        <h2 className="doors-title">Registrar Puerta</h2>
        <div className="doors-divider"></div>
      </div>

      {/* Form Section */}
      <div className="doors-card">
        <form onSubmit={handleSubmit} className="doors-form">
          <div className="doors-input-group">
            <div>
              <label className="doors-label">Nombre de la Puerta</label>
              <input
                type="text"
                placeholder="Ingresa el nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="doors-input"
              />
            </div>
            
            <div>
              <label className="doors-label">Ubicación</label>
              <input
                type="text"
                placeholder="Ingresa la ubicación"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="doors-input"
              />
            </div>
          </div>

          <button type="submit" className="doors-button">
            ✨ Registrar Puerta
          </button>
        </form>
      </div>

      {/* Doors List Section */}
      <div className="doors-card">
        <div className="doors-list-title">
          <span>Puertas Registradas</span>
          <div className="doors-counter">
            {doors.length} {doors.length === 1 ? 'puerta' : 'puertas'}
          </div>
        </div>

        {doors.length === 0 ? (
          <div className="doors-empty-state">
            <div className="doors-empty-icon">🚪</div>
            <p className="doors-empty-text">No hay puertas registradas aún</p>
            <p className="doors-empty-subtext">¡Agrega tu primera puerta!</p>
          </div>
        ) : (
          <div className="doors-grid">
            {doors.map((door, index) => (
              <div key={door.id} className="door-card">
                <div className="door-header">
                  <div className="door-number">{index + 1}</div>
                  <div className="door-icon">🚪</div>
                </div>
                
                <h4 className="door-name">{door.name}</h4>
                
                <div className="door-location">
                  <span className="door-location-icon">📍</span>
                  <span>{door.location}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}