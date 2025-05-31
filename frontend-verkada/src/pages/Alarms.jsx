import React, { useEffect, useState } from 'react';
import api from '../api/api';

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
    <div>
      <h2>Registrar Alarma</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre de la alarma"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Guardar Alarma</button>
      </form>

      <h3>Alarmas Registradas</h3>
      <ul>
        {alarms.map((alarm) => (
          <li key={alarm.id}>
            {alarm.name}: {alarm.description}
            <button
              onClick={() => handleDelete(alarm.id)}
              style={{ marginLeft: '10px', color: 'red' }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
