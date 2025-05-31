import React, { useEffect, useState } from 'react';
import api from '../api/api';
import './Alarms.css'; // Importa el archivo CSS

export default function Alarms() {
  const [alarms, setAlarms] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchAlarms = async () => {
    try {
      const res = await api.get('alarms/');
      setAlarms(res.data);
    } catch (err) {
      console.error('Error al cargar alarmas:', err.response?.data || err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('alarms/', { name, description });
      setName('');
      setDescription('');
      fetchAlarms();
    } catch (err) {
      console.error('Error al registrar alarma:', err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`alarms/${id}/`);
      fetchAlarms();
    } catch (err) {
      console.error('Error al eliminar alarma:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchAlarms();
  }, []);

  return (
    <div className="alarms-container">
      <div className="alarms-card">
        <div className="alarms-header">
          <h2 className="alarms-title">Registrar Alarma</h2>
          <div className="alarms-divider"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="alarms-form">
          <input
            type="text"
            placeholder="Nombre de la alarma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="alarms-input"
          />
          <textarea
            placeholder="Descripción de la alarma"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="alarms-textarea"
          />
          <button type="submit" className="alarms-submit-button">
            Guardar Alarma
          </button>
        </form>
      </div>

      <div className="alarms-list-card">
        <div className="alarms-list-header">
          <h3 className="alarms-list-title">
            Alarmas Registradas
            <span className="alarms-counter">{alarms.length}</span>
          </h3>
          <div className="alarms-divider"></div>
        </div>
        
        {alarms.length === 0 ? (
          <div className="alarms-empty-state">
            <div className="alarms-empty-icon">🚨</div>
            <p className="alarms-empty-text">No hay alarmas registradas</p>
            <p className="alarms-empty-subtext">Agrega la primera alarma al sistema</p>
          </div>
        ) : (
          <ul className="alarms-list">
            {alarms.map((alarm) => (
              <li key={alarm.id} className="alarm-item">
                <div className="alarm-header">
                  <div className="alarm-info">
                    <div className="alarm-name">
                      <span className="alarm-icon">🚨</span>
                      {alarm.name}
                      <span className="alarm-status">Activa</span>
                    </div>
                    <div className="alarm-description">
                      {alarm.description}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(alarm.id)}
                    className="alarm-delete-button"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}